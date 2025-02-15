import pool from "../db/connectDb.js";
import { selectCourseExamsQuery } from "../db/queries.js";
import {
  getCourseExamsCache,
  getCoursesCache,
  insertCourseCache,
  setCourseExamsCache,
  updateCourseExamsCache,
} from "../redis/queries.js";
import { client } from "../redis/redis.js";
import { ResponseBuilder } from "../utils/response.js";
import {
  approveVerifiedAccountDB,
  deleteAccountDb,
  getCourseExamsDB,
  getCoursesFromDB,
  getUnVerifiedAccountDB,
  getVerifiedAccountsDb,
} from "./dbController.js";

export const insertCourse = async (req, res) => {
  try {
    const { name, code, semesters } = req.body;
    const query = `INSERT INTO master.courses (name,code,semesters) VALUES ('${name}','${code}','${semesters}')`;
    const [rows] = await pool.query(query);
    if (rows.insertId) {
      insertCourseCache({ ...req.body });
      ResponseBuilder.successResponse(res);
    } else {
      ResponseBuilder.errorResponse(res);
    }
  } catch (error) {
    console.log("Error at insertCourse()");
    error.sql
      ? ResponseBuilder.sqlerrorResponse(res, { ...error })
      : ResponseBuilder.errorResponse(res);
  }
};

// INSERT COURSE EXAM
export const insertCourseExam = async (req, res) => {
  try {
    const { name, semester_no, max_marks, min_marks, course_id, exam_code } =
      req.body;
    const query = `INSERT INTO master.exams (course_id,name,max_marks,min_marks,semester,exam_code) 
                   VALUES ('${course_id}','${name}',${max_marks},${min_marks},${semester_no},${exam_code})`;
    const [rows] = await pool.query(query);
    if (rows.insertId) {
      updateCourseExamsCache(
        course_id,
        name,
        max_marks,
        min_marks,
        semester_no,
        exam_code
      );
      ResponseBuilder.successResponse(res);
    } else {
      ResponseBuilder.errorResponse(res);
    }
  } catch (error) {
    console.log("Error at insertCourseExam()");
    error.sql
      ? ResponseBuilder.sqlerrorResponse(res, { ...error })
      : ResponseBuilder.errorResponse(res);
  }
};

// GET ALL COURSES
export const getCourses = async (req, res) => {
  try {
    if (client.isOpen) {
      const courses = await getCoursesCache();
      return courses.length
        ? ResponseBuilder.successResponse(res, courses)
        : getCoursesFromDB(res);
    } else {
      getCoursesFromDB(res);
    }
  } catch (error) {
    console.log("Error at getCourses()");
    error.sql
      ? ResponseBuilder.sqlerrorResponse(res, { ...error })
      : ResponseBuilder.errorResponse(res);
  }
};

// GET ALL COURSES EXAMS
export const getCoursesExams = async (req, res) => {
  try {
    const { course_id, semester } = req.query;
    if (client.isOpen) {
      const courses = await getCourseExamsCache(course_id, semester);
      if (courses != null) {
        return ResponseBuilder.successResponse(res, courses);
      } else {
        getCourseExamsDB(res, course_id, semester);
      }
    } else {
      getCourseExamsDB(res, course_id, semester);
    }
  } catch (error) {
    console.log("Error at getCourseExams()");
    error.sql
      ? ResponseBuilder.sqlerrorResponse(res, { ...error })
      : ResponseBuilder.errorResponse(res);
  }
};

// APPROVE UNVERIFIED ACCOUNTS
export const approveVerifiedAccount = async (req, res) => {
  try {
    const { teacher_id, status } = req.params;
    await approveVerifiedAccountDB(res, status, teacher_id);
  } catch (error) {
    console.log("Error at approveVerifiedAccount()");
    ResponseBuilder.errorResponse(res);
  }
};
// GET UNVERIFIED ACCOUNTS
export const getUnverifiedAccounts = async (req, res) => {
  try {
    await getUnVerifiedAccountDB(res);
  } catch (error) {
    console.log("Error at getUnverifiedAccounts()");
    ResponseBuilder.errorResponse(res);
  }
};

// Delete Account
export const deleteAccount = async (req, res) => {
  try {
    const {teacher_id}=req.params
    await deleteAccountDb(res,teacher_id);
  } catch (error) {
    console.log("Error at deleteAccount()");
    ResponseBuilder.errorResponse(res);
  }
};

// Get Verified Accounts
export const getVerifiedAccounts = async (req, res) => {
  try {
    await getVerifiedAccountsDb(res);
  } catch (error) {
    console.log(error)
    console.log("Error at getVerifiedAccounts()");
    ResponseBuilder.errorResponse(res);
  }
};
