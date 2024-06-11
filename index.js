const express=require('express');
const dotenv=require('dotenv');
const mongoose =require('mongoose');
const authRoute=require('./src/routes/auth');
const jobRoute=require('./src/routes/job');
const cors=require('cors');
dotenv.config();
const app=express();

app.use(express.json());
app.use(cors());
app.get('/health',(req,res)=>{
    res.json({
        service:"To check api is working",
        status:"active",
        time:new Date()
    })
})
app.use('/api/v1/auth',authRoute);
app.use('/api/v1/job',jobRoute);
app.use((error,req,res,next)=>{
    console.log(error);
    res.status(500).json({
        msg:"something went wrong"
    });
})
app.listen(process.env.PORT,()=>{
    mongoose.connect(process.env.MONGODB_URL).then(()=>{
        console.log("database connected")
    }).catch((err)=>{
        console.log(err);
    });
    console.log("server is running");
})