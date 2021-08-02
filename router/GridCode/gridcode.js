const express = require('express')
const router = express.Router()

const gridcode = require('../../models/GiftCode')
const verifyToken = require('../../middleware/auth')


//Method POST
// Create code
router.post('/grid/create', verifyToken, async(req,res) =>{
    const { name, code, discount } = req.body
    if(!code && !discount)  
        return res.status(400).json({success:false, message:'Missing code or/and discount'})
   try {
        const girdNew = new gridcode({
            name,
            code,
            discount
        }) 
        await girdNew.save()
        res.status(200).json({success:true, message:'Create gridcode success!!!'})
   } catch (error) {
        return res.status(400).json({success:false, message:'Create fail'})
   }
})

//Method PUT
// Edit code
router.put('/grid/edit/:id', verifyToken, async(req,res) =>{
    const { id } = req.params 
    try {
        await gridcode.findByIdAndUpdate({_id:id}, {status:false}, (err)=>{
            if(err){
                res.status(400).json({status:false, message: err})
            }
            else{
                res.status(200).json({status:true, message: `Update success`})
            }
        }) 
    } catch (error) {
        return res.status(400).json({success:false, message:'Create fail'})
    }
})

//Method Delete
//delete grid code
router.delete('/grid/delete/:id', verifyToken, async(req,res)=>{
    const { id } = req.params
    try {
        gridcode.deleteOne({_id: id },(err)=>{
            if(err){
                res.status(400).json({status:false, message: err})
            }
            else{
                res.status(200).json({status:true, message: `Remove success`})
            }
        })
    } catch (error) {
        console.log(err)
    }
})

//Method POST
//GridCode Pagination
router.post('/gridcode', async(req,res)=>{ 
    try {
        const { page, limit } = req.body  
        const pageNum = parseInt(page - 1 ) || 0
        const total = await gridcode.countDocuments({})
        const gridcodes = await gridcode.find({}).limit(parseInt(limit)).skip(limit*pageNum)
        res.status(200).json({currentPage:page, results: gridcodes,totalItem:total, totalPage:Math.ceil(total/limit)})
    } catch (error) {
        console.log(err)
    }

})

module.exports = router