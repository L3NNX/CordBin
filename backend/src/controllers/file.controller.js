import { AttachmentBuilder } from "discord.js";
import crypto from "crypto";     
import metaDataModel from "../models/metaData.js";
// import client from "../utils/discord.js";
import client, { waitForDiscord, isDiscordReady } from "../utils/discord.js";
import { encryptChunk, decryptChunk } from "../utils/encryption.js";
// client.login(process.env.DISCORD_BOT_TOKEN);

export const initaliseFileUpload = async (req, res) => {
  try {
    const { fileName, fileSize, fileType, totalChunks } = req.body;
    const userId = req.userId;

    if (!fileName || !fileSize || !fileType || !totalChunks) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Save metadata to database
    const metaData = new metaDataModel({
      fileName,
      fileSize,
      fileType,
      ownerId: userId,
      totalChunks,
      status: 'uploading',
      isEncrypted: true,
      chunksMetadata: Array.from({ length: totalChunks }, (_, i) => ({
        chunkIndex: i + 1,
        messageId: "",
      })),
    });
    await metaData.save();

    res
      .status(200)
      .json({ message: "File upload initialized", fileId: metaData._id });
  } catch (error) {
    console.error("Error initializing file upload:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const uploadChunk = async (req, res) => {
  try {
    const { fileId, chunkIndex, totalChunks } = req.body;
    const chunk = req.file;

    if (!fileId || !chunkIndex || !chunk) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const metaData = await metaDataModel.findById(fileId);
    if (!metaData) {
      return res.status(404).json({ message: "File metadata not found" });
    }

    const ready = await waitForDiscord(15000);
    if (!ready) {
      return res.status(503).json({
        message: "Discord bot is starting up. Please retry.",
      });
    }

    console.log(`Uploading chunk ${chunkIndex}/${totalChunks} to Discord`);

    if (!chunk.buffer) {
      return res.status(400).json({ message: "Chunk file buffer is missing" });
    }

     const { encrypted, iv } = encryptChunk(chunk.buffer, fileId);
      // ✅ OBFUSCATE the filename — Discord sees random name, not original
    const obfuscatedName = `${crypto.randomBytes(6).toString("hex")}_${chunkIndex}.enc`;
    
    const attachment = new AttachmentBuilder(encrypted, {
      name: obfuscatedName, // ✅ Not "test.txt.part1" anymore
    });

    let channel;
    try {
      channel = await client.channels.fetch(process.env.DISCORD_CHANNEL_ID);
      if (!channel) {
        throw new Error("Discord channel not found");
      }
    } catch (channelError) {
      console.error("Failed to fetch Discord channel:", channelError);
      return res.status(503).json({ message: "Discord service unavailable" });
    }

    let message;
    try {
      message = await channel.send({
       content: `chunk_${chunkIndex}`,
        files: [attachment],
      });
    } catch (sendError) {
      console.error("Failed to send message to Discord:", sendError);
      return res
        .status(503)
        .json({ message: "Failed to upload chunk to Discord" });
    }

    console.log(`Chunk ${chunkIndex} uploaded with message ID:`, message.id);

    // Update metadata with message ID
    try {
      const chunkIdx = parseInt(chunkIndex) - 1;
      if (chunkIdx < 0 || chunkIdx >= metaData.chunksMetadata.length) {
        throw new Error(`Invalid chunk index: ${chunkIndex}`);
      }
      metaData.chunksMetadata[chunkIdx].messageId = message.id;
       metaData.chunksMetadata[chunkIdx].iv = iv; // Save IV for this chunk
      const uploadedCount = metaData.chunksMetadata.filter(
        (c) => c.messageId && c.messageId !== ""
      ).length;
      if (uploadedCount >= metaData.totalChunks) {
        metaData.status = 'complete';
        console.log(`✅ All ${metaData.totalChunks} chunks uploaded. File marked complete.`);
      }
      await metaData.save();
    } catch (saveError) {
      console.error("Failed to update metadata:", saveError);
      // Attempt to delete the Discord message since metadata wasn't saved
      try {
        await message.delete();
      } catch (deleteError) {
        console.error("Failed to cleanup Discord message:", deleteError);
      }
      return res.status(500).json({ message: "Failed to save chunk metadata" });
    }

    res.status(200).json({
      message: "Chunk uploaded successfully",
      messageId: message.id,
      chunkIndex: parseInt(chunkIndex),
    });
  } catch (error) {
    console.error(`Error uploading chunk:`, error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const downloadFile = async (req, res) => {
  const fileId = req.params.fileId;

  const token = req.query.token;
  let userId = req.userId; 

  if (!userId && token) {
    try {
      const jwt = await import('jsonwebtoken');
      const decoded = jwt.default.verify(token, process.env.JWT_SECRET);
      userId = decoded.userId || decoded.id;
    } catch {
      return res.status(401).json({ message: "Invalid token" });
    }
  }

  try {
    if (!fileId || typeof fileId !== "string") {
      return res.status(400).json({ message: "Invalid file ID" });
    }

    let metaData;
    try {
      metaData = await metaDataModel.findById(fileId);
    } catch (dbError) {
      return res.status(500).json({ message: "Database error" });
    }

    if (!metaData) {
      return res.status(404).json({ message: "File not found" });
    }

    if (metaData.status !== 'complete') {
      return res.status(400).json({ message: "File upload is not complete" });
    }

    // ✅ Verify ownership
    if (userId && metaData.ownerId?.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (!metaData.fileName || !metaData.fileType || !metaData.fileSize) {
      return res.status(500).json({ message: "Invalid file metadata" });
    }

    const encodedFilename = encodeURIComponent(metaData.fileName);
    res.setHeader("Content-Type", metaData.fileType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename*=UTF-8''${encodedFilename}`
    );
    res.setHeader("Content-Length", metaData.fileSize);

    await streamFileFromDiscord(metaData, res);
  } catch (error) {
    console.error("Error downloading file:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const streamFileFromDiscord = async (metaData, res) => {
  let channel;
  try {
    console.log(`Streaming file: ${metaData.fileName}`);

      const ready = await waitForDiscord(15000);
    if (!ready) throw new Error("Discord bot not ready");

    // Fetch Discord channel with error handling
    try {
      channel = await client.channels.fetch(process.env.DISCORD_CHANNEL_ID);
      if (!channel) {
        throw new Error("Discord channel not found");
      }
    } catch (channelError) {
      console.error("Failed to fetch Discord channel:", channelError);
      throw new Error("Discord service unavailable");
    }

    // Validate chunks metadata
    if (!metaData.chunksMetadata || metaData.chunksMetadata.length === 0) {
      throw new Error("No chunks metadata found");
    }

    // Download and stream all chunks from Discord
    for (const chunkMetadata of metaData.chunksMetadata) {
      try {
        console.log(`Streaming chunk ${chunkMetadata.chunkIndex}...`);

        if (!chunkMetadata.messageId) {
          throw new Error(
            `Missing messageId for chunk ${chunkMetadata.chunkIndex}`
          );
        }

        // Fetch Discord message
        let message;
        try {
          message = await channel.messages.fetch(chunkMetadata.messageId);
        } catch (fetchError) {
          console.error(
            `Failed to fetch message ${chunkMetadata.messageId}:`,
            fetchError
          );
          throw new Error(
            `Chunk ${chunkMetadata.chunkIndex} not found in Discord`
          );
        }

        const attachment = message.attachments.first();
        if (!attachment) {
          throw new Error(
            `No attachment found for chunk ${chunkMetadata.chunkIndex}`
          );
        }

        // Fetch the attachment data with timeout
        let response;
        try {
          response = await fetch(attachment.url);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
        } catch (fetchError) {
          console.error(
            `Failed to fetch attachment for chunk ${chunkMetadata.chunkIndex}:`,
            fetchError
          );
          throw new Error(
            `Failed to download chunk ${chunkMetadata.chunkIndex}`
          );
        }

        // Convert to buffer
        let chunkBuffer;
        try {
          const arrayBuffer = await response.arrayBuffer();
          chunkBuffer = Buffer.from(arrayBuffer);
        } catch (bufferError) {
          console.error(
            `Failed to convert chunk ${chunkMetadata.chunkIndex} to buffer:`,
            bufferError
          );
          throw new Error(
            `Failed to process chunk ${chunkMetadata.chunkIndex}`
          );
        }

          if (metaData.isEncrypted && chunkMetadata.iv) {
          try {
            chunkBuffer = decryptChunk(
              chunkBuffer,
              metaData._id.toString(),
              chunkMetadata.iv
            );
            console.log(
              `Chunk ${chunkMetadata.chunkIndex} decrypted: ${chunkBuffer.length} bytes`
            );
          } catch (decryptError) {
            console.error(
              `Decryption failed for chunk ${chunkMetadata.chunkIndex}:`,
              decryptError
            );
            throw new Error(
              `Failed to decrypt chunk ${chunkMetadata.chunkIndex}`
            );
          }
        }

        // Stream chunk directly to response
        if (!res.writableEnded) {
          res.write(chunkBuffer);
        } else {
          throw new Error("Response stream already ended");
        }
      } catch (chunkError) {
        console.error(
          `Error processing chunk ${chunkMetadata.chunkIndex}:`,
          chunkError
        );
        throw chunkError;
      }
    }

    // End the response stream
    if (!res.writableEnded) {
      res.end();
    }
    console.log(`File streamed successfully: ${metaData.fileName}`);
  } catch (error) {
    console.error("Error streaming file from Discord:", error);
    // Try to end the response if not already ended
    if (res && !res.writableEnded) {
      res.status(500).end();
    }
    throw error;
  }
};

export const previewFile = async (req, res) => {
  const { fileId } = req.params;

  const metaData = await metaDataModel.findById(fileId);
  if (!metaData) {
    return res.status(404).json({ message: "File not found" });
  }

   if (metaData.status !== 'complete') {
    return res.status(400).json({ message: "File upload is not complete" });
  }

  res.setHeader("Content-Type", metaData.fileType);
  res.setHeader(
    "Content-Disposition",
    `inline; filename="${metaData.fileName}"`
  );

  await streamFileFromDiscord(metaData, res);
};


export const listALlFiles = async (req, res) => {
  try {
    const userId = req.userId;
    const files = await metaDataModel
      .find({ ownerId: userId })
       .select("fileName fileSize fileType totalChunks uploadDate status chunksMetadata _id")
      .sort({ uploadDate: -1 });
       const formatted = files.map((file) => {
       const chunksUploaded = file.chunksMetadata
        ? file.chunksMetadata.filter((c) => c.messageId && c.messageId !== "").length
        : 0;

      return {
        _id: file._id,
        fileName: file.fileName,
        fileSize: file.fileSize,
        fileType: file.fileType,
        totalChunks: file.totalChunks,
        uploadDate: file.uploadDate,
        status: file.status || 'complete',
        chunksUploaded,
      };
    });
   res.status(200).json({ files: formatted });
  } catch (error) {
    console.error("Error listing files:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const fileDelete = async (req, res) => {
  const { fileIds } = req.body;
  const userId = req.userId;
  try {
    if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
      return res.status(400).json({ message: "File IDs are required" });
    }

    // Fetch Discord channel with error handling
    let channel;
    try {
      // channel = await client.channels.fetch(process.env.DISCORD_CHANNEL_ID);
      // if (!channel) {
      //   console.warn("Discord channel not found, will skip Discord cleanup");
      // }
        const ready = await waitForDiscord(10000);
      if (ready) {
        channel = await client.channels.fetch(process.env.DISCORD_CHANNEL_ID);
      }
    } catch (channelError) {
      console.error("Failed to fetch Discord channel:", channelError);
      // Continue without Discord cleanup
      channel = null;
    }

    const deletedFiles = [];
    const failedFiles = [];

    for (const fileId of fileIds) {
      try {
        // Validate fileId
        if (!fileId || typeof fileId !== "string") {
          console.warn(`Invalid file ID: ${fileId}`);
          failedFiles.push({ fileId, reason: "Invalid file ID" });
          continue;
        }

        // Fetch metadata
        let metaData;
        try {
          metaData = await metaDataModel.findById(fileId);
        } catch (dbError) {
          console.error(`Database error for file ${fileId}:`, dbError);
          failedFiles.push({ fileId, reason: "Database error" });
          continue;
        }

        if (!metaData) {
          console.warn(`File with ID ${fileId} not found.`);
          failedFiles.push({ fileId, reason: "File not found" });
          continue;
        }

        // Check ownership
        if (metaData.ownerId?.toString() !== userId) {
          console.warn(
            `User ${userId} not authorized to delete file ${fileId}`
          );
          return res
            .status(403)
            .json({ message: "Not authorized to delete this file" });
        }

        // Attempt to delete chunks from Discord (best effort)
        if (
          channel &&
          metaData.chunksMetadata &&
          metaData.chunksMetadata.length > 0
        ) {
          for (const chunkMetadata of metaData.chunksMetadata) {
            if (!chunkMetadata.messageId) continue;
            try {
              const message = await channel.messages.fetch(
                chunkMetadata.messageId
              );
              await message.delete();
            } catch (err) {
              console.error(
                `Failed to delete chunk message ${chunkMetadata.messageId}:`,
                err.message
              );
              // Continue with other chunks
            }
          }
        }

        // Delete metadata from database
        try {
          await metaData.deleteOne();
          deletedFiles.push(fileId);
        } catch (deleteError) {
          console.error(
            `Failed to delete metadata for file ${fileId}:`,
            deleteError
          );
          failedFiles.push({
            fileId,
            reason: "Failed to delete from database",
          });
        }
      } catch (fileError) {
        console.error(`Error processing file ${fileId}:`, fileError);
        failedFiles.push({ fileId, reason: fileError.message });
      }
    }

    // Return detailed response
    if (failedFiles.length > 0) {
      return res.status(207).json({
        message: "Some files failed to delete",
        deleted: deletedFiles,
        failed: failedFiles,
      });
    }

    return res.status(200).json({
      message: "Files deleted successfully",
      deleted: deletedFiles,
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const fileDetails = async (req, res) => {
  const fileId = req.body.fileId;
  try {
    if (!fileId) {
      return res.status(400).json({ message: "File ID is required" });
    }

    const metaData = await metaDataModel.findById(fileId).select("-chunksMetadata");
    if (!metaData) {
      return res.status(404).json({ message: "File not found" });
    }

    res.status(200).json({ fileDetails: metaData });
  }
  catch (error) {
    console.error("Error fetching file details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const uploadStatus = async (req, res) => {
  try {
    const { fileId } = req.params;
    const userId = req.userId;

    const metaData = await metaDataModel.findById(fileId);
    if (!metaData) {
      return res.status(404).json({ message: "File not found" });
    }

    if (metaData.ownerId?.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Which chunks already have a Discord message (1-based indices)
    const uploadedChunks = metaData.chunksMetadata
      .filter((c) => c.messageId && c.messageId !== "")
      .map((c) => c.chunkIndex);

    res.status(200).json({
      fileId: metaData._id,
      fileName: metaData.fileName,
      fileSize: metaData.fileSize,
      fileType: metaData.fileType,
      totalChunks: metaData.totalChunks,
      uploadedChunks,
      status: metaData.status,
    });
  } catch (error) {
    console.error("Error getting upload status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createShareLink = async (req, res) => {
  try {
    const { fileId, expiresIn } = req.body; // expiresIn in hours
    const userId = req.userId;

    const metaData = await metaDataModel.findById(fileId);
    if (!metaData) return res.status(404).json({ message: "File not found" });
    if (metaData.ownerId?.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }
    if (metaData.status !== "complete") {
      return res.status(400).json({ message: "File not fully uploaded" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = expiresIn
      ? new Date(Date.now() + expiresIn * 60 * 60 * 1000)
      : null;

    metaData.shareToken = token;
    metaData.shareExpiresAt = expiresAt;
    metaData.isPublic = true;
    await metaData.save();

    res.status(200).json({
      shareToken: token,
      shareUrl: `${process.env.FRONTEND_URL}/shared/${token}`,
      expiresAt,
    });
  } catch (error) {
    console.error("Error creating share link:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeShareLink = async (req, res) => {
  try {
    const { fileId } = req.body;
    const userId = req.userId;

    const metaData = await metaDataModel.findById(fileId);
    if (!metaData) return res.status(404).json({ message: "File not found" });
    if (metaData.ownerId?.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    metaData.shareToken = undefined;
    metaData.shareExpiresAt = undefined;
    metaData.isPublic = false;
    await metaData.save();

    res.status(200).json({ message: "Share link removed" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const downloadSharedFile = async (req, res) => {
  try {
    const { token } = req.params;

    const metaData = await metaDataModel.findOne({
      shareToken: token,
      isPublic: true,
    });

    if (!metaData) {
      return res.status(404).json({ message: "Shared file not found" });
    }

    // Check expiry
    if (metaData.shareExpiresAt && metaData.shareExpiresAt < new Date()) {
      return res.status(410).json({ message: "Share link has expired" });
    }

    if (metaData.status !== "complete") {
      return res.status(400).json({ message: "File not available" });
    }

    const encodedFilename = encodeURIComponent(metaData.fileName);
    res.setHeader("Content-Type", metaData.fileType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename*=UTF-8''${encodedFilename}`
    );
    res.setHeader("Content-Length", metaData.fileSize);

    await streamFileFromDiscord(metaData, res);
  } catch (error) {
    console.error("Error downloading shared file:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const getSharedFileInfo = async (req, res) => {
  try {
    const { token } = req.params;

    const metaData = await metaDataModel
      .findOne({ shareToken: token, isPublic: true })
      .select("fileName fileSize fileType uploadDate shareExpiresAt");

    if (!metaData) {
      return res.status(404).json({ message: "Shared file not found" });
    }

    if (metaData.shareExpiresAt && metaData.shareExpiresAt < new Date()) {
      return res.status(410).json({ message: "Share link has expired" });
    }

    res.status(200).json({
      fileName: metaData.fileName,
      fileSize: metaData.fileSize,
      fileType: metaData.fileType,
      uploadDate: metaData.uploadDate,
      expiresAt: metaData.shareExpiresAt,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getStorageStats = async (req, res) => {
  try {
    const userId = req.userId;

    const files = await metaDataModel
      .find({ ownerId: userId, status: "complete" })
      .select("fileName fileSize fileType uploadDate")
      .sort({ uploadDate: -1 });

    const totalSize = files.reduce((sum, f) => sum + (f.fileSize || 0), 0);
    const fileCount = files.length;

    // Size AND count by category
    const categories = {};
    files.forEach((f) => {
      const mime = (f.fileType || "").toLowerCase();
      let category = "Other";
      if (mime.startsWith("image/")) category = "Images";
      else if (mime.startsWith("video/")) category = "Videos";
      else if (mime.startsWith("audio/")) category = "Audio";
      else if (mime.includes("pdf")) category = "PDFs";
      else if (mime.includes("text") || mime.includes("json")) category = "Text";
      else if (mime.includes("zip") || mime.includes("rar") || mime.includes("tar")) category = "Archives";
      else if (mime.includes("word") || mime.includes("document") || mime.includes("spreadsheet")) category = "Documents";

      if (!categories[category]) {
        categories[category] = { count: 0, size: 0 };
      }
      categories[category].count++;
      categories[category].size += f.fileSize || 0;
    });

    // Recent uploads
    const recentUploads = files.slice(0, 5).map((f) => ({
      id: f._id,
      name: f.fileName,
      size: f.fileSize,
      type: f.fileType,
      uploadedAt: f.uploadDate,
    }));

    // Largest files
    const largestFiles = [...files]
      .sort((a, b) => (b.fileSize || 0) - (a.fileSize || 0))
      .slice(0, 5)
      .map((f) => ({
        id: f._id,
        name: f.fileName,
        size: f.fileSize,
        type: f.fileType,
      }));

    res.json({
      totalSize,
      fileCount,
      storageLimit: 1073741824, // 1GB — replace with user's actual limit
      categories,
      recentUploads,
      largestFiles,
    });
  } catch (error) {
    console.error("Error getting storage stats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};