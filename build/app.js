'use strict';

var express = require('express');
var path = require('path');
var cors = require('cors');
var bodyParser = require("body-parser");
var helmet = require('helmet');
var cookieParser = require('cookie-parser');
var CONFIG = require('../config/CONFIG');

var app = express();
app.use(cors());

//headers
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Methods', ['PATCH', 'POST', 'GET', 'DELETE', 'PUT']);
  res.setHeader('Access-Control-Allow-Headers');
  res.setHeader('Access-Control-Expose-Headers');
  next();
});

//body parser for form data
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// secure apps by setting various HTTP headers
app.use(helmet());
// enable CORS - Cross Origin Resource Sharing

app.options('*', cors());

//fetching index from react
app.use(express.static('./build/'));
app.use(express.static(path.join(__dirname, './client/build')));
app.get('*', function (req, res) {
  res.send(express.static(path.join(__dirname, './client/build/index.html')));
});

console.log("Environment:", CONFIG.app);

var Users = require('./routes/Users');
app.use('/users', Users);

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;
//# sourceMappingURL=app.js.map