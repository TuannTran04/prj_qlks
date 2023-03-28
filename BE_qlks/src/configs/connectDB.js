// get the client
// const mysql = require("mysql2");
import mysql from "mysql2/promise";

//------------- Create the connection pool (cach dung` Pool de dung async await)
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "qlks",
});

export default pool;
