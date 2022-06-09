const User = require('../models/user')

module.exports = async(req,res,next)=>{
    try{
        const user = await User.findOne({ email : req.body.email })
        if(user.isVerified)
        {
            next()
        }
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
        res.status(500).json({
            status: false,
            message: "Some Intername Error"
        })
    }
}