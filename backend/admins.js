const express = require("express");
const router = express.Router();
const db = require("./db");


// ===============================
// GET ALL + SEARCH PRODUCT
// GET http://localhost:3000/admins
// GET http://localhost:3000/admins?q=phone
// ===============================

router.get("/admins", (req, res) => {
    const keyword = req.query.q;
    let sql = "SELECT * FROM products";
    let params = [];
    if (keyword) {
        sql += " WHERE ProductName LIKE ?";
        params.push(`%${keyword}%`);
    }
    db.query(
        sql,
        params,
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: "เกิดข้อผิดพลาดในการดึงข้อมูล"
                });
            }
            res.json(results);
        }
    );
});


// ===============================
// INSERT PRODUCT
// POST http://localhost:3000/admins
// ===============================

router.post("/admins", (req, res) => {
    const {
        ProductName,
        ProductPrice,
        UnitsInStock,
        Image
    } = req.body;

    const sql = `
        INSERT INTO products
        (
            ProductName,
            ProductPrice,
            UnitsInStock,
            Image
        )
        VALUES(?,?,?,?)
    `;

    db.query(
        sql,
        [
            ProductName,
            ProductPrice,
            UnitsInStock,
            Image
        ],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json(err);
            }
            res.json({
                message: "เพิ่มสินค้าเรียบร้อย",
                id: result.insertId
            });
        }
    );
});

// ===============================
// GET PRODUCT BY ID
// GET http://localhost:3000/admins/1
// ===============================

router.get("/admins/:id", (req, res) => {
    const id = req.params.id;
    const sql =
        "SELECT * FROM products WHERE ProductID=?";
    db.query(
        sql,
        [id],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: "เกิดข้อผิดพลาด"
                });
            }
            if (result.length === 0) {
                return res.status(404).json({
                    message: "ไม่พบสินค้า"
                });
            }
            // ส่งข้อมูลสินค้า 1 รายการกลับไป
            res.json(result[0]);
        }
    );
});


// ===============================
// UPDATE PRODUCT
// PUT http://localhost:3000/admins/1
// ===============================


router.put("/admins/:id", (req, res) => {
    const id = req.params.id;
    const {
        ProductName,
        ProductPrice,
        UnitsInStock,
        Image
    } = req.body;

    const sql = `
        UPDATE products
        SET
            ProductName=?,
            ProductPrice=?,
            UnitsInStock=?,
            Image=?
        WHERE ProductID=?
    `;

    db.query(
        sql,
        [
            ProductName,
            ProductPrice,
            UnitsInStock,
            Image,
            id
        ],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: "Update Error"
                });
            }

            res.json({
                message: "แก้ไขสินค้าเรียบร้อย",
                affectedRows: result.affectedRows
            });
        }
    );
});


// ===============================
// DELETE PRODUCT
// DELETE http://localhost:3000/admins/1
// ===============================


router.delete("/admins/:id", (req, res) => {
    const id = req.params.id;
    const sql =
        "DELETE FROM products WHERE ProductID=?";
    db.query(
        sql,
        [id],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json(err);
            }
            res.json({

                message: "ลบสินค้าเรียบร้อย"
            });
        }
    );
});


module.exports = router;