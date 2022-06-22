const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');

//Importing Controllers
const menueCardController = require('../controller/menueCard');
const utils = require('../controller/utils')

//Importing the middleware for the token authentication
const checkToken = require('../middleware/checkAuth');

//Middleware fir userCheck
const checkUser = require('../middleware/checkUser');

//Middleware for dishCheck in MenueCard Present Or Not
const checkDish = require('../middleware/menueCard/isDishPresent');

//Middleware for checking that dish pic is available or not
const checkDishPic = require('../middleware/menueCard/dishPicExist');

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

router.post('/add/:uid',checkToken,checkUser,menueCardController.addCousineDetails);

//cid --> Cousine ID
router.post('/add/cousinePics/:uid/:cid',checkToken,checkDish,upload.array('cousinePics',4),menueCardController.addCousinePics);

router.put('/edit/cousineDetails/:uid/:cid',checkToken,checkDish,menueCardController.editCousineDetails);

router.delete('/delete/cousine/:uid/:cid',checkToken,checkDish,menueCardController.deleteCousine);

router.get('/pic/:cid/:key',checkToken,checkDishPic,utils.viewPics);

router.get('/get/:uid',checkToken,checkUser,menueCardController.getMenueCard);

router.get('/get/cousine/:uid/:cid',checkToken,checkDish,menueCardController.getCousineDetail);

module.exports = router;