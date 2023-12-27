var DataTypes = require("sequelize").DataTypes;
var _users = require("./users");
var _version = require("./version");

function initModels(sequelize) {
  var users = _users(sequelize, DataTypes);
  var version = _version(sequelize, DataTypes);


  return {
    users,
    version,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
