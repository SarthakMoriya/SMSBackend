import { Router } from "express";
import { addExam } from "../controller/controller.js";

export const router = Router();

router.route("/addexams").post(addExam);
