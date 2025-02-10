import pool from "../db/connectDb.js";
import { updateExamQ } from "../db/dbQueries.js";
import {
  setCache,
  updateStudentSemesterExamCache,
} from "../redis/redisQueries.js";
import { errorResponse, successResponse } from "../utils/helper.js";

export const getExamCodesDb = async (res, code) => {
  try {
    let query = `SELECT exam_code FROM master.exams`;
    const [rows] = await pool.query(query);
    if (rows.length) {
      let codes = rows.map((code) => code.exam_code);
      let isUnique = rows.filter((exam) => exam.exam_code == code);

      await setCache("course-codes", codes);
      return successResponse(res, {
        message: "data fetched successfully",
        body: isUnique.length ? { isExisting: true } : { isExisting: false },
      });
    }
  } catch (error) {}
};

export const updateExamDb = async (res, data) => {
  try {
    console.log(data);
    let query = updateExamQ(data.course);
    console.log(query);
    const [rows] = await pool.query(query, [
      data.semester_no,
      data.obt_marks,
      data.total_marks,
      data.exam_date,
      data.exam_id,
    ]);
    console.log(rows);
    if (rows) {
      updateStudentSemesterExamCache(data.student_id,data.semester_no, {
        exam_id: data.exam_id,
        semester_no: data.semester_no,
        obt_marks: data.obt_marks,
        total_marks: data.total_marks,
        exam_date: data.exam_date,
        exam_type: data.exam_type,
        exam_name: data.exam_name
      });
      successResponse(res);
    } else {
      errorResponse(res);
    }
  } catch (error) {
    console.log(error);
    errorResponse(res);
  }
};
