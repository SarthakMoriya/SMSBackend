import pool from "../db/connectDb.js";
import { insertAllCourseCache } from "../redis/queries.js";
import { ResponseBuilder } from "../utils/response.js";

export const getCoursesFromDB = async (res) => {
  try {
    const query = `SELECT * FROM master.courses`;
    const [rows] = await pool.query(query);
    if (rows.length) {
      insertAllCourseCache(rows);
      ResponseBuilder.successResponse(res, rows);
    } else {
      ResponseBuilder.errorResponse(res);
    }
  } catch (error) {
    error.sql
      ? ResponseBuilder.sqlerrorResponse(res, { ...error })
      : ResponseBuilder.errorResponse(res);
  }
};
