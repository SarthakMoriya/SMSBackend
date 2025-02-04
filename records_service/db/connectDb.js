import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

export const sql = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const connectDB = () => {
  sql.connect((err) => {
    if (err) {
      console.error("Error connecting to the database:", err.message);
      return;
    }
    console.log("Connected to the MySQL database");
  });
};

export const establishedConnection = () => {
  return new Promise((resolve, reject) => {
    const connectSql = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      multipleStatements: true,
    });
    connectSql.connect((err) => {
      if (err) {
        reject(err);
      }
      console.log("opening DB connection...");
      resolve(connectSql);
    });
  });
};

export const closeDbConnection = (connectSql) => {
  console.log("Closing DB connection...");
  connectSql.destroy();
};
