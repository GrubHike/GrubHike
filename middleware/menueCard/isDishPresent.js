const menueCard = require('../../models/menueCard')

const checkUser = async(req,res,next)=>{
    try{
        const dish = await menueCard.findById(req.params.cid);
        //console.log(dish.hostId == req.params.uid)
        //dish.hostId.equals(req.params.uid)
        if(dish && dish.hostId.equals(req.params.uid))
        {
            next()
        }
        else
        {
            res.status(400).json({
                status: false,
                message: "Dish is Not Present!"
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