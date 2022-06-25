const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path')

//Now importing these so that we can able to delete the unnecssary data from the server
const util = require('util');
const unlinkFile = util.promisify(fs.unlinkSync);

//Importing the S3 functions
const { uploadFile } = require('../functions/s3');

//Importing the Model of the User
const User = require('../models/host');
const menueCard = require('../models/menueCard');

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

const unlinkPics = (data) =>{
    for(let i=0;i<data.length;i++)
    {
      unlinkFile(data[i].path,function(err,info){
          if(err) console.error(err)
         })
    }
  }

exports.addCousineDetails = (req,res,next) => {
    const uid =req.params.uid;
    const {cousineName, ingradients , state , desc, price, priceDesc, belongsTo, type} = req.body;
    if(cousineName && ingradients && state && desc && price && priceDesc && belongsTo && type)
    {
           const newCousine= new menueCard({
                        _id : new mongoose.Types.ObjectId(),
                        hostId : uid,
                        cousineName : cousineName,
                        ingradients : ingradients,
                        state : state,
                        desc : desc,
                        price : price,
                        priceDesc : priceDesc,
                        belongsTo : belongsTo,
                        type : type
                       })
                
                       newCousine.save()
                       .then(result => {
                        res.status(201).json({
                            status: true,
                            message : "New Cousine Added 🍕",
                            newData : result
                        })
                       }).catch(err => {
                        res.status(500).json({
                            status : false,
                            message : "Some Error Caused !",
                            err : err
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

exports.addCousinePics = async(req,res,next) => {
    const cid = req.params.cid;
    if(req.files)
    {   
        const pics = req.files;
        const picsInfo = new Array();

        for(let i=0;i<pics.length;i++)
        {
          uploadToS3(pics[i]).then(data=>{
             picsInfo.push({"fileKey" :  data.key,"fileLocation" : data.Location,"bucketName" : data.Bucket })
             if(i+1==pics.length) 
             {
                    menueCard.findOneAndUpdate({_id : cid},{
                        $set : {
                            picsInfo : picsInfo
                        }
                       }).exec().then(result => {
                        
                        unlinkPics(req.files);
                        
                        menueCard.findById(cid).exec().then(
                            result => {

                        res.status(200).json({
                            status: true,
                            message : "Dish Pics are Uloaded 🍕!",
                            data : result
                        })
                    }
                        ).catch(err => {
                            res.status(500).json({
                                status : false,
                                message : "Some Internal Error Caused 212",
                                err : err
                            })
                        })


                       }).catch(err => {
                        res.status(500).json({
                            status : false,
                            message : "Some Internal Error Caused 212",
                            err : err
                        })
                       })
            }
            })
        }
    }
}

exports.editCousineDetails = (req,res,next) => {
    const cid=req.params.cid;
    const {cousineName, ingradients , state , desc, price, priceDesc, belongsTo, type} = req.body;
    if(cousineName && ingradients && state && desc && price && priceDesc && belongsTo && type)
    {
        
        menueCard.findByIdAndUpdate(cid,{
            $set : {
                cousineName : cousineName,
                ingradients : ingradients,
                state : state,
                desc : desc,
                price : price,
                priceDesc : priceDesc,
                belongsTo : belongsTo,
                type : type
            }
        }).exec()
        .then(result => {
            menueCard.findById(cid).exec()
            .then(result => {
                res.status(201).json({
                    status : true,
                    message : "Updated the Dish Details !",
                    data : result
                })
            })
        })
        .catch(err => {
            res.status(500).json({
                status : false,
                message : "Some Internal Error Caused",
                err : err
            })
        })
    }
    else
    {
        res.status(400).json({
            status : false,
            message : "Not Given Complete Data",
        })
    }
}

exports.deleteCousine = (req,res,next) => {
   const cid = req.params.cid;
   menueCard.findByIdAndRemove(cid).exec()
   .then(result => {
    res.status(200).json({
        status : true,
        message : "Delete the Dish from Menue Card!",
        data : result
    })
   })
   .catch(err => {
    res.status(500).json({
        status : false,
        message : "Some Error Caused",
        err : err
    })
   })
}

exports.getMenueCard = (req,res,next) => {
    const uid = req.params.uid;
    
    menueCard.find({hostId:uid}).exec()
    .then(hostMenueCard => {
        //console.log(hostMenueCard);
        if(hostMenueCard.length>0)
       {
        res.status(200).json({
            status : true,
            message : "We Found the MenueCard for the given User!",
            data : hostMenueCard
        })
       }
       else
       {
        res.status(400).json({
            status : true,
            message : "Not Able to Find the Menue !"
        })
       }
    })
    .catch(err=>{
        res.status(500).json({
                    status : false,
                    message : "Some Error Caused",
                    err : err
                })
    })
  
}

exports.getCousineDetail = (req,res,next) => {
    const cid = req.params.cid;
    menueCard.findById(cid).exec()
    .then(cousine=>{
        res.status(200).json({
            status : true,
            message : "We Found the MenueCard for the given User!",
            data : cousine
        })
    })
    .catch(err => {
        res.status(500).json({
            status : false,
            message : "Some Error Caused",
            err : err
        })
    })
}