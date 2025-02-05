import mysql from "mysql2";

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "@Okemanlk123",
  database: "elevator_system",
});

connection.connect((err) => {
  if (err) {
    if (process.env.NODE_ENV !== "test") {
      console.error("MySQL connection error:", err);
    }
    return;
  }

  if (process.env.NODE_ENV !== "test") {
    console.log("Successfully connected to MySQL database");
    connection.query("SELECT 1", (err, results) => {
      if (err) {
        console.error("Test query failed:", err);
      } else {
        console.log("Test query succeeded:", results);
      }
    });
  }
});

export { connection };
