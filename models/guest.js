const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    firstName : {
        //Shashwat 
        type :  String, 
        required: true,
        match : /(^[A-Z][a-z][A-Za-z]*$)/
    },
    lastName : { 
        //Singh
        type : String, 
        required : true,
        match : /(^[A-Z][a-z][A-Za-z]*$)/
    },
    gender : { 
        type : String, 
        required :  true
    },
    dob : {
         //Must be in dd/mm/yyyy
         type : String, 
         required : true,
         match : /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/
   
    },
    socialHandles : { 
        type : Map, 
        of: String, 
        required: false
    },
    hobbies : {
        type: [],
        of: String,
        required: false
    },
    phoneNum : { 
        //Must Be Perfectly Tendigit only
        type : Number , 
        required : true,
        unique: true,
        match : /(\+\d{1,3}\s?)?((\(\d{3}\)\s?)|(\d{3})(\s|-?))(\d{3}(\s|-?))(\d{4})(\s?(([E|e]xt[:|.|]?)|x|X)(\s?\d+))?/g
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
        unique : true,
        match : /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    },
    pass : { 
        type :  String, 
        required : true
    },
    emailToken : {
        type:String
    },
    isVerified:{
        type: Boolean
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('GuestUser',userSchema);