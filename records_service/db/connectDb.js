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

// PROMISES SQL
// Create a connection pool
const pool = mysql
  .createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, // Maximum number of connections
    queueLimit: 0,
  })
  .promise();

export default pool;
