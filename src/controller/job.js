const Job=require('../model/job');
const mongoose=require('mongoose');
const createJobPost = async (req, res, next) => {
    try {
        const {
            companyName,
            logoUrl,
            title,
            description,
            salary,
            location,
            locationType,
            skills,
            jobType,
            information,
        } = req.body;

        if (
            !companyName ||
            !logoUrl ||
            !title ||
            !description ||
            !salary ||
            !location ||
            !locationType ||
            !skills ||
            !jobType ||
            !information
        ) {
            return res.status(400).json({
                errorMessage: "Bad request",
            });
        }

        const jobDetails = new Job({
            companyName,
            logoUrl,
            title,
            description,
            salary,
            location,
            locationType,
            skills,
            jobType,
            information,
            refUserId: req.currentUserId,
        });
        await jobDetails.save();
        res.json({ message: "Job created successfully" ,isTokenInValid:false});
        return;
    } catch (error) {
        next(error);
    }
};

const findJobPost=async(req,res,next)=>{
    try{
    const jobPostId=req.params.id;
    const userId=req.params.userId;
    console.log(userId);
    const jobPost=await Job.findById(jobPostId);
    console.log(jobPost);
    if(!jobPost){
        res.json({
            msg:"job not found"
        })
    }
    let isEditable=false;
    console .log(jobPost.refUserId.toString(),userId.toString(),jobPost.refUserId.toString()===userId)
      if(jobPost.refUserId.toString()===userId){
        isEditable=true;
    }
    res.json({
        msg:"Job post found",
        jobPost:jobPost.toJSON(),
        isEditable:isEditable,
    })
}catch(err){
    next(err);
}
}

const updateJobPost=async(req,res,next)=>{
    try{
        const jobId=req.params.id;
        if(!jobId){
            return res.json({
                msg:"job id not found"
            })
        }
        const {
            companyName,
            logoUrl,
            title,
            description,
            salary,
            location,
            duration,
            locationType,
            skills,
            jobType,
            information,
        } = req.body;
        console.log(req.body)
        if (
            !companyName ||
            !logoUrl ||
            !title ||
            !description ||
            !salary ||
            !location ||
            !locationType ||
            !skills ||
            !jobType ||
            !information
        ) {
            return res.status(400).json({
                errorMessage: "Bad request",
            });
        }
        
        const updatedJob=await Job.findByIdAndUpdate(jobId,{
            companyName,
            logoUrl,
            title,
            description,
            salary,
            location,
            duration,
            locationType,
            skills,
            jobType,
            information,
            refUserId: req.currentUserId
        },{new:true})
        if(!updatedJob){
            return res.json({
                msg:"job not found"
            })
        }
            res.status(200).json({
                msg:"updated sucessfully"
            })
    }catch(err){
        next(err);
    }
}
 const displayJobs=async(req,res,next)=>{
    try{
        const searchQuery=req.query.searchQuery || "";
        const skills=req.query.skills;
        console.log(skills);
        let filter={};
        if(skills.length>0){
            var skill_arr=skills.split(',');
            var caseInsensitiveSkills=skill_arr.map(
                (element)=>new RegExp(element,"i")
            )
            skill_arr=caseInsensitiveSkills;
            filter={skills:{$in:skill_arr}}
        }
        const data=await Job.find({title:{$regex:searchQuery,$options:"i"},...filter});
        console.log(data);
        res.json({
            data:data
        })

    }catch(err){
        next(err);
    }
    
 }

module.exports={createJobPost,findJobPost,updateJobPost,displayJobs}
