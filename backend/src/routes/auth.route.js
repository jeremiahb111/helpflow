import { Router } from "express";
import { login, logout, signup } from "../controllers/auth.controller.js";
import { catchAsync } from "../utils/catchAsync.js";

const router = Router();

router.post("/signup", catchAsync(signup));
router.post("/login", catchAsync(login));
router.post("/logout", logout);

export default router;