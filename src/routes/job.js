const express=require('express');
const controller=require('../controller/job');
const verifyUser=require('../middleware/verifyUser')
const router=express.Router();
router.post("/create",verifyUser,controller.createJobPost);
router.put("/update/:id",verifyUser,controller.updateJobPost);
router.get("/search/:id/:userId",controller.findJobPost);
router.get("/display",controller.displayJobs);
module.exports=router;