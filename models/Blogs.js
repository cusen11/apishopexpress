const mongoose = require('mongoose')
const schema = mongoose.Schema

const blogs = new schema({
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
    },
    content:{
        type:String,
        required:true
    },
    category:{
        type:String,
        enum: ['Làm đẹp','Thời trang','Model', 'Khác'],
        default:'Khác'
    },
    thumbnail:{
        type:String
    },
    createBy:{
        type: schema.Types.ObjectId,
        ref:"users"
    },
    createAt:{
        type:Date,
        default:Date.now()
    }
})

module.exports = mongoose.model('blog', blogs)