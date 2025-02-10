import { Router } from "express";
import {
  addExam,
  getExamCodes,
  getSemesterExams,
  getSemesterExamsOverallTotal,
  getStudentExams,
  updateExam,
} from "../controller/controller.js";

export const router = Router();

router.route("/addexams").post(addExam);
router.route("/deleteexam/:course/:examId").delete(addExam);

router.route("/studentexams/:id/:course").get(getStudentExams);

router.route("/semesterexams/:studId/:course/:semester").get(getSemesterExams);
router.route("/all-semester-total/:studId/:course").get(getSemesterExamsOverallTotal);

router.put('/update-exam/:course',updateExam)

router.get('/get-exam-codes/:code',getExamCodes)
