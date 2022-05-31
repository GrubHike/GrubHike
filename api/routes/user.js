const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const fs = require('fs');
const multer = require('multer');

//Importing the S3 functions
const { uploadFile } = require('../functions/s3');


const storage = multer.diskStorage({
    destination: function(req,file,cb){
        //if that dir is not created then this will create that dir first
        fs.mkdir('./uploads/',(err)=>{
            cb(null,'./uploads/');
        })
    },
    filename: function(req,file,cb)
    {
        cb(null,new Date().toISOString().replace(/:/g, '-') +'-'+file.originalname);
    }
})

const upload = multer({storage : storage});

async function uploadToS3(file,res)
{
    try{
        const result = await uploadFile(file);
        //console.log(result)
        return result;
    }
    catch(err)
    {
        res.status(400).json({
            status: false,
            message: err
        })
    }
} 

//Importing the Model of the User
const User = require('../models/user');

router.post('/signup',upload.single('profileImage'),async (req,res,next)=>{
     console.log(req.file);
     console.log(req.body.firstName);
    uploadToS3(req.file,res)
    .then(data=>{
        console.log(data)
    }).catch(
        err=>{
            res.status(400).json({
                status : false,
                message : "Not Able to Upload the Profile Pic!",
                errr : err
            })
        });
    //   bcrypt.hash(req.body.password, 10,(err,hash)=>{
    //          if(err)
    //          {
    //              return res.status(500).json({
    //                  erre : "at line 14",
    //                  error : err
    //              });
    //          }
    //          else {
    //             const user = new User({
    //                 _id : new mongoose.Types.ObjectId(),
    //                 firstName : req.body.firstName,
    //                 lastName :  req.body.lastName,
    //                 gender : req.body.gender,
    //                 age : req.body.age,
    //                 socialHandles : req.body.socialHandles,
    //                 hobbies : req.body.hobbies,
    //                 phoneNum : req.body.phoneNum,
    //                 address : req.body.address,
    //                 desc : req.body.desc,
    //                 fileInfo : { "fileKey" :  fileInfo.key,"fileLocation" : fileInfo.Location,"bucketName" : fileInfo.Bucket },
    //                 email : req.body.email,
    //                 pass : hash,
    //              });

    //              user.save().then( result => {
    //                 console.log(result); 
    //                 res.status(201).json({
    //                      status: true,
    //                      message : "user created 🎉🎉"
    //               }) }
    //              ).catch(
    //                  err => {
    //                      console.log(err);
    //                      res.status(500).json({
    //                         status : false, 
    //                         error : err
    //                      });
    //                  }
    //              );
    //             }
    //          })
         })
module.exports = router;