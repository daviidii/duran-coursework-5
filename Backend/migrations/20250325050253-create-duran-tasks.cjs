"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.createTable("DuranTodoTasks", {
      _id: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      title: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false,
        autoIncrement: false,
        primaryKey: false,
      },
      description: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: "Pending",
        validate: {
          isIn: [["Pending", "Completed"]],
        },
        unique: false,
        allowNull: false,
        autoIncrement: false,
        primaryKey: false,
      },
      due_date: {
        type: Sequelize.DATE,
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addConstraint("DuranTodoTasks", {
      fields: ["userId"],
      type: "foreign key",
      name: "fk_user_id",
      references: {
        table: "DuranUsers",
        field: "_id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
