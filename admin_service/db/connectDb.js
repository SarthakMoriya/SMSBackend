import mysql from 'mysql2';

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