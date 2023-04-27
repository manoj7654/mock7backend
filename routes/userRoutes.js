const express=require("express");
const userRouter=express.Router();

        //   for modal importing
        const {UserModal}=require("../modals/userModal")

        // for hashing password
        const bcrypt=require("bcrypt")

    const jwt=require("jsonwebtoken");
// const { useRouteMatch } = require("react-router-dom");

    //  for dotenv
    require("dotenv").config()


    // for filesystem module
    const fs=require("fs")


    // for authentication
    const {authenticate}=require("../middleware/authentication")

userRouter.get("/",(req,res)=>{
    res.send("hello from users")
})


userRouter.get("/allusers",async(req,res)=>{

    try {
        let result=await UserModal.find();
        res.send(result)
    } catch (error) {
        console.log(error)
        res.json({"message":"While finding data getting error"})
    }
})

userRouter.get("/alldata/:id",async(req,res)=>{
    const Id=req.params.id;

    try {
        let result=await UserModal.find({_id:Id});
        res.send(result)
    } catch (error) {
        console.log(error)
        res.json({"message":"While finding data getting error"})
    }
})


userRouter.post("/register",async(req,res)=>{
    const {profile,name,bio,phone,email,password}=req.body;
    try {
        let result=await UserModal.find({email});
        if(result.length>0){
            return res.json("User already exists")
        }
        bcrypt.hash(password,5,async(err,secure_password)=>{
            if(err){
                console.log(err)
            }
            const user=new UserModal({profile,name,bio,phone,email,password:secure_password})
            await user.save()
            res.json({"message":"User register successfull"})
        })
            
        
    } catch (error) {
        console.log("Something went wrong")
    }
})

userRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body
    try {
        const user=await UserModal.find({email});
        if(user.length>0){
            bcrypt.compare(password,user[0].password,(err,result)=>{
                if(result){
                 const token=jwt.sign({userID:user[0]._id},process.env.key);
                 res.json({message:"Login successful","token":token,"userId":user[0]._id})
                }else{
                    res.json("Wrong credential")
                }
            })
        }else{
            res.json("Wrond credential")
        }
    } catch (error) {
        console.log("Something went wrong")
        
    }
})

userRouter.patch("/edit/:id",authenticate,async(req,res)=>{
    const Id=req.params.id;
    const body=req.body;
    const user=await UserModal.findOne({_id:Id});
    const userID_in_user=user._id;
    const userID_making_req=req.body.userID
    try {
        if(userID_making_req!=userID_in_user){
            res.json({"message":"You are not authorized"})
        }else{
            await UserModal.findByIdAndUpdate({"_id":Id},body);
            res.json("User has been updated")
        }
       
    } catch (error) {
        console.log("Something went wrong")
        res.json("While updating data getting error")
        
    }
})


userRouter.get("/logout",async(req,res)=>{
    token=req.headers.authorization;
    console.log(token)
    const blacklistedData=JSON.parse(fs.readFileSync("./blacklistedData.json","utf-8"));
    blacklistedData.push(token);
    fs.writeFileSync("./blacklistedData.json",JSON.stringify(blacklistedData))

    res.json({"message":"Logout successfull"})
})

module.exports={userRouter}
