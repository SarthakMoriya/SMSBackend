import { Router } from "express";
import { createStudent, getCourseRecords } from "../controller/controller.js";

export const router = Router();

router.route("/create").post(createStudent);
router.route("/courserecords/:course").get(getCourseRecords);
