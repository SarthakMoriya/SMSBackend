import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

// Create a connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,  // Change this to your database host
    user: process.env.DB_USER,       // Change this to your MySQL username
    password: process.env.DB_PASSWORD, // Change this to your MySQL password
    database: process.env.DB_NAME,   // Change this to your database name
    waitForConnections: true,
    connectionLimit: 10,  // Maximum number of connections
    queueLimit: 0
}).promise();

export default pool;