require('dotenv').config()
const express=require("express");
const mongoose=require("mongoose");
// require('dotenv').config();
// const url = process.env.MONGODB_URL;
const {userRouter}=require("./routes/user");
const {courseRouter}=require("./routes/course");
const {adminRouter}=require("./routes/admin");
const jwt=require("jsonwebtoken");
const course = require("./routes/course");
const app=express();
app.use(express.json());

app.use("/user",userRouter);
app.use("/admin",adminRouter);
app.use("/course",courseRouter);


async function main(){
await mongoose.connect(process.env.MONGODB_URL);
app.listen(3000);
console.log("listening on port 3000");
}

main();