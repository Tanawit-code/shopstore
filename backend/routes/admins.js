const express = require("express");
const router = express.Router();
const db = require("../db");

const verifyToken = require("../middleware/auths");
const role = require("../middleware/role");


// ==========================
// แสดงสินค้าทั้งหมด
// ==========================

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


// ==========================
// แสดงสินค้าตาม ID
// ==========================

router.get("/admins/:id", verifyToken, role("admin"), (req, res) => {

    const { id } = req.params;

    const sql = "SELECT * FROM products WHERE ProductID = ?";

    db.query(sql, [id], (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                success: false,
                message: "เกิดข้อผิดพลาด"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "ไม่พบสินค้า"
            });
        }

        res.json(results[0]);

    });

});


// ==========================
// เพิ่มสินค้า
// ==========================

router.post("/admins", verifyToken, role("admin"), (req, res) => {

    const {
        ProductName,
        ProductPrice,
        UnitsInStock
    } = req.body;


    if (
        !ProductName ||
        ProductPrice === undefined ||
        UnitsInStock === undefined
    ) {

        return res.status(400).json({
            success: false,
            message: "กรุณากรอกข้อมูลให้ครบ"
        });

    }


    const sql = `
        INSERT INTO products
        (ProductName, ProductPrice, UnitsInStock)
        VALUES (?, ?, ?)
    `;


    db.query(
        sql,
        [
            ProductName,
            ProductPrice,
            UnitsInStock
        ],
        (err, result) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "ไม่สามารถบันทึกสินค้าได้",
                    error: err.message
                });

            }


            res.status(201).json({
                success: true,
                message: "บันทึกสินค้าสำเร็จ",
                ProductID: result.insertId
            });

        }
    );

});


// ==========================
// แก้ไขสินค้า
// ==========================

router.put("/admins/:id", verifyToken, role("admin"), (req, res) => {

    const { id } = req.params;

    const {
        ProductName,
        ProductPrice,
        UnitsInStock,
        Image
    } = req.body;


    const sql = `
        UPDATE products
        SET
            ProductName = ?,
            ProductPrice = ?,
            UnitsInStock = ?
        WHERE ProductID = ?
    `;


    db.query(
        sql,
        [
            ProductName,
            ProductPrice,
            UnitsInStock,
            id
        ],
        (err, result) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "ไม่สามารถแก้ไขสินค้าได้",
                    error: err.message
                });

            }


            if (result.affectedRows === 0) {

                return res.status(404).json({
                    success: false,
                    message: "ไม่พบสินค้า"
                });

            }


            res.json({
                success: true,
                message: "แก้ไขสินค้าเรียบร้อย"
            });

        }
    );

});


// ==========================
// ลบสินค้า
// ==========================

router.delete("/admins/:id", verifyToken, role("admin"), (req, res) => {

    const { id } = req.params;


    const sql = "DELETE FROM products WHERE ProductID = ?";


    db.query(sql, [id], (err, result) => {

        if (err) {

            console.error(err);

            return res.status(500).json({
                success: false,
                message: "ไม่สามารถลบสินค้าได้",
                error: err.message
            });

        }


        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "ไม่พบสินค้า"
            });

        }


        res.json({
            success: true,
            message: "ลบสินค้าเรียบร้อย"
        });

    });

});


module.exports = router;