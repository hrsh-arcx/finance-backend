'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AuditLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      AuditLog.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      })
    }
  }
  AuditLog.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    action: {
      type: DataTypes.ENUM('CREATE', 'UPDATE', 'DELETE','LOGIN'),
      allowNull: false,
    },
    entity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    entityId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    oldValues: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    newValues: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },{
    sequelize,
    modelName: 'AuditLog',
  });
  return AuditLog;
};