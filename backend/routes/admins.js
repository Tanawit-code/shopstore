const express = require("express");
const router = express.Router();
const db = require("../db");

const verifyToken = require("../middleware/auths");
const role = require("../middleware/role");

router.get("/admins", verifyToken, role("admin"), (req, res) => {

    const sql = "SELECT * FROM products";

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                success: false,
                message: "เกิดข้อผิดพลาดในการดึงข้อมูล"
            });
        }

        res.json(results);

    });

});

router.post("/admins", verifyToken, role("admin"), (req, res) => {

    const { ProductName, ProductPrice, UnitsInStock } = req.body;

    if (!ProductName || ProductPrice === undefined || UnitsInStock === undefined) {
        return res.status(400).json({
            success: false,
            message: "กรุณากรอกข้อมูลให้ครบ"
        });
    }

    const sql = "INSERT INTO products (ProductName, ProductPrice, UnitsInStock) VALUES (?, ?, ?)";

    db.query(sql, [ProductName, ProductPrice, UnitsInStock], (err, result) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                success: false,
                message: "ไม่สามารถบันทึกสินค้าได้"
            });
        }

        res.status(201).json({
            success: true,
            message: "บันทึกสินค้าสำเร็จ",
            ProductID: result.insertId
        });

    });

});

module.exports = router;