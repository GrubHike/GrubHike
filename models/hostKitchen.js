const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hostKitchenSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    
    hostId: {
        type: Schema.Types.ObjectId,
        ref: 'HostUser',
        required: true
    },

    kitchenName : {
        type :  String, 
        required: false
    },

    webSite : {
        type : String,
        required : false
    },

    socialHandles : { 
        type : Map, 
        of: String, 
        required: false
    },

    mealTime : {
        type : Map, 
        of: String, 
        required: false
    },

    picsInfo : { 
        type : Array, 
        of : Map, 
        required: false
    },

    desc : { 
        type : String, 
        required : false
    },
    
    type : {
        //Vegiterian or Non-Vegiterian
        type : String, 
        required : false
    },

    createdAt:{
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('HostKitchen',hostKitchenSchema);