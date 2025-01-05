import { sql } from "./connectDb.js";

export const addExamToDb = (db, data) => {
  return new Promise((resolve, reject) => {
    let query = `INSERT INTO ${db}.exams 
    (student_id,semester_number,exam_name,subject_name,score,total_marks,exam_date) 
    VALUES (?,?,?,?,?,?,?)`;
    sql.execute(
      query,
      [
        data.student_id,
        data.semester_number,
        data.exam_name,
        data.subject_name,
        data.score,
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