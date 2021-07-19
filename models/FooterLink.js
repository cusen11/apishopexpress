const mongoose = require('mongoose')
const schema = mongoose.Schema

const FooterLinks = new schema({
    text:{
        type: String,
        required: true
    },
    link:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('FooterLink', FooterLinks)