const mongoose = require('mongoose')
const schema = mongoose.Schema

const products = new schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    description:{
        type:String,
        required: true
    },
    price:{
        type:String,
        default: 'Liên hệ'
    },
    images:{ 
        idImage:{
            type: String,
        },
        url:{
            type:String
        } 
    },
    category:{
        type:String,
        default:'Chưa có danh mục'
    },
    size:{
        type:String,
        enum:["S", "M", "L", "XS"]
    },
    color:{
        type:Array,
    },
    createBy:{
        type: schema.Types.ObjectId,
        // ref để nối qua model users
        ref:"users"
    } ,
    createAt:{
        type:Date,
        default:Date.now()
    } 
})


module.exports = mongoose.model('product', products)