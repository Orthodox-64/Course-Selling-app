const express=require("express");
const Router=express.Router;
const courseRouter=Router();

courseRouter.post("/purchase",function(req,res){

})

courseRouter.get("/preview",function(req,res){
   res.json({
    msg:"HI there"
   })
})
module.exports={
    courseRouter:courseRouter
}