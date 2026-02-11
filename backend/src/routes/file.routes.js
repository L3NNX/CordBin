import { Router } from "express";
import upload from "../utils/multer.js";
import {
  downloadFile,
  initaliseFileUpload,
  uploadChunk,
  listALlFiles,
  fileDelete,
  fileDetails,
} from "../controllers/file.controller.js";
import { verifyJWT } from "../middleware/verifyJWT.js";

const router = Router();

router.post("/upload/init",verifyJWT, initaliseFileUpload);
// router.post("/upload/init", initaliseFileUpload);
router.post("/upload/chunk", upload.single("chunk"), uploadChunk);
router.get("/download/:fileId", downloadFile);
router.get("/list",verifyJWT, listALlFiles);
// router.get("/list", listALlFiles);
router.delete("/delete",verifyJWT, fileDelete);
// router.delete("/delete", fileDelete);
router.post("/filedata", fileDetails);

export default router;