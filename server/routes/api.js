const express = require('express')
const jwt = require('jwt')
const router = express.Router()
const User = require('../models/user')

const mongoose = require('mongoose')
const db = "mongodb://localhost:27017/dbEvents"

mongoose.connect(db, { useNewUrlParser: true}, err => {
  if(err) {
    console.error('Error' + err)
  } else {
    console.log('Connected to MongoDB')
  }
})

function verifyToken(req, res, next) {
   if(!req.headers.authorization) {
     return res.status(401).send('Unauthorized request')
   }

   let token = req.headers.authorization.split('')[1];

   if (token === 'null') {
     return res.status(401).send('Unauthorized request')
   }

   let payload = jwt.verify(token, 'secretKey')


   if(!payload) {
    return res.status(401).send('Unauthorized request')
   }

   req.userId = payload.subject
   next()
}

router.get('/', (req,res) => {
  res.send('API router');
})

router.post('/register', (req,res) => {
  let userData = req.body
  let user = new User(userData) 
  user.save((err, registeredUser) => {
    if(err) {
      console.error('Error' + err)
    } else {
      console.log(registeredUser)
      let payload = { subject: registeredUser._id}
      let token = jwt.sign(payload, 'secretKey')
      res.status(200).send({token})
    }
  })
})

router.post('/login', (req, res) => {
  let userData = req.body
  User.findOne({email: userData.email}, (err, user) => {
    if (err) {
      console.log(err)    
    } else {
      if (!user) {
        res.status(401).send('Invalid Email')
      } else 
      if ( user.password !== userData.password) {
        res.status(401).send('Invalid Password')
      } else {
        let payload = {subject: user._id}
        let token = jwt.sign(payload, 'secretKey')
        res.status(200).send({token})
      }
    }
  })
})

router.get('/events', (req, res) => {
  let events = [
    {
      "id": "1",
      "name": "Auto Expo 1",
      "description": "D1",
      "date": "2012-04-23T18:25:43.511Z"
    },{
      "id": "2",
      "name": "Auto Expo 2",
      "description": "D2",
      "date": "2012-04-23T18:25:43.511Z"
    },{
      "id": "3",
      "name": "Auto Expo 3",
      "description": "D3",
      "date": "2012-04-23T18:25:43.511Z"
    },{
      "id": "4",
      "name": "Auto Expo 4",
      "description": "D4",
      "date": "2012-04-23T18:25:43.511Z"
    }
  ]
  res.json(events)
})

router.get('/special', verifyToken, (req, res) => {
  let events = [
    {
      "id": "1",
      "name": "[#SPECIAL]Auto Expo 1",
      "description": "D1",
      "date": "2012-04-23T18:25:43.511Z"
    },{
      "id": "2",
      "name": "[#SPECIAL]Auto Expo 2",
      "description": "D2",
      "date": "2012-04-23T18:25:43.511Z"
    },{
      "id": "3",
      "name": "[#SPECIAL]Auto Expo 3",
      "description": "D3",
      "date": "2012-04-23T18:25:43.511Z"
    },{
      "id": "4",
      "name": "[#SPECIAL]Auto Expo 4",
      "description": "D4",
      "date": "2012-04-23T18:25:43.511Z"
    }
  ]
  res.json(events)
})

module.exports = router

