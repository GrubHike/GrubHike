const jwt = require('jsonwebtoken');
require('dotenv').config({path : './.env'})

// const checkAuth 

module.exports = (req,res, next) => {
   try{
       //getting the token in header as you know this concept also used with get request
       const token = req.headers.authorization.split(" ")[1];
       //console.log(token);
       const decoded = jwt.verify(token,process.env.JWT_KEY);
       req.userData = decoded;

       next(); //if this token verified perfectly then only
   } catch(error)
   {
       return res.status(401).json({
           message : "Auth Failed (You are Not Autherised) !"
       })
   }
}
// module.exports = checkAuth