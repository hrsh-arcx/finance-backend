'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('FinancialRecords', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
        validate: {
          min: 0.01
        }
      },
      type: {
        type: Sequelize.ENUM('INCOME', 'EXPENSE'),
        allowNull: false
      },
      category: {
        type: Sequelize.STRING,
        allowNull : false,
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull : false,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull : true
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull : false,
        references: {
            model: 'Users',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT'
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        allowNull : false,
        defaultValue : false
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
    await queryInterface.dropTable('FinancialRecords');
  }
};