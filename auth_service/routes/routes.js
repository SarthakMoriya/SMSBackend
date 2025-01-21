import { Router } from "express";
import { changePassword, login, signup, verifyToken } from "../controller/controller.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/verify", verifyToken);
router.post("/changepassword", changePassword);

export default router;
