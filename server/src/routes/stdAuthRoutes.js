import express from "express";

import {
  loginStudent,
  logoutStudent,
} from "../controllers/auth/private/loginControllers.js";
import { homeStudent } from "../controllers/auth/public/homeController.js";
import { TokenVerify } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginStudent);
router.get("/logout", logoutStudent);

router.get("/std-home", TokenVerify, homeStudent);

export default router;