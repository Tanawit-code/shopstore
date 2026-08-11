const jwt=require("jsonwebtoken");

const SECRET_KEY="online-shop-secret";

const verifyToken=(req,res,next)=>{

const authHeader=req.headers.authorization;

if(!authHeader){
return res.status(401).json({
message:"No Token"
});
}

const token=authHeader.split(" ")[1];

jwt.verify(token,SECRET_KEY,(err,user)=>{

if(err){
return res.status(403).json({
message:"Invalid Token"
});
}

req.user=user;

next();

});

};

module.exports=verifyToken;