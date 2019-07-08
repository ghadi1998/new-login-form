"use strict";

var Sequelize = require("sequelize");
var db = require("../server");

module.exports = db.sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: Sequelize.STRING

  },
  first_name: {
    type: Sequelize.STRING
  },
  last_name: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },
  created: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },

  // The `timestamps` field specify whether or not the `createdAt` and `updatedAt` fields will be created.
  // This was true by default, but now is false by default

  timestamps: false,
  freezeTableName: true,
  tableName: 'user'
});
//# sourceMappingURL=user.js.map