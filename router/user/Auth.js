
const express = require('express')
const user = require('../../models/user')
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')

const router = express.Router()  

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

        res.send({success:true, message:"Create user success!!!", accessToken}) 
    } catch (error) {
        console.log(error)
    }
}) 

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
        
        res.send({success: true, message: "Login success!!!", accessToken})
    } catch (error) {
        console.log(error)
    }
})




module.exports = router