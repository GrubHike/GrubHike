const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const nodemailer =  require('nodemailer');
const crypto = require('crypto');
const path = require('path')
const hbs = require('nodemailer-express-handlebars')

//For managing the views for email verification
const handlebarOptions = {
    viewEngine : 
    {
        partialsDir: path.resolve(path.join(__dirname,'..','/view/')),
        defaultLayout: false
    },
    viewPath :  path.resolve(path.join(__dirname,'..','/view/'))

}

//Now importing these so that we can able to delete the unnecssary data from the server
const util = require('util');
const unlinkFile = util.promisify(fs.unlinkSync);

//Importing the S3 functions
const { uploadFile,getFileStream } = require('../functions/s3');

//Importing the Model of the User
const User = require('../models/guest');

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

//For Mail Server Setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.EMAIL_ADDD,
        pass: process.env.EMAIL_PASSS
    },
    tls:{
        rejectUnauthorized: false
    }
})

// use a template file with nodemailer
transporter.use('compile', hbs(handlebarOptions))

exports.signupController = async(req,res,next) => {
    //First Validating Uniquness According To --> Username, email ,phonenum
    //console.log(__dirname);
    if(req.body.email && req.body.phoneNum && req.body.dob && req.body.firstName && req.body.lastName && req.body.gender)
    {
    
    const email = req.body.email;
    const phoneNum = req.body.phoneNum;
    let error;
    try {
        const emailExists = await User.findOne({ email });
        const phoneNumExists = await User.findOne({ phoneNum });
        
        if(emailExists && phoneNumExists) {
            error = "Email Or Phone Number already exists";
            throw new Error("Email Or Phone Number already exists");
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
               emailToken : crypto.randomBytes(64).toString('hex'),
               isVerified: false
            });
            
            //Send the Mail Also for Verification after saving it to data base
             //console.log(user.email);
            const mailOptions = {
                from : "Verify Your Account 📧! <"+process.env.EMAIL_ADDD+">",
                to :  user.email,
                subject: 'GrubHike - Mail Verification✌',
                template: 'mail/email-verify',
                context:{
                    firstName: user.firstName,
                    host : req.headers.host,
                    emailToken : user.emailToken
                }
            }
            //LETS SEND the Mail
            // Promise.all([ transporter.sendMail(mailOptions),user.save()])
            // .then(result =>{
            //     res.status(201).json({
            //                              status: true,
            //                              message : "user created 🎉🎉",
            //                              mailSent : true,
            //                              mailInfo : result
            //              })
            // }).catch(err=>{
            //          res.status(500).json({status : false,
            //          message : "Some Error Caused",
            //          error : err})
            // })
            
            transporter.sendMail(mailOptions,function(err,info){
                if(err)
                {
                    console.error(err);
                }
                else
                {
                    console.info(info)
                }
            })

            user.save().then(result => {
 
                //console.log(result); 
                res.status(201).json({
                     status: true,
                     message : "user created 🎉🎉",
                     mailSent : true
     })
 
 }).catch(err => {
         res.status(500).json({
             status : false,
             message : "Some Error Caused",
             error : err
         })
     })

            
}})
    }
    else
    {
        res.status(400).json({
            status : false,
            message : "Not Given the Complete Data"
        })
    }
}

//For Mail Verification
exports.mailVerify = async(req,res)=>{
    if(req.query.token)
    {
    try
    {
        const token = req.query.token
        const user = await User.findOne({ emailToken : token})
        //console.log(user);
        
        if(user)
        {
            user.emailToken=null,
            user.isVerified=true,
            await user.save()
            
            const mailOptions = {
                from : "Verification Done ✅! <"+process.env.EMAIL_ADDD+">",
                to :  user.email,
                subject: 'GrubHike - Mail Verification✌',
                template: 'mail/email-verified',
                context:{
                    firstName: user.firstName,
                }
            }
            //LETS SEND the Mail
            transporter.sendMail(mailOptions,function(err,info){
                if(err)
                {
                    //console.log(err);
                    // res.status(500).json({
                    //     status: false,
                    //     message: "Some Problem with your mail",
                    //     mailSent: false
                    // })
                    let page = path.join(__dirname,'..','/view/auth/mail-verify-1.html')
                    res.status(500).sendFile(page);
                }
                else
                {
                   // console.log(info)
                    let page = path.join(__dirname,'..','/view/auth/mail-verify-1.html')
                    res.status(200).sendFile(page);
                }})
                       
            
        }
        else
        {
            let page = path.join(__dirname,'..','/view/error/mail-not-verify-0.html')
            res.status(400).sendFile(page)
        }
    }
    catch(err)
    {
        console.log(err);
        let page = path.join(__dirname,'..','/view/error/no-access.html')
       res.status(500).sendFile(page)
    }
}
else
{
    res.status(400).json({
        status : false,
        message : "Token is Missing"
    })
}
}

