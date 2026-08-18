const express = require("express");
const router = express.Router();
const mysql = require("../db");

router.post("/", (req, res) => {

    const {
        name,
        lastname,
        address,
        tel,
        email,
        username,
        password
    } = req.body;

    console.log("Signup Request:", req.body);

    if (
        !name ||
        !lastname ||
        !address ||
        !tel ||
        !email ||
        !username ||
        !password
    ) {
        return res.status(400).json({
            success: false,
            message: "กรุณากรอกข้อมูลให้ครบ"
        });
    }

    const data = {
        cmName: name,
        cmLastName: lastname,
        cmAddress: address,
        cmTel: tel,
        cmEmail: email
    };

    const sql = "INSERT INTO customer_member SET ?";

    mysql.query(sql, data, (err, result) => {

        if (err) {
            console.error("customer_member error:", err);

            return res.status(500).json({
                success: false,
                message: "ไม่สามารถบันทึกข้อมูล Customer ได้",
                error: err.message
            });
        }

        const cmID = result.insertId;

        console.log("New Customer ID:", cmID);

        const data2 = {
            username: username,
            password: password,
            cmID: cmID,
            types: "customer"
        };

        console.log("Account Data:", data2);

        const sql2 = "INSERT INTO accounts SET ?";

        mysql.query(sql2, data2, (err2, result2) => {

            if (err2) {
                console.error("accounts error:", err2);

                return res.status(500).json({
                    success: false,
                    message: "ไม่สามารถสร้าง Account ได้",
                    error: err2.message
                });
            }

            console.log("Register Success");

            return res.status(201).json({
                success: true,
                message: "สมัครสมาชิกสำเร็จ",
                cmID: cmID,
                accountID: result2.insertId
            });

        });

    });

});

module.exports = router;