import express from "express";
import {
  approveVerifiedAccount,
  deleteAccount,
  getCourses,
  getCoursesExams,
  getUnverifiedAccounts,
  getVerifiedAccounts,
  insertCourse,
  insertCourseExam,
} from "../controller/controller.js";

export const router = express.Router();

router.post("/add-course", insertCourse);
router.get("/get-courses", getCourses);
router.get("/get-courses-exams", getCoursesExams);

router.post("/add-course-exam", insertCourseExam);

//APPROVE UNVERIFIED ACCOUNTS
router.patch("/approve-unverified-accounts/:teacher_id/:status",approveVerifiedAccount);
router.delete("/delete-account/:teacher_id", deleteAccount);
router.get("/unverified-accounts", getUnverifiedAccounts);

router.get('/verified-accounts',getVerifiedAccounts)

export default router;
