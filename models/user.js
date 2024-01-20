"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      //Khai báo các cột trong table
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING },
      password: { type: DataTypes.STRING },
    },
    {
      sequelize,
      modelName: "User",
      //Mặc định Sequelize có sẵn 2 trường: createdAt, updatedAt
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "users", //Tên table trong DB
    }
  );
  return User;
};
