import { sql } from "./connectDb.js";

export const createUser = async (email, hashedPassword, secretKey, name) => {
  return new Promise((resolve, reject) => {
    let query = `INSERT INTO users (email,password,passcode,name) VALUES (?,?,?,?)`;
    sql.query(
      query,
      [email, hashedPassword, secretKey, name],
      (err, response) => {
        if (err) {
          console.log(err);
          reject({ message: "SQL ERROR", code: 400, status: fail });
        }
        resolve({
          message: "Account created successfully",
          code: 200,
          status: "success",
          body: [],
        });
      }
    );
  });
};
export const checkExistingUser = async (email) => {
  return new Promise((resolve, reject) => {
    let query = `SELECT COUNT(*) as count FROM users WHERE email LIKE '${email}'`;
    sql.query(query, (err, response) => {
      console.log(response);
      if (err) {
        console.log(err);
        reject({
          code: 400,
          status: "fail",
        });
      }
      if (response[0].count > 0) {
        reject({
          message: "Email already in use",
          code: 400,
          status: "fail",
        });
      }
      resolve({
        unique: true,
      });
    });
  });
};

export const checkExistingUserLogin = async (email) => {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM users WHERE email LIKE '${email}'`;
    sql.query(query, (err, response) => {
      if (err) {
        console.log(err);
        reject({ message: "login() --01--AA" });
      }
      if (response.length) {
        resolve({
          message: "Account find",
          code: 200,
          status: "success",
          body: response[0],
        });
      }
      reject({ message: "login() --01--AB", status: "error", body: [] });
    });
  });
};

export const findUserById = (id) => {
  return new Promise((resolve, reject) => {
    let query = `SELECT password FROM users WHERE id=?`;

    sql.query(query, [id], (err, response) => {
      if (err) {
        reject({
          code: 500,
          status: "fail",
          message: "SQL query failed",
        });
        console.log("ERROR IN findUserById() SQL ERROR");
      }
      if (!response.length) {
        reject({
          code: 200,
          status: "success",
          message: "No users were found with id passed",
          body: [],
        });
      }

      resolve({
        code: 200,
        status: "success",
        message: "User found with id passed",
        body: [response[0]],
      });
    });
  });
};
export const updateUserPasswordById = (id, password) => {
  return new Promise((resolve, reject) => {
    let query = `UPDATE users set password =? WHERE id=?`;

    sql.query(query, [password, id], (err, response) => {
      if (err) {
        reject({
          code: 500,
          status: "fail",
          message: "SQL query failed",
        });
        console.log("ERROR IN updateUserPasswordById() SQL ERROR");
      }
      resolve({
        code: 200,
        status: "success",
        message: "Password Updated successfully",
        body: [],
      });
    });
  });
};
