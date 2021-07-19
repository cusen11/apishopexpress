const { json } = require('express');
const express = require('express');
const router = express.Router()
const veryToken = require('../../middleware/auth')
const blog = require('../../models/Blogs')

//Method GET
// GET all blog
router.get('/blog/all', veryToken, async(req,res)=>{
     try {
        const blogs = await blog.find({ blog: blog._id })
        res.status(200).json({data: blogs }) 
     } catch (error) {
         console.log(error)
     }
})


//Method POST
// Create new blog
router.post('/blog/add',veryToken, async (req,res)=>{
    const { title, description,content,category,thumbnail } = req.body
    if(!title)
        return res.status(400).json({success:false,message:'missing title'})
    try {
        const newBlog = new blog({
            title, 
            description,
            content,
            category,
            thumbnail,
            createBy:req.userId
        })
    await newBlog.save()
    res.status(200).json({status:true, message:'Add new post success !!!', data: req.body})
    } catch (error) {
        console.log(error)
    } 
 })


 //Method POST
// Edit Blog
router.put('/blog/edit/:id',veryToken, async (req,res)=>{
    const { id } = req.params
    const { title, description,content,category,thumbnail } = req.body
    const updateBlog = {
        title, 
        description,
        content,
        category,
        thumbnail,
    }
    try {
        await blog.findByIdAndUpdate({_id:id},updateBlog, (err)=>{
            if(err){
                res.status(400).json({status:false, message: err})
            }
            else{
                res.status(200).json({status:true, message: `Update success`})
            }
         }   
        ) 
    } catch (error) {
        res.status(400).json({status:false, message: err})
    }
 })

 //Method POST
 //Delete Blog
 router.delete('/blog/remove/:id', veryToken, async(req,res) =>{
    const { id } = req.params
    try {
        blog.deleteOne({_id: id },(err)=>{
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
//Search Blog
router.post('/search-blog', (req,res)=>{   
    try {
        const { query } = req.body  
        blog.find({ title: { $regex: query}}).
        then(data=> res.send({results: data}))
    } catch (error) {
         console.log(error)
    }

})

//Method POST
//Pagination Blog
router.post('/blogs', async(req,res)=>{ 
    try {
        const { page, limit } = req.body  
        const pageNum = parseInt(page - 1 ) || 0
        const total = await blog.countDocuments({})
        const blogs = await blog.find({}).limit(parseInt(limit)).skip(limit*pageNum)
        res.status(200).json({currentPage:page, results: blogs,totalItem:total, totalPage:Math.ceil(total/limit)})
    } catch (error) {
        
    }

})
module.exports = router;