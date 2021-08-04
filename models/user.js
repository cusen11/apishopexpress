const mongoose = require('mongoose')
const schema = mongoose.Schema;

const userSechma = new schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    password2:{
        type: String,
        required: true
    },
    level:{
        type: String,
        enum: [1,2,3],
        default: 3
    },
    fistname:{
        type:String
    },
    lastname:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
    },
    address:{
        type:String
    },
    createAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('users', userSechma)