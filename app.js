require('dotenv').config({path : './.env'})

const express = require('express')
const app = express()
//For Parssing the body
const bodyParser =require('body-parser');
//for log management we need this lib
const morgan=require('morgan');
const mongoose=require('mongoose');
const port = process.env.PORT || 8000;

//Routes
const userRoutes = require('./routes/user');
const kitchenRoutes = require('./routes/kitchen');
const menueCard = require('./routes/menueCard');

//Makking Data Base Connection Also
mongoose.connect(process.env.MONGO_URL).
then(result=>{
    console.log("Connected With DataBase!💾");
}).catch(err=>{
    console.log(err,"Not Able To Connect!🛑");
})


app.use(morgan('dev'));

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//Resolving Cors Error 
app.use((req,res,next)=>{
    //Here, we set the Header Mannually
    res.header("Access-Control-Allow-Origin", "*"); //Here, We can specify the Specific endpoint
   res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
})

app.get('/',(req,res,next)=>{
    res.status(200).json({
        message : "Server Started Working!"
    })});

app.use('/host',userRoutes);

app.use('/kitchen',kitchenRoutes);

app.use('/menueCard',menueCard);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

//module.exports = app;
app.listen(port,()=>{
    console.log("Server Started 👂 At "+port);
})