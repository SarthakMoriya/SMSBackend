import pool from "../db/connectDb.js";
import { setCache } from "../redis/redisQueries.js";
import { successResponse } from "../utils/helper.js";

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
