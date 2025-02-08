import express from "express";
import { getCourses, getCoursesExams, insertCourse, insertCourseExam } from "../controller/controller.js";

export const router = express.Router();

router.post("/add-course", insertCourse);
router.get("/get-courses", getCourses);
router.get("/get-courses-exams", getCoursesExams);

router.post("/add-course-exam", insertCourseExam);


export default router;
