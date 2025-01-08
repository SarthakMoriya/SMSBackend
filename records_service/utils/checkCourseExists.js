import { sql } from "../db/connectDb.js";

export const checkCourseExists = (course) => {
  return new Promise((resolve, reject) => {
    sql.query(
      `SELECT name FROM course WHERE name=?`,
      [course],
      (err, result) => {
        if (err) {
          console.log(err);
          reject({
            message: "Course not found with name:" + course,
            isValid: false,
          });
        }
        resolve({ isValid: true });
      }
    );
  });
};
