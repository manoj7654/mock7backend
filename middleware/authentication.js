const jwt=require("jsonwebtoken");
require("dotenv").config();
const fs=require("fs");
const authenticate=(req,res,next)=>{
    const token=req.headers.authorization
    if(!token){
        res.json("Login first")
    }else{
        const blacklistedData=JSON.parse(fs.readFileSync("./blacklistedData.json","utf-8"));
        if(blacklistedData.includes(token)){
            return res.json("token is blacklisted ,please login again")
        }else{
            try {
                const decode=jwt.verify(token,process.env.key);
                if(decode){
                  
                    next()
                }else{
                    res.josn("Please login")
                }
            } catch (error) {
                console.log(error);
                res.json({"err":error.message})
            }
        }
    }
}


module.exports={authenticate}