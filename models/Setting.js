const mongoose = require('mongoose')
const schema = mongoose.Schema

const Settings = new schema({
    info:{
        logo:{
            type:String,
            required: true,
        },
        companyName:{
            type:String,
            required:true
        },
        slogan:{
            type:String
        }
    }, 
    social:{
            facebook:{
                type:String
            },
            zalo:{
                type:String
            },
            skype:{
                type:String
            },
            viber:{
                type:String
            },
            instargram:{
                type:String
            }
    },
    contact:{
        mail:{
            type:String
        },
        address: {
            type:String,
            required:true
        },
        phone:{
            type:String
        }
        ,
        map:{
            type:String
        }
    }
})

module.exports = mongoose.model('Setting', Settings)