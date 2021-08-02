const mongoose = require('mongoose')
const schema = mongoose.Schema
const gridcode = new schema({
    name:{
        type: String,
        required: true
    },
    code:{
        type:String,
        required: true
    },
    status:{
        type: Boolean,
        default: true
    },
    discount:{
        type:Number,
        required:true
    }
},{ timestamps: true })

module.exports = mongoose.model('girdcode', gridcode)