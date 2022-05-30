const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//Importing the Model of the User
const User = require('../models/user');

router.post('/signup',(req,res,next)=>{
      bcrypt.hash(req.body.password, 10,(err,hash)=>{
             if(err)
             {
                 return res.status(500).json({
                     error : err
                 });
             }
             else {
                const user = new User({
                    _id : new mongoose.Types.ObjectId(),
                    firstName : req.body.firstName,
                    lastName :  req.body.lastName,
                    gender : req.body.gender,
                    age : req.body.age,
                    socialHandles : req.body.socialHandles,
                    hobbies : req.body.hobbies,
                    phoneNum : req.body.phoneNum,
                    address : req.body.address,
                    desc : req.body.desc,
                    email : req.body.email,
                    pass : hash,
                 });

                 user.save().then( result => {
                    console.log(result); 
                    res.status(201).json({
                         message : "user created 🎉🎉"
                  }) }
                 ).catch(
                     err => {
                         console.log(err);
                         res.status(500).json({
                             error : err
                         });
                     }
                 );
                }
             })
         })
module.exports = router;