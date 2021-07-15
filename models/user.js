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
    level:{
        type: String,
        enum: [1,2,3],
        default: 3
    },
    createAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('users', userSechma)