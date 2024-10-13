const express = require("express");
const Router = express.Router;
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const {z}=require("zod");
const { userModel } = require("../db");
const userRouter = Router();
const {JWT_USER_PASSWORD}=require("../config")

userRouter.post("/signup", async function(req, res) { 
    const requiredbody=z.object({
        email:z.string().min(6).max(20).email(),
        password:z.string().min(5).max(99),
        firstname:z.string().min(3).max(100),
        lastname:z.string().min(3).max(100),
    })
    const parseData=requiredbody.safeParse(req.body);
    const email=req.body.email;
    const password=req.body.password;
    const firstname=req.body.firstname;
    const lastname=req.body.lastname;
    const hashedpassword=await bcrypt.hash(password,5);
    if(!parseData.success){
        res.json({
            msg:"invalid input",
            error:parseData.error
        })
    }
    try{
    await userModel.create({
        email:email,
        password:hashedpassword,
        firstname:firstname,
        lastname:lastname
    })
}
   catch(e){
     console.log("Error occured");
   }
    res.json({msg:"Signed up"});
});

userRouter.post("/signin", async function(req, res) { 
   const {email,password}=req.body;
   const user=await userModel.findOne({
       email:email,
   });
   const passwordmatch=await bcrypt.compare(password,user.password);
   if(!passwordmatch){
      return res.status(403).json({
        msg:"Invalid Credentials"
      })
   }
   if(user){
       const token=jwt.sign({
        id:user._id
       },JWT_USER_PASSWORD);
       res.json({
        token:token
       })
   }
   else{
    res.status(403).json({
        msg:"Invalid Credentials"
    })
   }
});

userRouter.get("/purchases", function(req, res) {

 });

module.exports = {
    userRouter: userRouter
};