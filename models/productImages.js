const mongoose = require('mongoose');
const schema = mongoose.Schema

const productImages = new schema({
    productId: {
        type:String,
        required: true
    },
    files: [Object]
})

module.exports = mongoose.model('productImagesList', productImages)