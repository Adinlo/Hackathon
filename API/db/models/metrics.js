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
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      accuracy: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      metric: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      numberOfGenerations: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fitness: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      numberOfCorrectPredictions: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bestGeneration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Metrics',
    }
  );
  return Metrics;
};

