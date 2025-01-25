import { Router } from "express";
import { addExam, getStudentExams } from "../controller/controller.js";

export const router = Router();

router.route("/addexams").post(addExam);
router.route("/deleteexam/:course/:examId").delete(addExam);

router.route("/studentexams/:id/:course").get(getStudentExams);
