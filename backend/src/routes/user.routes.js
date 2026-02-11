import { Router } from "express";
import {
  googleAuthCallback,
  googleAuthRedirect,
  verifyUser,
  logout,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/verifyJWT.js";

const router = Router();

router.get("/google/redirect", googleAuthRedirect);
router.get("/google/callback", googleAuthCallback);
router.get("/verify", verifyJWT, verifyUser);
// router.get("/verify", verifyUser);
router.post("/logout", verifyJWT, logout);
// router.post("/logout", logout);

export default router;