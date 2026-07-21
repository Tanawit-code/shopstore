const express = require("express");
const router = express.Router();
const db = require("./db");


router.get("/products", (req, res) => {
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

module.exports = router;