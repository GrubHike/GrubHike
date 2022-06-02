const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    firstName : { 
        type :  String, 
        required: true
    },
    lastName : { 
        type : String, 
        required : true
    },
    gender : { 
        type : String, 
        required :  true
    },
    dob : {
        type : String, 
        required : true
    },
    socialHandles : { 
        type : Map, 
        of: String, 
        required: false
    },
    hobbies : [String],
    phoneNum : { 
        type : Number , 
        required : true,
        unique: true,
    },
    address : {
        type : Map ,
        of : String, 
        required : false
    },
    desc : { 
        type : String, 
        required : false
    },
    profilePicInfo : { 
        type : Map, 
        of : String, 
        required: false
    },
    email : { 
        type : String, 
        required : true,
        unique : true
    },
    pass : { 
        type :  String, 
        required : true
    },
});

module.exports = mongoose.model('GuestUser',userSchema);