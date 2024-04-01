'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Categorys extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Categorys.init({
    title: DataTypes.STRING,
    color: DataTypes.STRING,
    menuFK: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Categorys',
    timestamps: false
  });
  return Categorys;
};