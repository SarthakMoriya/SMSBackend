import {
  setStudentSemesterExamsCache,
  setStudentSemesterExamsTotalCache,
} from "../redis/redisQueries.js";
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
export const getSemesterExamsTotalFromDb = (sql, db, stu_id) => {
  return new Promise((resolve, reject) => {
    let query = `SELECT semester_number,SUM(obt_marks) as obt_marks,SUM(total_marks) as total_marks,FLOOR((SUM(obt_marks)/SUM(total_marks))*100) as overall_percentage
                FROM ${db}.exams
                WHERE student_id=${stu_id}
                GROUP BY semester_number
                ORDER BY semester_number ASC;
                `;
    sql.query(query, (err, res) => {
      if (err) {
        reject({
          code: 400,
          status: "fail",
          message: "Sql Error",
        });
        errorLogger("getSemesterExams", "SQL");
      }
      setStudentSemesterExamsTotalCache(stu_id, res);
      resolve({
        code: 200,
        status: "success",
        message: "Data fetched successfully",
        body: res,
      });
    });
  });
};


export const updateExamQ=(db)=>`UPDATE ${db}.exams SET semester_number=?,obt_marks=?,total_marks=?,exam_date=? WHERE exam_id=?`