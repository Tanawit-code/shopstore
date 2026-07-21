const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "shopstore"
});

db.connect((err) => {
    if (err) {
        console.log("Connect Error :", err);
    } else {
        console.log("MySQL Connected");
    }
});

module.exports = db;