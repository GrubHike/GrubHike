//Predefined Library
const http = require('http');

//Our Custom Files
const app=require('./app')

const port =  process.env.PORT || 3000;

const server=http.createServer(app);

server.listen(port);

console.log("Sever Started 👂 at ",port,"🚀");