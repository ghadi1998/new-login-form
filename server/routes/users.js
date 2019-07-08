//express requirement
const express = require('express')
//setting a users variable to be used as a router instead of app post , get ..
const users = express.Router()
//cross oigin resource sharing 
const cors = require('cors')
//jwt for user login authentication
const jwt = require('jsonwebtoken')
//bcrypt for password encryption and decryption
const bcrypt = require('bcrypt')
//using te user model
const User = require('../model/user')
//setting users as cros origin functionalities
users.use(cors())
//privat key or jwt encryption and decryption
process.env.SECRET_KEY = 'q1w2e3r4t5y6u7i8o9p0o9i8u7y6t5r4e3w2q1'

//main signup function , exported
users.post('/signup', (req, res) => {
  //setting a new user object to be manipulated and inserted to db 
  //data taken from react client side 
  const today = new Date()
  const userData = {
    username : req.body.username,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
    created: today
  }

  //a function from sequelize , a wrapper for later on functions
  //searches if the username is found or not 
  User.findOne({
    where: {
      //searching in the whhole db for this user name 
     username: req.body.username
    }
  })
    // encrypting the password using bcrypt encryption function
    //bcrypt uses a hash function to encrypt the user given password
    //will not reach this part if user is duplicated
    .then(user => {
      if (!user) {
        //hashing the password , 10 is a number for permutations 2pwr10 = a certain string built in
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          userData.password = hash
          //creating a user with the given data
          User.create(userData)
          //send the username to the response tab in console
            .then(user => {
              res.json({ status: user.username + '    '+ 'Registered!' })
            })
            //any error will be consoled here
            .catch(err => {
              res.send('error: ' + err)
            })
        })
      } else {
        //will reach if username is found ,  User.findOne 
        res.json({ error: 'User already exists' })
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

//main login functionality
users.post('/login', (req, res) => {
  ///searches for username in db at first
  User.findOne({
    where: {
     username: req.body.username
    }
  })
  //if the user is found , it compared the password with the given password
  //it compared it the encrypted pass in the db
  //and decrypts it to compare
    .then(user => {
      if (user) {
        //if user name is found the deryption starts here
        if (bcrypt.compareSync(req.body.password, user.password)) {
          //each user is given a certain jwt token for authentication
          //jwt.sign , Synchronously sign the given payload into a JSON Web Token string payload
          //secret key provided above
          //token is assigned using the front end whuck sends it with the request
          let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
            expiresIn: 1440
          })
          //send token to local storage of the browser that checks it 
          res.send(token)
        }
      } else {
        //reaches here if user isnt found
        res.status(400).json({ error: 'User does not exist' })
      }
    })
    //catches any error from the above blocks
    .catch(err => {
      res.status(400).json({ error: err })
    })
})

users.get('/profile', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

  User.findOne({
    where: {
      id: decoded.id
    }
  })
    .then(user => {
      if (user) {
        res.json(user)
      } else {
        res.send('User does not exist')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

module.exports = users