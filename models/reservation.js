'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class reservation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  reservation.init({
    resturantName: DataTypes.STRING,
    tableNum: DataTypes.INTEGER,
    partySize: {
      type: DataTypes.STRING,
      validate: {
        isIn: [['small', 'medium', 'big']]
      }
    },
    boughtUserID: DataTypes.INTEGER,
    expireTime: DataTypes.DATE,
    isFree:{
        type: DataTypes.BOOLEAN,
        defaultValue: true
    } 
  }, {
    sequelize,
    modelName: 'reservation',
    timestamps: false
  });
  return reservation;
};