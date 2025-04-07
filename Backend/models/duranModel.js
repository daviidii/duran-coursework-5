import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const DuranTodoModel = sequelize.define(
  "TodoModel",
  {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "Pending",
      validate: {
        isIn: [["Pending", "Completed"]],
      },
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "DuranTodoTasks",
    associate: (models) => {
      DuranTodoModel.belongsTo(models.DuranUsersModel, {
        foreignKey: "userId",
        as: "user",
      });
    },
  }
);

export default DuranTodoModel;
