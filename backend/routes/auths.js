const express=require("express");
const jwt=require("jsonwebtoken");
const connection=require("../db");
const router=express.Router();

const SECRET_KEY="online-shop-secret";

router.post("/auths",(req,res)=>{

const {username,password}=req.body;

if(!username||!password){
return res.status(400).json({
success:false,
message:"Please enter Username and Password!"
});
}

connection.query(
"SELECT * FROM accounts WHERE username=? AND password=?",
[username,password],
(error,results)=>{

if(error){
return res.status(500).json(error);
}

if(results.length===0){
return res.status(401).json({
success:false,
message:"Incorrect Username or Password"
});
}

const user=results[0];

const token=jwt.sign({
id:user.id,
username:user.username,
role:user.types
},
SECRET_KEY,
{
expiresIn:"1d"
});

if(user.types==="admin"){

const currentDate=new Date().toISOString().slice(0,19).replace("T"," ");

connection.query(
"INSERT INTO logadmin(logUsername,logPassword,logTime) VALUES(?,?,?)",
[
username,
password,
currentDate
]
);

}

res.json({
success:true,
token:token,
user:{
id:user.id,
username:user.username,
fullname:user.fullname,
role:user.types
}
});

});

});

module.exports=router;