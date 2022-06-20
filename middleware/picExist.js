const User = require('../models/host')

const checkUser = async(req,res,next)=>{
    try{
        const user = await User.findOne({ _id : req.params.uid });
        //console.log("this => ",user.profilePicInfo.get('fileKey'));

        if(user.profilePicInfo.get('fileKey')===req.params.key)
        {
            next()
        }
        else
        {
            res.status(400).json({
                status: false,
                message: "File Not Found!"
            })
        }
    }
    catch(err)
    {
        res.status(400).json({
            status: false,
            message: "Please Check UserID!",
            error: err
        })
    }
}

module.exports = checkUser