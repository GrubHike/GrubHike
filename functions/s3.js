require('dotenv').config({path : './.env.aws'})
const s3 = require('aws-sdk/clients/s3')
const fs = require('fs') //So, that I can able to get the Current path of file in server


const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId=process.env.AWS_ACCESS_KEY;
const secretAccessKey=process.env.AWS_SECRET_KEY;

const S3 = new s3({
    region,
    accessKeyId,
    secretAccessKey
})

//--> Uploading the File
function uploadFile(file){
    console.log(file.path);
    const fileStream = fs.createReadStream(file.path);
    
    const uploadParams = {
        Bucket : bucketName,
        Body : fileStream,
        Key : file.filename
    }

//    return S3.upload(uploadParams,function(err,data){if(err) console.log(err)
//        if(data) console.log("done");
//     })

     return S3.upload(uploadParams).promise();
}

exports.uploadFile = uploadFile

//Lets Try to get the Image from the S3 bucket
const getFileStream = (fileKey) => 
{
    const downloadParams = {
        Key : fileKey,
        Bucket: bucketName
    }

    return S3.getObject(downloadParams).createReadStream()
}

exports.getFileStream = getFileStream;