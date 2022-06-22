const kitchen = require('../models/hostKitchen')

const checkUser = async(req,res,next)=>{
    try{
        const kitchenData = await kitchen.findOne({ hostId : req.params.uid });
        //console.log("this => ",user.profilePicInfo.get('fileKey'));
        //console.log(kitchenData.picsInfo[0]);
        let flag=0;
        for(let i=0;i<kitchenData.picsInfo.length;i++)
        {
         if(kitchenData.picsInfo[i].get('fileKey')===req.params.key)
         {
            flag=1;
            break;
         }
        }
        if(flag)
        {
            next()
        }
        else{
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