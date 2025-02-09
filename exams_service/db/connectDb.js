import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

export const sql = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

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


// PROMISES SQL
// Create a connection pool
const pool = mysql.createPool({
    host: 'localhost',  // Change this to your database host
    user: 'root',       // Change this to your MySQL username
    password: 'root', // Change this to your MySQL password
    database: '',   // Change this to your database name
    waitForConnections: true,
    connectionLimit: 10,  // Maximum number of connections
    queueLimit: 0
}).promise();

export default pool;