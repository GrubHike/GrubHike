const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

//Now importing these so that we can able to delete the unnecssary data from the server
const util = require('util');
const unlinkFile = util.promisify(fs.unlinkSync);

//Importing the S3 functions
const { uploadFile,getFileStream } = require('../functions/s3');

//Importing the Model of the User
const User = require('../models/user');

//Function for Uploading data to the S3 bucket
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
            message : "Error Caused In Uploading!"
        })
    }
} 



exports.signupController = async(req,res,next) => {
    //First Validating Uniquness According To --> Username, email ,phonenum
    const email = req.body.email;
    const phoneNum = req.body.phoneNum;
    let error;
    try {
        const emailExists = await User.findOne({ email });
        const phoneNumExists = await User.findOne({ phoneNum });
        
        if(emailExists && phoneNumExists) {
            error = "Username and email already exists";
            throw new Error("Username and email already exists");
        }else if(emailExists) {
            error = "Email already exists";
            throw new Error("Email already exists");
        } else if(phoneNumExists)
        {
            error = "PhoneNum Already exists";
            throw new Error("PhoneNum Already exists");
        }
    } catch(err) {
        //console.error(err);
        // const message = err;
                
        return res.status(409).json({

            //409--conflict or 422 -- Unproccessable
                status : "false",
                error : error
            })
    }

    bcrypt.hash(req.body.password, 10,(err,hash)=>{
        if(err)
        {
            return res.status(500).json({
                status : false,
                message : "Give Perfect Password!"
            });
        }
        else {
           const user = new User({
               _id : new mongoose.Types.ObjectId(),
               firstName : req.body.firstName,
               lastName :  req.body.lastName,
               gender : req.body.gender,
               dob : req.body.dob,
               phoneNum : phoneNum,
               email : email,
               pass : hash,
            });
    

            user.save().then( result => {
               //console.log(result); 
               res.status(201).json({
                    status: true,
                    message : "user created 🎉🎉",
    })}).catch(err => {
        res.status(500).json({
            status : false,
            message : "Some Error Caused",
            error : err
        })
    })
}})
}

exports.login = (req,res,next)=>{
    User.find({email: req.body.email})
    .exec()
    .then(user=>{
        if(user.length<1){
            return res.status(401).json({
                message: 'Authentication Failed! At length'
            })
        }
        //if everything perfect
        bcrypt.compare(req.body.password,user[0].pass,(err,result)=>{
            if(err)
            {
                return res.status(401).json({
                    message: 'Authentication Failed! At pass'
                })
            }
            if(result)
            {
                const token = jwt.sign(
                    {
                        _id : user[0]._id,
                        email : user[0].email
                    },
                 //Now, we need to provide the key
                 process.env.JWT_KEY,
                 {
                     //Now provide other options like expire in
                     expiresIn : "1h"
                 }

                );

                return res.status(200).json({
                    status : true,
                    message : "Authenctication Successfull!",
                    token : token
                })
            }
            return res.status(401).json({
                message: 'Authentication Failed! At Nothing'
            })
        })

    })
    .catch(
        err=>{
            res.status(500).json({
                
            })
        }
    )
}

exports.getUserDetail = (req,res,next)=>
{
    const _id = req.params.uid;
    //console.log(_id);

    User.findOne({_id: _id}).select('-pass')
    .exec()
    .then(
       user => {
           // console.log(user);
            res.status(200).json({
                status : true,
                message : "Got the User!",
                data : user
            })
         }
    ).catch(err => {
        res.status(404).json({
                    status : false,
                    message : "Not Found",
                    error : err
    })
})

}

exports.updateInfo = async (req,res,next) => {
    //console.log(req.file); 

     const id = req.params.userId;
     //console.log(id);
    
     //Checking That User Wants to Upload the Pic or Not
     if(req.file)
     {
 //Then if yes then upload to s3
        uploadToS3(req.file,res)
    .then(data=>{   
        //Now finding the complete detail of particular user by the given id and also updating with new fields
        User.findOneAndUpdate({_id:id},{
            $set : {
               hobbies : JSON.parse(req.body.hobbies),
               socialHandles : JSON.parse(req.body.socialHandles),
               profilePicInfo : { "fileKey" :  data.key,"fileLocation" : data.Location,"bucketName" : data.Bucket },
               desc : req.body.desc,
               address : JSON.parse(req.body.address),

            }
        }).exec().then(
            //Once the after the Successfully done with uploads we also need to delete the uploa
            //dir from the server becox its taking uncessary space
            unlinkFile(req.file.path).then(
                
                //If Updated Successfully then trying to get new updated data
            User.findOne({_id:id}).exec().then(
                result=>{
                    res.status(200).json({
                        status: true,
                        message : "User Profile Updated!",
                        data : result
                    })}
            ).catch(err=>{
                res.status(500).json(
                    {
                        status : false,
                        message : "Some Error Caused During Fetching New Data",
                        error : err
                    }
                )
            })).catch(err=>{
                res.status(500).json({
                    status: false,
                    message : "Error in unlinking the File From the Server!",
                    error :  err
                })
            })


            
            
        ).catch(err => {
            res.status(400).json({
                status : false,
                message : "Might be User Is Not Present! Or You Have Not Given Complete Info",
                error : err
            })
        })

    }).catch(
        err=>{
            res.status(500).json({
                status : false,
                message : "Not Able to Upload the Profile Pic!",
                errr : err
            })
        });

     }

     else{
        User.findOneAndUpdate({_id:id},{
            $set : {
               hobbies : JSON.parse(req.body.hobbies),
               socialHandles : JSON.parse(req.body.socialHandles),
               desc : req.body.desc,
               address : JSON.parse(req.body.address),

            }
        }).exec().then(
            //If Updated Successfully then trying to get new updated data
            User.findOne({_id:id}).select("-pass").exec().then(
                result=>{
                    res.status(200).json({
                        status: true,
                        message : "User Profile Updated!",
                        data : result
                    })}
            ).catch(err=>{
                res.status(500).json(
                    {
                        status : false,
                        message : "Some Error Caused During Fetching New Data",
                        error : err
                    }
                )
            })
            
        ).catch(err => {
            res.status(400).json({
                status : false,
                message : "Might be User Is Not Present! Or You Have Not Given Complete Info",
                error : err
            })
        })
     }}

exports.viewProfilePic = (req,res)=>{
    const key= req.params.key;
    const readStream = getFileStream(key);

    readStream.pipe(res);
}