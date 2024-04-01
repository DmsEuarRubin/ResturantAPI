'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class orderFood extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  orderFood.init({
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    food: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
          // isIn: [['Nachos', 'Seaweed salad', 'Chili', 'Pizza margherita', 'Kung Pao Chicken', 'Sweet and Sour Pork', 'Peking Roast Duck', 'Mapo Tofu', 
          // 'Bulgogi', 'Korean stew', 'Boliche', 'Tamales', 'Yuca Con Mojo', 'Chicken Tikka Masala', 'Butter Chicken', 'Tandoori Chicken', 'Biryani', 'Dal Makhani', 
          // 'Kimchi', 'Bibimbap', 'Red rice cakes', 'Picadillo', 'Ropa Vieja', 'Delicious baked moussaka', 'Fasolatha', 'Sesame-covered', 'Juicy stuffed yemista', 
          // 'loukoumades', 'Tacos', 'Discada', 'Shredded Dried Beef or Pork', 'Huevos Rancheros', 'Chilaquiles', 'Sesame chicken']]
          isIn: [[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34]]
      }
    },
    userEmail: DataTypes.STRING,
    deliveryRaiting: {
      type: DataTypes.INTEGER,
      validate: {
        isIn: [[1,2,3,4,5]]
      }
    },
    user_id: DataTypes.INTEGER,
    boughtData: DataTypes.DATE,
    isDelivered: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
      
  }, {
    sequelize,
    modelName: 'orderFood',
    timestamps: false
  });
  return orderFood;
};