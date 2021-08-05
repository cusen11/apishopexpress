
const express = require('express')
const user = require('../../models/user')
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const verifyToken = require('../../middleware/auth')

const router = express.Router()  


//Method POST
// đăng ký mới user
router.post('/registration', async(req,res)=>{ 
    const { username, password, password2, level,address, fistname, lastname,avatar } = req.body 
    //check null 
    if(!username || !password)
        return res.status(400).json({success: false, message:"Missing name or/and password"})
    try {
        const userExist = await user.findOne({username: username})
        if(userExist){
            res.send({success: false, message:"User is already exsit!!!"})
        }

        const passwordHash = await argon2.hash(password)
        const password2Hash = await argon2.hash(password2)
        const newUser = new user({
            username: username,
            password: passwordHash,
            password2: password2Hash,
            level: level,
            fistname,
            lastname,
            address,
            avatar 
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
// Forgot password

router.post('/forgot', async (req,res)=>{
    const { username, password2, newpassword, repeat } = req.body
    if(!username)
        return res.status(401).json({status:false, message:"Missing user name"})
    if(!password2)
        return res.status(401).json({status:false, message:"Missing password 2"})
    if(!newpassword)
        return res.status(401).json({status:false, message:"Missing New password"})
    if(!repeat)
        return res.status(401).json({status:false, message:"Missing New password repeat"})
    if(newpassword !== repeat)
        return res.status(401).json({status:false, message:"New passwords do not match"})
    
    try {
        const userCheck = await user.findOne({username: username}) 
        if(!userCheck)
            return res.status(400).json({success: false , message: 'Username is not correct'})
        const passwordHash = await argon2.hash(newpassword)
        const updatePassword = {
            password: passwordHash
        }
        const passwordValid = await argon2.verify(userCheck.password2, password2)
         if(!passwordValid)
            return res.status(401).json({success: false , message: 'Password 2 is not correct'})
        await user.findByIdAndUpdate({_id:userCheck._id},updatePassword, (err)=>{
            if(err){
                res.status(400).json({status:false, message: err})
            }
            else{
                res.status(200).json({status:true, message:"Password recovery successful!!!!"})
            }
        })  
    } catch (error) {
        console.log(error)
    }
})

//Method PUT
// edit user
router.put('/edituser/:id',verifyToken, async(req,res)=>{ 
    const { id } = req.params
    const { address, fistname, lastname,avatar } = req.body 
     
    try {   
        const editUser = {    
            fistname,
            lastname,
            address,
            avatar

        }  
        await user.findByIdAndUpdate({_id:id},editUser, (err)=>{
            if(err){
                res.status(400).json({status:false, message: err})
            }
            else{
                res.status(200).json({status:true, message: `Update success`})
            }
        })  
    } catch (error) {
        console.log(error)
    }
}) 
//Method PUT
//Change password

router.put('/changepassword/:id',verifyToken, async (req,res)=>{
    const { password, newpassword, repeat  } = req.body
    const { id } = req.params
    if(!password)
        return res.status(401).json({status:false, message:"Missing Old password"})
    if(!newpassword)
        return res.status(401).json({status:false, message:"Missing New password"})
    if(!repeat)
        return res.status(401).json({status:false, message:"Missing New password repeat"})
    if(newpassword !== repeat)
        return res.status(401).json({status:false, message:"New passwords do not match"})
    try {
        const checkUser = await user.findOne({_id:id})
        
        const passwordValid = await argon2.verify(checkUser.password, password)
        if(!passwordValid)
            return res.status(400).json({status: false, message: "Old passowrd not correct"})
        const passwordHash = await argon2.hash(newpassword)
        const updatePassword = {
            password: passwordHash
        }
        await user.findByIdAndUpdate({_id:id},updatePassword, (err)=>{
            if(err){
                res.status(400).json({status:false, message: err})
            }
            else{
                res.status(200).json({status:true, message:"Change password success!!!"})
            }
        })  
        
    } catch (error) {
        console.log(error)
    }
})
//Method PUT
//Change password2
router.put('/changepassword2/:id',verifyToken, async (req,res)=>{
    const { password2, newpassword, repeat  } = req.body
    const { id } = req.params
    if(!password2)
        return res.status(401).json({status:false, message:"Missing Old password2"})
    if(!newpassword)
        return res.status(401).json({status:false, message:"Missing New password"})
    if(!repeat)
        return res.status(401).json({status:false, message:"Missing New password repeat"})
    if(newpassword !== repeat)
        return res.status(401).json({status:false, message:"New passwords do not match"})
    try {
        const checkUser = await user.findOne({_id:id})
        
        const passwordValid = await argon2.verify(checkUser.password2, password2)
        if(!passwordValid)
            return res.status(400).json({status: false, message: "Old passowrd not correct"})
        const passwordHash = await argon2.hash(newpassword)
        const updatePassword = {
            password2: passwordHash
        }
        await user.findByIdAndUpdate({_id:id},updatePassword, (err)=>{
            if(err){
                res.status(400).json({status:false, message: err})
            }
            else{
                res.status(200).json({status:true, message:"Change password success!!!"})
            }
        })  
        
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