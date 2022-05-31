const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    firstName : { type :  String, required: true},
    lastName : { type : String, required : true},
    gender : { type : String, required :  true},
    age : {type : Number, required : true},
    socialHandles : { type : Map, of: String, required: true},
    hobbies : [String],
    phoneNum : { type : Number , required : true},
    address : {type : Map ,of : String, required : true},
    desc : { type : String, required : true},
    profilePicInfo : { type : Map, of : String, required: true},
    email : { type : String, required : true},
    pass : { type :  String , required : true}
});

module.exports = mongoose.model('User',userSchema);