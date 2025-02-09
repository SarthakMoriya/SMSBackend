import pool, {
  closeDbConnection,
  establishedConnection,
} from "../db/connectDb.js";
import {
  addExamToDb,
  getSemesterExamsFromDb,
  getSemesterExamsTotalFromDb,
  getStudentExamsDB,
} from "../db/dbQueries.js";
import { client } from "../redis/redis.js";
import { checkCourseCode, setCache } from "../redis/redisQueries.js";
import { errorResponse, successResponse } from "../utils/helper.js";
import { getExamCodesDb } from "./controller.db.js";

export const addExam = async (req, res) => {
  try {
    const data = req.body;
    let { status, code, message, body } = await addExamToDb(data.course_name, {
      ...data,
    });
    return res.status(code).json({ status, code, message, body });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "fail",
      code: 500,
      message: "Faield to insert data ",
    });
  }
};

export const getStudentExams = async (req, res) => {
  try {
    const studentId = req.params.id;
    const courseDB = req.params.course;
    if (!studentId)
      throw new Error({
        message: "No stundet id provided",
        status: "fail",
        code: 404,
      });

    //If id is provided
    const exams = await getStudentExamsDB(studentId, courseDB);
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Exams data fetched successfully",
      body: exams,
    });
  } catch (error) {
    console.log(error);
    let code = error.code || 500;
    let message = error.message || "Internal server error";
    let status = error.status || "fail";
    res.status(code).json({ message, code, status });
  } finally {
  }
};

export const getSemesterExams = async (req, res) => {
  const sql = await establishedConnection();
  try {
    const { studId, course, semester } = req.params;
    if (!semester || !studId || !course) {
      return errorResponse(res, { message: "Invalid Params" });
    }
    let cache = await client.hGetAll(`student:${studId}:semester:${semester}`);
    if (Object.keys(cache).length) {
      const exams = Object.values(cache).map((exam) => JSON.parse(exam));
      return successResponse(res, {
        message: "data fetched successfully from redis",
        code: 200,
        status: "success",
        body: exams,
      });
    } else {
      const exams = await getSemesterExamsFromDb(sql, course, studId, semester);
      return res.status(200).json({ ...exams });
    }
    // console.log(cache);
  } catch (error) {
    return errorResponse(res, error);
  } finally {
    closeDbConnection(sql);
  }
};
export const getSemesterExamsOverallTotal = async (req, res) => {
  const sql = await establishedConnection();
  try {
    const { studId, course } = req.params;
    if (!studId || !course) {
      return errorResponse(res, { message: "Invalid Params" });
    }
    let cache = await client.hGetAll(`student:${studId}:total`);
    if (Object.keys(cache).length) {
      const semesterTotal = Object.values(cache).map((semester) =>
        JSON.parse(semester)
      );
      return successResponse(res, {
        message: "data fetched successfully from redis",
        code: 200,
        status: "success",
        body: semesterTotal.sort(
          (a, b) => a.semester_number - b.semester_number
        ),
      });
    } else {
      const exams = await getSemesterExamsTotalFromDb(sql, course, studId);
      return res.status(200).json({ ...exams });
    }
    // console.log(cache);
  } catch (error) {
    return errorResponse(res, error);
  } finally {
    closeDbConnection(sql);
  }
};

export const getExamCodes = async (req, res) => {
  try {
    const { code } = req.params;
    if (client.isOpen) {
      const isExisting = await checkCourseCode("course-codes", code);
      if (isExisting != null)
        return successResponse(res, {
          body: { isExisting },
          message: "data fetched successfully",
        });
      else {
        getExamCodesDb(res, code);
      }
    } else {
      getExamCodesDb(res, code);
    }
  } catch (error) {
    return errorResponse(res, error);
  }
};
