const express=require("express");
const Router=express.Router;
const adminRouter=Router(); 
const bcrypt=require("bcrypt");
const {z}=require("zod");
const jwt=require("jsonwebtoken");
const {JWT_ADMIN_PASSWORD}=require("../config")
const {adminModel, courseModel}=require("../db");
const {adminMiddleware}=require("../middleware/admin");
const course = require("./course");
adminRouter.post("/signup", async function(req, res) {
    const requiredbody = z.object({
      email: z.string().min(5).max(20).email(),
      password: z.string().min(4).max(30),
      firstname: z.string().min(3).max(100),
      lastname: z.string().min(3).max(100),
    });
  
    const parseData = requiredbody.safeParse(req.body);
   
    if (!parseData.success) {
      return res.status(403).json({
        msg: "invalid input",
      });
    }
  
    const { email, password, firstname, lastname } =req.body;
  
    try {
      const hashedPassword = await bcrypt.hash(password, 5);
  
      const admin = await adminModel.create({
        email: email,
        password: hashedPassword,
        firstname: firstname,
        lastname: lastname,
      });
  
      res.json({
        msg: "Welcome Admin",
        admin: admin,
      });
    } catch (e) {
      console.log("Error!!!", e);
      res.status(500).json({
        msg: "Server error while creating admin",
      });
    }
  });

adminRouter.post("/signin", async function(req, res) {
    const { email, password } = req.body;
const admin = await adminModel.findOne({ email: email });
if (!admin) {
    return res.status(403).json({ message: "Invalid credentials" });
}

const passwordMatch = await bcrypt.compare(password, admin.password);
if (!passwordMatch) {
    return res.status(403).json({ message: "Invalid credentials" });
}

const token = jwt.sign({ id: admin._id }, JWT_ADMIN_PASSWORD);

res.json({ token: token });

});

// adminRouter.use(adminMiddleware); 
adminRouter.post("/course",adminMiddleware,async function(req,res){
    const requiredbody=z.object({
        title:z.string().min(6).max(50),
        description:z.string().min(10).max(100),
        imageUrl:z.string(),
        price:z.string()
    })
    const parseData=requiredbody.safeParse(req.body);
    if(!parseData.success){
        res.json({msg:"Invalid Format"});
    }
    const adminId=req.userId;
    const {title,description,imageUrl,price}=requiredbody;
    try{
       const course= await courseModel.create({
            title:title,
            description:description,
            imageUrl:imageUrl,
            price:price,
            creatorId:adminId
        })
    }
    catch(e){
        res.status(403).send("Invalid Input");
    }
    res.json({
        msg:"Course Created",
        courseId:course._id
    })
})
adminRouter.put("/course",adminMiddleware,async function(req,res){
    const requiredbody=z.object({
        title:z.string().min(6).max(50),
        description:z.string().min(10).max(100),
        imageUrl:z.string(),
        price:z.string()
    })
    const parseData=requiredbody.safeParse(req.body);
    if(!parseData.success){
        res.json({
            msg:"Invalid Input"
        })
    }
    const adminId=req.userId;
    const {title,description,imageUrl,price,courseId}=requiredbody;
    try{
        const course=await courseModel.updateOne({
            __id:courseId,
            creatorId:adminId
        },{
            title,description,imageUrl,price
        })
    }
    catch(e){
          res.status(403).send("Invalid Format");
    }
    res.json({
        msg:"Updated",
        courseId:course._id
    })
})

adminRouter.get("/course/bulk",adminMiddleware,async function(req,res){
     const adminId=req.userId;
     const course =await courseModel.find({
        creatorId:adminId
     });
     res.json({
        course
     })
})



module.exports={
    adminRouter:adminRouter
}