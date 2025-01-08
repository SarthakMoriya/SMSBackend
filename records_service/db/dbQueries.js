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
