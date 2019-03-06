const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')
const db = "mongodb://localhost:27017/dbEvents"

mongoose.connect(db, { useNewUrlParser: true}, err => {
  if(err) {
    console.error('Error' + err);
  } else {
    console.log('Connected to MongoDB')
  }
})
router.get('/', (req,res) => {
  res.send('API router');
})

module.exports = router

