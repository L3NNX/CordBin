import { Router } from "express";
import upload from "../utils/multer.js";
import {
  downloadFile,
  initaliseFileUpload,
  uploadChunk,
    uploadStatus,
  listALlFiles,
  fileDelete,
  fileDetails,
  previewFile,
  getSharedFileInfo,
  downloadSharedFile,
   createShareLink,      
  removeShareLink,
  getStorageStats, 
} from "../controllers/file.controller.js";
import { verifyJWT } from "../middleware/verifyJWT.js";

const router = Router();

router.post("/upload/init",verifyJWT, initaliseFileUpload);
// router.post("/upload/init", initaliseFileUpload);
router.post("/upload/chunk", verifyJWT, upload.single("chunk"), uploadChunk);
router.get("/download/:fileId", downloadFile);
router.get("/list",verifyJWT, listALlFiles);
router.get("/preview/:fileId", previewFile);
router.post("/delete",verifyJWT, fileDelete);
router.post("/filedata", fileDetails);
router.get("/upload/status/:fileId", verifyJWT, uploadStatus);
router.post("/share/create", verifyJWT, createShareLink);
router.post("/share/remove", verifyJWT, removeShareLink);
router.get("/shared/:token/info", getSharedFileInfo);  
router.get("/shared/:token/download", downloadSharedFile);
router.get("/stats", verifyJWT, getStorageStats);

export default router;