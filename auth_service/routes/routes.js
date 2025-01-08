import { Router } from "express";
import { login, signup, verifyToken } from "../controller/controller.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/verify",verifyToken)

export default router;
