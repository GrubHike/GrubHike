const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');

//Importing Controllers
const kitchenController = require('../controller/kitchen');
const utils = require('../controller/utils')

//Middleware for is that user is verified by the mail or not
const kitchenPicExist = require('../middleware/kitchenPics');

//Importing the middleware for the token authentication
const checkToken = require('../middleware/checkAuth');

//Middleware fir userCheck
const checkUser = require('../middleware/checkUser');

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

router.put('/edit/:uid',checkToken,checkUser,kitchenController.edit);

router.put('/pic/:uid',checkToken,checkUser,upload.array('kitchenPic',3),kitchenController.uploadPics);

router.get('/pic/:uid/:key',checkToken,kitchenPicExist,utils.viewPics);

router.get('/:uid',checkToken,checkUser,kitchenController.getDetail);

module.exports = router;