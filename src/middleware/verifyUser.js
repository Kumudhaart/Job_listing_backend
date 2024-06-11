const jwt=require('jsonwebtoken');
const verifyUser=async(req,res,next)=>{
    try{
        const token=req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized access" });
        }
        const decode= jwt.verify(token,process.env.PRIVATE_KEY);
        console.log(decode)
        req.currentUserId=decode.id;
        next();
    }catch(err){
        console.log(err);
        return res.status(401).json({
            message: "Unauthorized access! Invalid token",
            isTokenInValid: true,
        });
    }
    
}
module.exports=verifyUser