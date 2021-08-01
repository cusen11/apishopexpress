const express = require('express')
const router = express.Router()

const setting = require('../../models/Setting')
const verifyToken = require('../../middleware/auth') 
const {upload} = require('../../helpers/fileHelper'); 



//addnew settings
router.post('/settings',verifyToken,async(req,res)=>{
    const {  
        logo,
        companyname,
        slogan,
        facebook,
        zalo,
        skype,
        viber,
        instargram,
        mail,
        address,
        phone,
        map
     } = req.body 
     const settings = new setting({
        info:{
            logo:logo,
            companyName:companyname,
            slogan:slogan
        }, 
        social:{
                facebook:facebook,
                zalo:zalo,
                skype:skype,
                viber:viber,
                instargram:instargram
        },
        contact:{
            mail:mail,
            address:address ,
            phone:phone,
            map:map
        }
     }) 

     await settings.save()
     res.status(200).json({success:true, message:'Save setting successfully!!!'})
    
})
//update setting
router.put('/updatesettings/:id',verifyToken, async(req,res)=>{
    const {  
        logo,
        companyname,
        slogan,
        facebook,
        zalo,
        skype,
        viber,
        instargram,
        mail,
        address,
        phone,
        map
     } = req.body 
    try {
        let UpdateSetting = {
                info:{
                    logo:logo,
                    companyName:companyname,
                    slogan:slogan
                }, 
                social:{
                        facebook:facebook,
                        zalo:zalo,
                        skype:skype,
                        viber:viber,
                        instargram:instargram
                },
                contact:{
                    mail:mail,
                    address:address ,
                    phone:phone,
                    map:map
            } 
        }
        const updateCondition = {_id: req.params.id, user: req.userId}
        UpdateSetting = await setting.findByIdAndUpdate(updateCondition,UpdateSetting,{new:true})
        if(!UpdateSetting)
        return res.status(401).json({
            susscess: false,
            message: "Setting not found !!!"
        })
        res.json({
            message: "Update succsess !!!",
            skill:UpdateSetting
        }) 
    } catch (error) {
        res.json({susscess: false, message:'Error' + error})
    } 
 
})

//method GET
// Get data Setting

router.get('/setting', verifyToken, async(req, res) => {
    const dataSetting = await setting.find()
    res.status(200).json({results: dataSetting})
})


module.exports = router