exports.login = (req,res,next)=>{
    if(req.body.mail && req.body.password)
    {
    User.find({email: req.body.email})
    .exec()
    .then(user=>{
        if(user.length<1){
            return res.status(401).json({
                status : false,
                message: 'Please Check Email or Password!'
            })
        }
        //if everything perfect
        bcrypt.compare(req.body.password,user[0].pass,(err,result)=>{
            if(err)
            {
                return res.status(401).json({
                    status : false,
                    message: 'Please Check Email or Password!'
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
            return res.status(500).json({
                status: false,
                message: 'Internal Error'
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
    else
    {
        res.status(400).json({
            status : false,
            message : "Not Given the Complete Data"
        })
    }
}

exports.getUserDetail = (req,res,next)=>
{
    const _id = req.params.uid;
    //console.log(_id);
    if(_id){
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
    else
    {
        res.status(400).json({
            status : false,
            message : "Not Given the Complete Data"
        })
    }

}

exports.updateProfilePic = async(req,res,next)=>{

const id = req.params.userId;
//Checking That User Wants to Upload the Pic or Not
if(req.file)
{
//Then if yes then upload to s3
   uploadToS3(req.file,res)
.then(data=>{   
   //Now finding the complete detail of particular user by the given id and also updating with new fields
   User.findOneAndUpdate({_id:id},{
       $set : {
          profilePicInfo : { "fileKey" :  data.key,"fileLocation" : data.Location,"bucketName" : data.Bucket },
       }
   }).exec().then(result=>{
       //Once the after the Successfully done with uploads we also need to delete the uploa
       //dir from the server becox its taking uncessary space
       unlinkFile(req.file.path,function(err,info){
        if(err) console.error(err)
       })
           //If Updated Successfully then trying to get new updated data
           User.findOne({_id:id}).exec().then(
            result=>{
                res.status(200).json({
                    status: true,
                    message : "User Profile Pic Updated!",
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
        })})
       .catch(err => {
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
else
{
    res.status(400).json({
        status : false,
        message : "Not Given The Data!,Either Your Given Info is Incorrect",
    })
}
}


exports.updateInfo = async (req,res,next) => {
    //console.log(req.file);
    if(req.params.userId && req.body.hobbies && req.body.socialHandles && req.body.desc && req.body.address)
    {
     const id = req.params.userId;
     //console.log(id);
        User.findOneAndUpdate({_id:id},{
            $set : {
               hobbies : req.body.hobbies,
               socialHandles :req.body.socialHandles,
               desc : req.body.desc,
               address :req.body.address
            }
        }).exec().then(
            //If Updated Successfully then trying to get new updated data
                result=>{

                        User.findOne({_id:id}).select("-pass").exec().then(
            result=>{
                res.status(200).json({
                    status: true,
                    message : "User Profile Pic Updated!",
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
                    })
            .catch(err => {
            res.status(400).json({
                status : false,
                message : "Might be User Is Not Present! Or You Have Not Given Complete Info",
                error : err
            })
        })
     }
     else
     {
        res.status(400).json({
            status : false,
            message : "Not Given the Complete Data"
        })
     }
    }


exports.viewProfilePic = (req,res)=>{
    const key= req.params.key;
    const readStream = getFileStream(key);
    if(key) readStream.pipe(res);
    else
    { res.status(400).json({
        status : false,
        message : "Not Given the Complete Data"
    })
}
}