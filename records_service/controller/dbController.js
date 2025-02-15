import pool from "../db/connectDb.js";
import { getRecordQ } from "../db/dbQueries.js";
import { setRecord } from "../redis/redisQueries.js";
import {
  errorLogger,
  errorResponse,
  successResponse,
} from "../utils/helper.js";

export const getRecordDb = async (res, id) => {
  try {
    const query = getRecordQ();
    const [rows] = await pool.query(query, [id]);
    if (rows.length) {
      setRecord(rows[0])
      return successResponse(res, { body: [rows[0]] });
    } else {
      errorResponse(res);
    }
  } catch (error) {
    errorLogger("getRecordDb()");
    errorResponse(res);
  }
};
