"use strict";
// import SequelizeSlugify from "sequelize-slugify";
const SequelizeSlugify = require("sequelize-slugify");
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Products", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      product_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      small_desc: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      long_desc: {
        type: Sequelize.TEXT("long"),
        allowNull: true,
      },
      slug: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true,
      },
      status_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Statuses",
          key: "id",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP()"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()"
        ),
      },
    });
    // SequelizeSlugify.slugifyModel(Product{
    //   source: ["name"],
    // });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Products");
  },
};
