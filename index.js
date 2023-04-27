const express=require("express");

const app=express();

require("dotenv").config()

        // for connection/
const {connection}=require("./config/db")


            //    for importing routes
const {userRouter}=require("./routes/userRoutes")
 
            //    for miidleware
app.use(express.json());
const cors=require("cors")
app.use(cors())
app.use("/users",userRouter)

app.listen(process.env.port,async()=>{
    try {
        await connection;
        console.log("Connected to db")
    } catch (error) {
        console.log("Something went wrong")
    }
    console.log(`Server is running on port no ${process.env.port}`)
})