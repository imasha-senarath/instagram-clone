const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = 5000
const {MONGOURI} = require('./keys')

mongoose.connect(MONGOURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on('connected',()=>{
    console.log("Connected to the database")
})
mongoose.connection.on('error',(err)=>{
    console.log(err);
})

app.listen(PORT,()=>{
    console.log("Server is running on ",PORT)
})