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

router.put('/update/:userId', checkToken ,upload.single('profileImage'), userController.updateInfo);

//Lets Make an Get Request to get the image
router.get('/image/:key',checkToken,userController.viewProfilePic);
    

//LogIN
router.post('/login',isVerified,userController.login);

//Get the UserDetail
router.get('/:uid',checkToken,userController.getUserDetail);

//Mail Verification
router.get('/verify-mail',userController.mailVerify);

module.exports = router;