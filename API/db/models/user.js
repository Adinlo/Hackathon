'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Metrics, { foreignKey: 'userId' });
    }
  }
  User.init({
    Name: DataTypes.STRING,
    LastName: DataTypes.STRING,
    Email: {
      type: DataTypes.STRING,
      unique: true,
    },
    Password: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};