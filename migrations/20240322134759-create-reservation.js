'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reservations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      resturantName: {
        type: Sequelize.STRING
      },
      tableNum: {
        type: Sequelize.INTEGER
      },
      partySize: {
        type: Sequelize.STRING
      },
      boughtUserID: {
        type: Sequelize.INTEGER
      },
      expireTime: {
        type: Sequelize.DATE
      },
      isFree: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('reservations');
  }
};