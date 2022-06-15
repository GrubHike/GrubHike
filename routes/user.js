const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');

//Importing Controllers
const userController = require('../controller/user');

//Env Vars
require('dotenv').config({path : './.env'})

//Middleware for is that user is verified by the mail or not
const isVerified = require('../middleware/verifyMail');

//Importing the middleware for the token authentication
const checkToken = require('../middleware/checkAuth');

//Middleware for userCheck
const checkUser = require('../middleware/checkUser');

//Middleware for Pic Exists in UserDB or not
const picExist = require('../middleware/picExist');

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        //if that dir is not created then this will create that dir first
        fs.mkdir('./uploads/',(err)=>{
            cb(null,'./uploads/');
        })
    },
    filename: function(req,file,cb)
    {
        cb(null,new Date().toISOString().replace(/:/g, '-')+"_"+(Math.random() + 1).toString(36).substring(7)+'_'+file.originalname);
    }
})

const upload = multer({storage : storage});

router.post('/signup', userController.signupController);

router.put('/update/:userId',checkToken,checkUser, userController.updateInfo);

//For Uploading Profile Pic
router.put('/update/pic/:userId',checkToken,checkUser,upload.single('profileImage'), userController.updateProfilePic);

//Lets Make an Get Request to get the image
router.get('/image/:uid/:key',picExist,checkToken,userController.viewProfilePic);
    
//Mail Verification
router.get('/verify-mail',userController.mailVerify);

//LogIN
router.post('/login',isVerified,userController.login);

//Get the UserDetail
router.get('/:uid',checkToken,userController.getUserDetail);

module.exports = router;