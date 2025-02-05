"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
const connection = mysql2_1.default.createConnection({
    host: "localhost",
    user: "root",
    password: "@Okemanlk123",
    database: "elevator_system",
});
exports.connection = connection;
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
            }
            else {
                console.log("Test query succeeded:", results);
            }
        });
    }
});
