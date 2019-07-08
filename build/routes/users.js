'use strict';

var express = require('express');
var users = express.Router();
var cors = require('cors');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

var User = require('../model/User');
users.use(cors());

process.env.SECRET_KEY = 'secret';

users.post('/signup', function (req, res) {
  var today = new Date();
  var userData = {
    username: req.body.username,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
    created: today
  };

  User.findOne({
    where: {
      username: req.body.username
    }
  })
  //TODO bcrypt
  .then(function (user) {
    if (!user) {
      bcrypt.hash(req.body.password, 10, function (err, hash) {
        userData.password = hash;
        User.create(userData).then(function (user) {
          res.json({ status: user.username + 'Registered!' });
        }).catch(function (err) {
          res.send('error: ' + err);
        });
      });
    } else {
      res.json({ error: 'User already exists' });
    }
  }).catch(function (err) {
    res.send('error: ' + err);
  });
});

users.post('/login', function (req, res) {
  User.findOne({
    where: {
      username: req.body.username
    }
  }).then(function (user) {
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        var token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
          expiresIn: 1440
        });
        res.send(token);
      }
    } else {
      res.status(400).json({ error: 'User does not exist' });
    }
  }).catch(function (err) {
    res.status(400).json({ error: err });
  });
});

users.get('/profile', function (req, res) {
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);

  User.findOne({
    where: {
      id: decoded.id
    }
  }).then(function (user) {
    if (user) {
      res.json(user);
    } else {
      res.send('User does not exist');
    }
  }).catch(function (err) {
    res.send('error: ' + err);
  });
});

module.exports = users;
//# sourceMappingURL=users.js.map