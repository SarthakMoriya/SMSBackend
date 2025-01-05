import { Router } from "express";
import { createStudent } from "../controller/controller.js";

export const router = Router();

router.route("/create").post(createStudent);
