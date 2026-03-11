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
} from "../controllers/file.controller.js";
import { verifyJWT } from "../middleware/verifyJWT.js";

const router = Router();

router.post("/upload/init",verifyJWT, initaliseFileUpload);
// router.post("/upload/init", initaliseFileUpload);
router.post("/upload/chunk", verifyJWT, upload.single("chunk"), uploadChunk);
router.get("/download/:fileId", downloadFile);
router.get("/list",verifyJWT, listALlFiles);
router.get("/preview/:fileId", previewFile);
router.delete("/delete",verifyJWT, fileDelete);
router.post("/filedata", fileDetails);
router.get("/upload/status/:fileId", verifyJWT, uploadStatus);

export default router;