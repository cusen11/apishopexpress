const express = require('express')
const images = require('../../models/productImages')
const router = express.Router()


router.get('/images/:id', async (req,res)=>{
    const { id } = req.params  
    const data = await images.find({productId: id}) 
    res.send({success: true, message:"Vào đố thánh công", data})
})


module.exports = router