const mongoose = require('mongoose')
const schema = mongoose.Schema

const Navications = new schema({
    text:{
        type: String,
        required: true
    },
    link:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Navication', Navications)