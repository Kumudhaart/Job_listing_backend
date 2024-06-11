const User=require('../model/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const registerUser=async(req,res,next)=>{
    try{
        const {name,email,mobile,password}=req.body;
        console.log(req.body);
        if(!name || !email || !mobile || !password){
            return res.status(400).json({
                errMessage:"invalid data"
            })
        }
        const existingUser=await User.findOne({email:email});
        console.log(existingUser);
        if(existingUser){
            return res.json({
                msg:"user already exist"
            })
        }
        let encryptedPassword=await bcrypt.hash(password,10);
       await new User({name,email,mobile,password:encryptedPassword}).save();
       res.json({
        msg:"user created sucessfully"
       })
    }catch(err){
        next(err);
    }
}
const loginUser=async(req,res,next)=>{
    try{
    const {email,password}=req.body;
    console.log(email);
    const isExistingUser=await User.findOne({email:email})
    console.log(isExistingUser.password);
    if(!email || !password){
        return res.status(400).json({
            msg:"Bad request"
        })
    }
    if(!isExistingUser){
        return res.status(404).json({
            mesg:"user not exist"
        })
    }
    const passwordMatch=await bcrypt.compare(password,isExistingUser.password);
    console.log(passwordMatch);
    if(!passwordMatch){
        return res.status(401).json({
            msg:"invalid crendtials "
        })
    }
    const token=jwt.sign({id:isExistingUser._id},process.env.PRIVATE_KEY,{expiresIn:"60h"});
    res.json({
        msg:"logged in successfully",
        token:token,
        userId:isExistingUser._id,
    });
}catch(err){
    next(err);
}
}

module.exports={registerUser,loginUser};