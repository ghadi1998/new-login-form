'use strict';

var Sequelize = require('sequelize');
var app = require('./app');
var CONFIG = require('../config/CONFIG');
var db = {};

var sequelize = new Sequelize('users', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
//# sourceMappingURL=server.js.map