const menueCard = require('../../models/menueCard')

const checkUser = async(req,res,next)=>{
    try{
        const dish = await menueCard.findById(req.params.cid);
        //console.log(dish.picsInfo);
        //console.log("this => ",user.profilePicInfo.get('fileKey'));
        //console.log(kitchenData.picsInfo[0]);
        let flag=0;
        for(let i=0;i<dish.picsInfo.length;i++)
        {
         if(dish.picsInfo[i].get('fileKey') === req.params.key)
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
            message: "Please Check CousineID!",
            error: err
        })
    }
}

module.exports = checkUser