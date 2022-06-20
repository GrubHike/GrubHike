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
        required: true
    },

    ingradients : {
        type : Array,
        of : String,
        required : true
    },

    state : {
        type : String,
        required : true
    },

    desc : { 
        type : String,
        required: true
    },

    price : {
        type : String, 
        required: true
    },

    picsInfo : { 
        type : Array, 
        of : Map, 
        required: true
    },

    blongsTo : {
        type : String,
        required : true
    },

    createdAt:{
        type: Date,
        default: Date.now()
    },

    type : {
        //veg or non veg
        type : String,
        required : false
    }
});

module.exports = mongoose.model('hostMenueCard',hostMenueCard);