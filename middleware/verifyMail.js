const User = require('../models/host')

module.exports = async(req,res,next)=>{
    try{
        const user = await User.findOne({ userName : req.body.userName })
        if(user.isVerified)
        {
            next()
        }
        // else if(!user)
        // {
        //     res.status(400).json({
        //         status: false,
        //         message: "Please Check Email or Password!"
        //     })
        // }
        else
        {
            res.status(400).json({
                status: false,
                message: "First Verify Your Mail😡"
            })
        }
    }
    catch(err)
    {
        res.status(400).json({
            status: false,
            message: "Please Check Email or Password!"
        })
        // res.status(500).json({
        //     status: false,
        //     message: "Some Internal Error Caused!"
        // })
    }
}