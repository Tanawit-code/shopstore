const express=require("express");
const router=express.Router();
const db=require("../db");

const verifyToken=require("../middleware/auths");
const role=require("../middleware/role");

router.get("/products",verifyToken,role("customer"),(req,res)=>{

const sql="SELECT * FROM products";

db.query(sql,(err,results)=>{

if(err){
console.error(err);

return res.status(500).json({
success:false,
message:"เกิดข้อผิดพลาดในการดึงข้อมูล"
});
}

res.json(results);

});

});

module.exports=router;