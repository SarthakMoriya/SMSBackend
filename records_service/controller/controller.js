import {
  closeDbConnection,
  connectDB,
  establishedConnection,
} from "../db/connectDb.js";
import {
  getCourseRecordsDB,
  getRecordInfoDB,
  insertRecord,
} from "../db/dbQueries.js";
import { client } from "../redis/redis.js";
import { checkCourseExists } from "../utils/checkCourseExists.js";
import { Responder } from "../utils/responseBuilder.js";

export const createStudent = async (req, res) => {
  try {
    const { stu_name, date_enrolled, teacher_id, course, rollno } = req.body;

    const insertRecordRes = await insertRecord({
      stu_name,
      date_enrolled,
      teacher_id,
      course,
      rollno,
    });
    res.status(201).json(insertRecordRes);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const getCourseRecords = async (req, res) => {
  try {
    const course = req.params.course;
    if (!course) {
      throw new Error({ message: `Course not provided`, status: 400 });
    }
    const isValidCourse = await checkCourseExists(course);
    if (isValidCourse.isValid) {
      const records = await getCourseRecordsDB(course);
      res.status(200).json({
        message: `Course ${course} records`,
        status: "success",
        code: 200,
        body: {
          records,
          courseCode: course,
        },
      });
    }
  } catch (error) {
    console.log(error);
    let status = error.status || 500;
    let message = error.message || "Internal server error";
    return res.status(status).json({ message, status });
  } finally {
    //close db connection
  }
};

// FUNCTION TO DISPLAY RECORD INFO NAME ROLL NUMBER % COURSE,...

export const getRecordInfo = async (req, res) => {
  const { record_id } = req.params;
  let sql;
  try {
    const recordCache = await client.hGetAll(`student:${record_id}`);

    if (Object.keys(recordCache).length) {
      let cachedData = recordCache;
      Responder.success(res, 200, "success", cachedData);
    } else {
      sql = await establishedConnection();
      const recordDataRes = await getRecordInfoDB(sql, record_id);
      Responder.success(res, 200, "success", recordDataRes);
    }
  } catch (error) {
    Responder.error(res, error.code, error.status);
  } finally {
    if (sql) closeDbConnection(sql);
  }
};
