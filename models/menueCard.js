const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hostMenueCard = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    
    hostId: {
        type: Schema.Types.ObjectId,
        ref: 'HostUser',
        required: true
    },

    cousineName : {
        type :  String, 
        required: true
    },

    ingradients : {
        type : Array,
        of : String,
        required : true
    },

    state : {
        //In which state this dish belongs to
        type : String,
        required : true
    },

    desc : { 
        type : String,
        required: true
    },

    price : {
        type : Number, 
        required: true
    },

    priceDesc : {
        type : Map,
        of : String,
        required : true
    },

    picsInfo : { 
        type : Array, 
        of : Map, 
        required: false
    },

    belongsTo : {
        //local or Non Local
        type : String,
        required : true
    },

    type : {
        //veg or non veg
        type : String,
        required : true
    },

    createdAt:{
        type: Date,
        default: Date.now()
    },
});

module.exports = mongoose.model('hostMenueCard',hostMenueCard);