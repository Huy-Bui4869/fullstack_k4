"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Device extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Device.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }

  Device.init(
    {
      //Khai báo các cột trong table
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: DataTypes.INTEGER },
      browser: { type: DataTypes.STRING },
      operating: { type: DataTypes.STRING },
      status: { type: DataTypes.BOOLEAN },
    },
    {
      sequelize,
      modelName: "Device",
      //Mặc định Sequelize có sẵn 2 trường: createdAt, updatedAt
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "devices", //Tên table trong DB
    }
  );
  return Device;
};
