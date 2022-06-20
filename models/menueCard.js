const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hostMenueCard = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    
    hostId: {
        type: Schema.Types.ObjectId,
        ref: 'HostUser',
        required: true
    },

    cuisimeName : {
        type :  String, 
        required: false
    },

    ingradients : {
        type : Array,
        of : String,
        required : false
    },

    state : {
        type : String,
        required : false
    },

    desc : { 
        type : String,
        required: false
    },

    price : {
        type : String, 
        required: false
    },

    picsInfo : { 
        type : Array, 
        of : Map, 
        required: false
    },

    createdAt:{
        type: Date,
        default: Date.now()
    },

    type : {
        type : String,
        required : false
    }
});

module.exports = mongoose.model('hostMenueCard',hostMenueCard);