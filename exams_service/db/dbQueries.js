import { setStudentSemesterExamsCache } from "../redis/redisQueries.js";
import { errorLogger } from "../utils/helper.js";
import { sql } from "./connectDb.js";

export const addExamToDb = (db, data) => {
  return new Promise((resolve, reject) => {
    let query = `INSERT INTO ${db}.exams 
    (student_id,semester_number,teacher_id,exam_type,exam_name,obt_marks,total_marks,exam_date) 
    VALUES (?,?,?,?,?,?,?,?)`;
    sql.execute(
      query,
      [
        data.student_id,
        data.semester_number,
        data.teacher_id,
        data.exam_type,
        data.exam_name,
        data.obt_marks,
        data.total_marks,
        data.exam_date,
      ],
      (err, res) => {
        if (err)
          reject({
            status: "fail",
            code: 400,
            message: "Failed to insert record",
            err,
          });

        resolve({
          status: "success",
          code: 200,
          message: "Exams data inserted successfully",
          body: [],
        });
      }
    );
  });
};

export const getStudentExamsDB = (stuId, courseDB) => {
  return new Promise((resolve, reject) => {
    sql.query(
      `SELECT * FROM ${courseDB}.exams WHERE student_id = ?`,
      [stuId],
      (err, res) => {
        if (err) {
          reject({
            message: `Failed to fetch exams for studentId: ${parseInt(stuId)}`,
            code: 400,
            status: "fail",
          });
        }
        console.log(err);
        console.log(res);
        if (!res.length) {
          reject({
            message: `Failed to fetch exams for studentId: ${stuId}`,
            code: 404,
            status: "fail",
          });
        }
        resolve(res);
      }
    );
  });
};

export const getSemesterExamsFromDb = (sql, db, stu_id, sem_num) => {
  return new Promise((resolve, reject) => {
    let query = `SELECT exam_id,semester_number,exam_type,exam_name,obt_marks,total_marks,exam_date FROM ${db}.exams WHERE student_id=${stu_id} AND semester_number=${sem_num}`;
    sql.query(query, (err, res) => {
      if (err) {
        reject({
          code: 400,
          status: "fail",
          message: "Sql Error",
        });
        errorLogger("getSemesterExams", "SQL");
      }
      setStudentSemesterExamsCache(stu_id, sem_num, res);
      resolve({
        code: 200,
        status: "success",
        message: "Data fetched successfully",
        body: res,
      });
    });
  });
};
