// utils/encryption.js

import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;        // Recommended for GCM
const AUTH_TAG_LENGTH = 16;  // GCM auth tag

// Get master key from env
function getMasterKey() {
  const key = process.env.ENCRYPTION_KEY;
  if (!key || key.length !== 64) {
    throw new Error(
      "ENCRYPTION_KEY must be a 64-char hex string (32 bytes). " +
      'Generate one with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
    );
  }
  return Buffer.from(key, "hex");
}

/**
 * Derive a unique key per file using HKDF
 * This way even if one file's key is compromised, others are safe
 */
function deriveFileKey(fileId) {
  const masterKey = getMasterKey();
  return crypto.createHmac("sha256", masterKey)
    .update(fileId)
    .digest(); // Returns 32-byte Buffer
}

/**
 * Encrypt a buffer
 * Returns: { encrypted: Buffer, iv: string (hex) }
 * 
 * The encrypted buffer format: [ciphertext][authTag(16 bytes)]
 */
export function encryptChunk(buffer, fileId) {
  const key = deriveFileKey(fileId);
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  const encrypted = Buffer.concat([
    cipher.update(buffer),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  // Combine: [encrypted data][auth tag]
  const combined = Buffer.concat([encrypted, authTag]);

  return {
    encrypted: combined,
    iv: iv.toString("hex"),
  };
}

/**
 * Decrypt a buffer
 * Expects: buffer = [ciphertext][authTag(16 bytes)]
 */
export function decryptChunk(encryptedBuffer, fileId, ivHex) {
  const key = deriveFileKey(fileId);
  const iv = Buffer.from(ivHex, "hex");

  // Split: last 16 bytes = auth tag, rest = ciphertext
  const authTag = encryptedBuffer.subarray(encryptedBuffer.length - AUTH_TAG_LENGTH);
  const ciphertext = encryptedBuffer.subarray(0, encryptedBuffer.length - AUTH_TAG_LENGTH);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return decrypted;
}