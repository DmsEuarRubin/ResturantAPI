'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
    }
  }

  Users.init({
    username:{
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please enter the username!"
        },
        len: [3, 24]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Please write the valid email!"
        },
        notNull: {
          msg: "Please enter the email!"
        }
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: "Please enter the phone number!"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please enter the password!"
        }
      }
    },
    language: {
      type: DataTypes.STRING,
      defaultValue: "ENG",
      validate: {
        isIn:{
          msg: "Choose valid the valid language: [ENG, RUS, ARM]",
          args: [['ENG', 'RUS', 'ARM']]
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Users',
    timestamps: false
  });
  return Users;
};