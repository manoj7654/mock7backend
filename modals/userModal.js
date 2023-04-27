const mongoose=require("mongoose");

const userSchema=mongoose.Schema({
    profile:String,
    name:String,
    bio:String,
    phone:Number,
    email:String,
    password:String,
   
})


const UserModal=mongoose.model("users",userSchema);


module.exports={UserModal}