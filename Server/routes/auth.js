const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')
const requireLogin = require('../middleware/requirelogin')

router.get('/',(req,res)=>{
    res.send("hello")
})

router.get('/protected', requireLogin,(req,res)=>{
    res.send("hello user")
})

router.post('/signup',(req,res)=>{
    const {name, email, password} = req.body
    if(!name || !email || !password) {
        return res.status(422).json({Error:"Fields can not be empty"})
    }

    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser) {
            return res.status(422).json({Error:"Email already exist"})
        }
        
        bcrypt.hash(password,12)
        .then(hashedpassword=>{
            const user = new User({email, password:hashedpassword, name})

            user.save()
            .then(user=>{
                res.json({message:"Saved Succesfully"})
            })
            .catch(err=>{
                console.log(err)
            })
        })
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/login',(req,res)=>{
    const{email, password} = req.body
    if(!email || !password) {
        return res.status(422).json({Error:"Fields can not be empty"})
    }

    User.findOne({email:email})
    .then((savedUser)=>{
        if(!savedUser) {
            return res.status(422).json({Error:"User does not exist or wrong login details"})
        }
        bcrypt.compare(password, savedUser.password)
        .then(doMatch=>{
            if(doMatch) {
                //res.json({Message:"Login successful"})
                const token = jwt.sign({_id:savedUser._id}, JWT_SECRET)
                res.json({token})
            } else {
                return res.status(422).json({Error:"User does not exist or wrong login details"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})

module.exports = router