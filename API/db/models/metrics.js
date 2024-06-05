'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Metrics extends Model {
    static associate(models) {
      Metrics.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }
  Metrics.init(
    {
      accuracy: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      rmse: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      fitness: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      loss: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },      
      pathCsv: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: 'Metrics',
    }
  );
  return Metrics;
};

