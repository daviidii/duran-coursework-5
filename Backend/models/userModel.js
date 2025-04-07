import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const DuranUsersModel = sequelize.define(
  "UsersModel",
  {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pass: {
      type: DataTypes.STRING(64),
      allowNull: false,
      validate: {
        len: [8, 128],
      },
    },
  },
  {
    tableName: "DuranUsers",
    associate: (models) => {
      DuranUsersModel.hasMany(models.DuranTodoModel, {
        foreignKey: "userId",
        as: "tasks",
      });
    },
  }
);

export default DuranUsersModel;
