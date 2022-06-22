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
const hostKitchen = require('../models/hostKitchen');

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

//unlinking the data from the server storage by giving the array of it
const unlinkPics = (data) =>{
    for(let i=0;i<data.length;i++)
    {
      unlinkFile(data[i].path,function(err,info){
          if(err) console.error(err)
         })
    }
  }

exports.edit = (req,res,next)=>{
    const uid =req.params.uid;
    const {kitchenName, website , socialHandles, mealTime, desc , kitchenType } = req.body;
    if(kitchenName && website && socialHandles && mealTime && desc && kitchenType)
    {
        hostKitchen.find({hostId : uid}).exec()
        .then(kitchen => {
         if(kitchen.length<1)
         {
           //console.log("Hii");
            const newkitchen = new hostKitchen({
                _id : new mongoose.Types.ObjectId(),
                hostId : uid,
                kitchenName : kitchenName,
                webSite :  website,
                desc : desc,
                socialHandles : socialHandles,
                mealTime : mealTime,
                type : kitchenType
            })

            newkitchen.save()
            .then(result => {
                    res.status(201).json({
                        status: true,
                        message : "Kitchen Details Updated 👨‍🍳",
                        newData : result
                    })}    
                )
            .catch(err => {
                res.status(500).json({
                    status : false,
                    message : "Some Error Caused !",
                    err : err
                })
            })
         }
         else
         {
           // console.log(kitchen);
           hostKitchen.findOneAndUpdate({hostId : uid},{
            $set : {
                kitchenName : kitchenName,
                webSite :  website,
                socialHandles : socialHandles,
                mealTime : mealTime,
                type : kitchenType,
                desc : desc
            }
           }).exec().then(
            result => {
                hostKitchen.findOne({hostId : uid}).exec().then(
                    data => {
                        res.status(200).json({
                            status: true,
                            message : "Kitchen Details are Updated 👨‍🍳!",
                            data : data
                        })
                    })
                    .catch(err => {
                        res.status(500).json({
                            status : false,
                            message : "Some Internal Error Caused",
                            err : err
                        })
                    })
            }).catch(err=>{
                res.status(500).json({
                    status : false,
                    message : "Some Internal Error Caused",
                    err : err
                })
            })
           }
     })
     .catch(err=>
         {
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
            message : "Not Given the Complete Data"
        })
    }
   
}

exports.uploadPics = async(req,res,next)=>{
    const uid =req.params.uid;
    
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
               //Logic For Saving Data to DB
               //console.log(picsInfo);
               hostKitchen.find({hostId : uid}).exec()
               .then(kitchen => {
                //console.log(kitchen);
                if(kitchen<1)
                {
                    const newkitchen = new hostKitchen({
                        _id : new mongoose.Types.ObjectId(),
                        hostId : uid,
                        picsInfo : picsInfo
                    })
                    newkitchen.save()
                        .then(result => {

                            unlinkPics(req.files);

                        hostKitchen.find(({hostId : uid})).exec().then(
                   newData => {
                    res.status(201).json({
                        status: true,
                        message : "Kitchen Details Updated 👨‍🍳",
                        newData : newData
                    })
                   }).catch(err => {
                    res.status(500).json({
                        status : false,
                        message : "Some Internal Error Caused",
                        err : err
                    })
                   })}).catch(err=>{
                    res.status(500).json({
                        status : false,
                        message : "Some Internal Error Caused",
                        err : err
                    })
                   })

                }
                else
                {
                    //console.log(picsInfo);
                    hostKitchen.findOneAndUpdate({hostId : uid},{
                        $set : {
                            picsInfo : picsInfo
                        }
                       }).exec().then(
                        result => {

                            unlinkPics(req.files);

                            //console.log(picsInfo);
                            hostKitchen.findOne({hostId : uid}).exec().then(
                                data => {
                                    res.status(200).json({
                                        status: true,
                                        message : "Kitchen Details are Updated 👨‍🍳!",
                                        data : data
                                    })
                                })
                                .catch(err => {
                                    res.status(500).json({
                                        status : false,
                                        message : "Some Internal Error Caused 212",
                                        err : err
                                    })
                                })
                        }).catch(err=>{
                            res.status(500).json({
                                status : false,
                                message : "Some Internal Error Caused 220",
                                err : err
                            })
                        }) 
                
                 }
                }).catch(err=>{
                    res.status(500).json({
                        status : false,
                        message : "Some Internal Error Caused 218",
                        err : err
                    })
                })
            }}).catch(err=>{
                res.status(500).json({
                    status : false,
                    message : "Some Internal Error Caused 225",
                    err : err
                })
            })
    }
}
    else
    {
        res.status(400).json({
            status : false,
            message : "Not Given the Complete Data 235"
        })
    }
}

exports.getDetail = (req,res,next) => {
    const uid = req.params.uid;

    hostKitchen.find(({hostId : uid})).exec().then(
        newData => {
         if(newData.length)
          {
           return res.status(201).json({
             status: true,
             message : "Found the Kitchen Details 👨‍🍳",
             newData : newData
         })
        }
        else
        {
           return res.status(404).json({
                status : false,
                message : "User Not Designed the Kitchen Till Date!"
            })
        }
        }    
     )
 .catch(err => {
     res.status(500).json({
         status : false,
         message : "Some Error Caused 289!",
         err : err
     })
 })

}