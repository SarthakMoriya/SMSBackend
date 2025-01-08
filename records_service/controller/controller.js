import { getCourseRecordsDB, insertRecord } from "../db/dbQueries.js";
import { checkCourseExists } from "../utils/checkCourseExists.js";

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
    const course  = req.params.course;
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
        body: records,
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
