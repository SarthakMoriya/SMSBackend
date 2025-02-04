import { setStudentDetailsCache } from "../redis/redisQueries.js";
import { sql } from "./connectDb.js";

export const insertRecord = (data) => {
  console.log(data);
  return new Promise((resolve, reject) => {
    let query = `INSERT INTO records(stu_name,date_enrolled,teacher_id,course,rollno) VALUES (?,?,?,?,?)`;

    sql.execute(
      query,
      [
        data["stu_name"],
        data["date_enrolled"],
        data["teacher_id"],
        data["course"],
        data["rollno"],
      ],
      (err, result) => {
        if (err) {
          reject({
            message: "failed to insert student data",
            status: "error",
            err,
            body: [],
          });
        }
        resolve({
          message: "Data inserted ",
          status: "success",
        });
      }
    );
  });
};

export const getCourseRecordsDB = (course) => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM records WHERE course=?`, [course], (err, res) => {
      if (err) {
        reject({
          message: `Failed to fetch ${course} records`,
          code: 400,
          status: "fail",
        });
      }
      resolve(res);
    });
  });
};

export const getRecordInfoDB = async (sql, recordId) => {
  try {
    // Fetch student details
    const [records] = await sql
      .promise()
      .query(`SELECT * FROM studentdb.records WHERE studId = ?`, [recordId]);

    if (records.length === 0) {
      throw { code: 404, status: "error", message: "Record not found" };
    }

    const studentData = records[0];
    const startYear = new Date(studentData.date_enrolled).getFullYear();
    const batch = `${startYear}-${startYear + studentData.duration}`;

    // Fetch overall percentage
    const [percentageResults] = await sql.promise().query(
      `SELECT FLOOR((SUM(obt_marks) / NULLIF(SUM(total_marks), 0)) * 100) AS overall_percentage
       FROM ${studentData.course}.exams
       WHERE student_id = ?`,
      [recordId]
    );

    // Fetch semester count
    const [semesterResults] = await sql.promise().query(
      `SELECT COUNT(DISTINCT semester_number) AS semester_done
       FROM ${studentData.course}.exams
       WHERE student_id = ?`,
      [recordId]
    );
    let studentDataRes = {
      ...studentData,
      batch,
      overall_percentage: percentageResults[0]?.overall_percentage
        ? `${percentageResults[0].overall_percentage}%`
        : "N/A",
      semester_done: semesterResults[0]?.semester_done || 0,
    };
    await setStudentDetailsCache(recordId, studentDataRes);
    return { ...studentDataRes };
  } catch (error) {
    console.error("Error in getRecordInfoDB:", error);
    throw error.code
      ? error
      : { code: 500, status: "error", message: "SQL Error" };
  }
};
