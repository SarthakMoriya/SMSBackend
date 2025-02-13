import pool from "../db/connectDb.js";
import {
  deleteAccountQ,
  getAllVerifiedAccsQ,
  getUnApprovedAccs,
  selectCourseExamsQuery,
  updateAccVerificationStatus,
} from "../db/queries.js";
import { insertAllCourseCache, setCourseExamsCache } from "../redis/queries.js";
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

export const getCourseExamsDB = async (res, course_id, semester) => {
  try {
    const query = selectCourseExamsQuery();
    const [rows] = await pool.query(query, [course_id, semester]);
    if (rows.length) {
      setCourseExamsCache(rows);
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

// FUNC TO APPROVE UNVERIFIED ACCOUNTS
export const approveVerifiedAccountDB = async (res, status, teacher_id) => {
  try {
    const query = updateAccVerificationStatus();
    const [rows] = await pool.query(query, [status, teacher_id]);
    if (rows) {
      ResponseBuilder.successResponse(
        res,
        {},
        "Account status updated successfully"
      );
    } else {
      ResponseBuilder.errorResponse(res);
    }
  } catch (error) {
    error.sql
      ? ResponseBuilder.sqlerrorResponse(res, { ...error })
      : ResponseBuilder.errorResponse(res);
  }
};
// FUNC TO GET ALL UNVERIFIED ACCOUNTS
export const getUnVerifiedAccountDB = async (res, status, teacher_id) => {
  try {
    const query = getUnApprovedAccs();
    const [rows] = await pool.query(query);
    if (rows) {
      ResponseBuilder.successResponse(
        res,
        [...rows],
        "Data Fetched successfully"
      );
    } else {
      ResponseBuilder.errorResponse(res);
    }
  } catch (error) {
    error.sql
      ? ResponseBuilder.sqlerrorResponse(res, { ...error })
      : ResponseBuilder.errorResponse(res);
  }
};

// FUNC TO GET ALL UNVERIFIED ACCOUNTS
export const deleteAccountDb = async (res, teacher_id) => {
  try {
    const query = deleteAccountQ();
    const [rows] = await pool.query(query, [teacher_id]);
    if (rows.affectedRows)ResponseBuilder.successResponse(res, {}, "Account Delete Successfully");
    else if(!rows.affectedRows)ResponseBuilder.successResponse(res, {}, "No Account found");
    else ResponseBuilder.errorResponse(res);
    
  } catch (error) {
    error.sql
      ? ResponseBuilder.sqlerrorResponse(res, { ...error })
      : ResponseBuilder.errorResponse(res);
  }
};

// FUNC TO GET ALL VERIFIED ACCOUNTS
export const getVerifiedAccountsDb = async (res) => {
  try {
    const query = getAllVerifiedAccsQ();
    const [rows] = await pool.query(query);
    if (rows.length)ResponseBuilder.successResponse(res, rows, "Account Fetched Successfully");
    else ResponseBuilder.errorResponse(res);

  } catch (error) {
    error.sql
      ? ResponseBuilder.sqlerrorResponse(res, { ...error })
      : ResponseBuilder.errorResponse(res);
  }
};
