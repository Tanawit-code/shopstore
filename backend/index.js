const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// หน้าแรกของ API
app.get("/", (req, res) => {
    res.send("Online Shop API");
});

// ดึงข้อมูลทั้งหมดจากตาราง products
app.get("/products", (req, res) => {

    const sql = "SELECT * FROM products";

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "เกิดข้อผิดพลาดในการดึงข้อมูล"
            });
        }

        res.json(results);
    });

});

//เรียก router admins
const adminsRouter = require("./admins");
app.use("/", adminsRouter);

// เปิด Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});