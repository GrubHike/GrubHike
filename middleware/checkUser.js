const User = require('../models/guest')

const checkUser = async(req,res,next)=>{
    try{
        const user = await User.findOne({ _id : req.params.userId })
        if(user)
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
                message: "Please Check Email or Password!"
            })
        }
    }
    catch(err)
    {
        res.status(400).json({
            status: false,
            message: "Please Check Email or Password!",
            error: err
        })
        // res.status(500).json({
        //     status: false,
        //     message: "Some Internal Error Caused!"
        // })
    }
}

module.exports = checkUser