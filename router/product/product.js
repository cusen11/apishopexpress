const express = require('express')
const router = express.Router()  
const product = require('../../models/product')
const productImagesList = require('../../models/productImages')
const verifyToken = require('../../middleware/auth')
const {upload} = require('../../helpers/fileHelper'); 

 

//get all product
router.get('/product', async (req,res)=>{
    const listProduct = await product.find({product: product._id})
    res.send(listProduct)
})   
 //add new product
router.post('/product',verifyToken,upload.single("image"), async (req,res)=>{ 
    const {name,description,price,category,size,color} = req.body 

    if(!name && !description)
        return res.status(400).json({success:false, message:'Missing name or/and description'})
    try {
        const productItem = new product({
            name:name,
            description:description,
            price:price,
            images:req.file.filename,
            category:category,
            size:size,
            color:color,
            createBy:req.userId
        })

    await productItem.save()  
    res.status(200).json({success: true, message:"Create product success!!!"})
    
    } catch (error) {
        console.log(error)
    }  
}) 


//edit product
router.put('/product/:id',verifyToken,upload.single("image"), async (req,res)=>{ 
    const {name,description,price,category,size,color} = req.body 

    if(!name && !description)
        return res.status(400).json({success:false, message:'Missing name or/and description'})
    try {
        const productItem = new product({
            name:name,
            description:description,
            price:price,
            images:req.file.filename,
            category:category,
            size:size,
            color:color,
            createBy:req.userId
        })

    await productItem.save()  
    res.status(200).json({success: true, message:"Create product success!!!"})
    
    } catch (error) {
        console.log(error)
    }  
}) 
 
//post list images in product 

router.post('/listImage/:id',verifyToken,upload.array("files"), async (req,res)=>{ 
    const { id } = req.params  
     
    try {
        let filesArray = [];
        req.files.forEach(element => {
            const file = {
                fileName: element.originalname,
                filePath: element.path,
                fileType: element.mimetype,
            }
            filesArray.push(file);
        });
        const images = new productImagesList({
            productId: id,
            files: filesArray
        })

        await images.save()  
        res.status(200).json({success: true, message:"Create product success!!!"})
    
    } catch (error) {
        console.log(error)
    }  
}) 

//Method POST
//Search Products
router.post('/search-products', (req,res)=>{   
    try {
        const { query } = req.body 
        product.find({name: { $regex: query}}).
        then(data=> res.send({results: data}))
    } catch (error) {
         console.log(error)
    } 
})
//Method POST
//Pagination Products
router.post('/products', async(req,res)=>{ 
    try {
        const { page, limit } = req.body  
        const pageNum = parseInt(page - 1 ) || 0
        const total = await product.countDocuments({})
        const products = await product.find({}).limit(parseInt(limit)).skip(limit*pageNum)
        res.status(200).json({currentPage:page, results: products,totalItem:total, totalPage:Math.ceil(total/limit)})
    } catch (error) {
        
    }

})

module.exports = router


