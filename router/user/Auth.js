
const express = require('express')
const user = require('../../models/user')
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const verifyToken = require('../../middleware/auth')

const router = express.Router()  


//Method POST
// đăng ký mới user
router.post('/registration', async(req,res)=>{ 
    const { username, password, level } = req.body 
    //check null 
    if(!username || !password)
        return res.status(400).json({success: false, message:"Missing name or/and password"})
    try {
        const userExist = await user.findOne({username: username})
        if(userExist){
            res.send({success: false, message:"User is already exsit!!!"})
        }

        const passwordHash = await argon2.hash(password)
        const newUser = new user({
            username: username,
            password: passwordHash,
            level: level

        })
        await newUser.save()

        // sign token
        const accessToken = jwt.sign({userId: newUser._id}, process.env.ACCESS_TOKEN_SECRET)

        res.status(200).json({success:true, message:"Create user success!!!", accessToken}) 
    } catch (error) {
        console.log(error)
    }
}) 
//Method POST
//Login
router.post('/login',async (req,res)=> {
    const {username, password} = req.body  

    if( !username || !password)
        return res.status(400).json({success: false, message: 'Missing username or password!!!'})
    try {
        const userlogin = await user.findOne({username: username})  
        if(!userlogin)
            return res.status(400).json({success: false , message: 'Username or password is not correct'})
        const passwordValid = await argon2.verify(userlogin.password, password)
        if(!passwordValid)
            return res.status(400).json({success: false , message: 'Username or password is not correct'})
        
        //sign
        const accessToken = await jwt.sign({userId: userlogin._id}, process.env.ACCESS_TOKEN_SECRET)
        
        res.status(200).json({success: true, message: "Login success!!!", accessToken})
    } catch (error) {
        console.log(error)
    }
})

//Method DELETE
//Xóa user
router.delete('/users/remove/:id', verifyToken, async (req,res)=>{
    const { id } = req.params
    const checkAdmin = await user.findOne({_id:id})
    if(checkAdmin.level === 1){
        res.status(401).json({success: false, message: "You don't have permission"})
    }
    else{ 
        await user.findByIdAndRemove({_id: id}, (err)=>{
            if(err){
                res.status(400).json({success:false, err})
            }
            else{
                res.status(200).json({success:true, message:'Delete user success!!!'})
            }
        })
    }
    
})

//Method POST
//GridCode Pagination
router.post('/listusers', async(req,res)=>{ 
    try {
        const { page, limit } = req.body  
        const pageNum = parseInt(page - 1 ) || 0
        const total = await user.countDocuments({})
        const users = await user.find({}).limit(parseInt(limit)).skip(limit*pageNum)
        res.status(200).json({currentPage:page, results: users,totalItem:total, totalPage:Math.ceil(total/limit)})
    } catch (error) {
        console.log(err)
    }

})
module.exports = router