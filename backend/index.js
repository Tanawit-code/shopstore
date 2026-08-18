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


// เรียก Route admins
const admins = require("./routes/admins");
app.use("/", admins);


// เรียก Route products
const products = require("./routes/products");
app.use("/", products);

const auths = require("./routes/auths");
app.use("/", auths);

// เรียก Route register (สมัครสมาชิก)
const register = require("./routes/register");
app.use("/register", register);


// เปิด Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});