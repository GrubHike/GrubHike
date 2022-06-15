const User = require('../models/host')

const checkUser = async(req,res,next)=>{
    try{
        const user = await User.findOne({ _id : req.params.uid })
        if(user)
        {
            next()
        }
        else
        {
            res.status(400).json({
                status: false,
                message: "User Not Present!"
            })
        }
    }
    catch(err)
    {
        res.status(400).json({
            status: false,
            message: "Some Error Caused!",
            error: err
        })
        // res.status(500).json({
        //     status: false,
        //     message: "Some Internal Error Caused!"
        // })
    }
}

module.exports = checkUser