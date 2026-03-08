import mongoose from "mongoose";

const chunkSchema = new mongoose.Schema(
  {
    chunkIndex: { type: Number, required: true },
    messageId: { type: String },
     iv: { type: String },  // encryption IV per chunk (hex string)
  },
  { _id: false }
);

const metaDataSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  fileSize: { type: Number, required: true },
  fileType: { type: String, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  totalChunks: { type: Number, required: true },
   status: {
    type: String,
    enum: ['uploading', 'complete', 'failed'],
    default: 'uploading',
  },
  isEncrypted: { type: Boolean, default: true },
  chunksMetadata: {
    type: [chunkSchema],
    default: [],
  },
  uploadDate: { type: Date, default: Date.now }
});

export default mongoose.model("FileMetadata", metaDataSchema);