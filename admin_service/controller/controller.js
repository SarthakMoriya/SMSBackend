import pool from "../db/connectDb.js";
import { selectCourseExamsQuery } from "../db/queries.js";
import {
  getCourseExamsCache,
  getCoursesCache,
  insertCourseCache,
  setCourseExamsCache,
} from "../redis/queries.js";
import { client } from "../redis/redis.js";
import { ResponseBuilder } from "../utils/response.js";
import { getCoursesFromDB } from "./dbController.js";

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
    console.log(rows);
  } catch (error) {
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
    console.log(rows);
    if (rows.insertId) {
      ResponseBuilder.successResponse(res);
    } else {
      ResponseBuilder.errorResponse(res);
    }
  } catch (error) {
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
      console.log(courses)
      return courses.length
        ? ResponseBuilder.successResponse(res, courses)
        : getCoursesFromDB(res);
    } else {
      getCoursesFromDB(res);
    }
  } catch (error) {
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
      return ResponseBuilder.successResponse(res, courses);
    } else {
      const query = selectCourseExamsQuery();
      const [rows] = await pool.query(query, [course_id, semester]);
      if (rows.length) {
        setCourseExamsCache(rows);
        ResponseBuilder.successResponse(res, rows);
      } else {
        ResponseBuilder.errorResponse(res);
      }
    }
  } catch (error) {
    console.log(error);
    error.sql
      ? ResponseBuilder.sqlerrorResponse(res, { ...error })
      : ResponseBuilder.errorResponse(res);
  }
};
