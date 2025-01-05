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
          reject({ message: "signup() --00--AB" });
        }
        resolve({
          message: "Account created successfully",
          code: 200,
          status: "success",
        });
      }
    );
  });
};
export const checkExistingUser = async (email) => {
    console.log(email)
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM users WHERE email LIKE '${email}'`;
    sql.query(query, (err, response) => {
        console.log(response)
      if (err) {
        console.log(err);
        reject({ message: "login() --01--AA" });
      }
      if (response.length) {
        reject({
          message: "Email already in use",
          code: 200,
          status: "success",
        });
      }
      resolve({
        unique:true,
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
        body: response[0]
      });
    }
    reject({ message: "login() --01--AB", status: "error",body:[] });
  });
});
};
