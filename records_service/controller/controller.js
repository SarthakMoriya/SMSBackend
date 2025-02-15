import { getCourseRecordsDB, insertRecord } from "../db/dbQueries.js";
import { client } from "../redis/redis.js";
import { getRecordC } from "../redis/redisQueries.js";
import { checkCourseExists } from "../utils/checkCourseExists.js";
import {
  errorLogger,
  errorResponse,
  successResponse,
} from "../utils/helper.js";
import { getRecordDb } from "./dbController.js";

export const createStudent = async (req, res) => {
  try {
    const {
      stu_name,
      date_enrolled,
      teacher_id,
      course,
      rollno,
      uni_roll_no,
      image_url,
    } = req.body;

    const insertRecordRes = await insertRecord({
      stu_name,
      date_enrolled,
      teacher_id,
      course,
      rollno,
      uni_roll_no,
      image_url,
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

export const getRecord = async (req, res) => {
  try {
    if (client.isOpen) {
      const data = await getRecordC(req.params.id);
      if (data) {
        return successResponse(res, { body: [data] });
      } else {
        getRecordDb(res, req.params.id);
      }
    }
  } catch (error) {
    errorLogger("getRecordDb()");
    errorResponse(res);
  }
};
