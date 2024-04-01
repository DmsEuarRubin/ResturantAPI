'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Food extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Food.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    raiting: {
      type: DataTypes.ARRAY(DataTypes.INTEGER)
    },
    price: DataTypes.STRING,
    category_id: DataTypes.INTEGER,
    raitedUsers: {
      type: DataTypes.ARRAY(DataTypes.INTEGER)
    }
  }, {
    sequelize,
    modelName: 'Food',
    timestamps: false
  });
  return Food;

};
