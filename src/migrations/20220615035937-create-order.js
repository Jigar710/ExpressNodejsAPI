"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Orders", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      order_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      order_status: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      payment_status: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      total_amount: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      coupon_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "Coupons",
          key: "id",
        },
        onDelete: "cascade",
      },
      estimated_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      order_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "cascade",
      },
      address_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Addresses",
          key: "id",
        },
        onDelete: "cascade",
      },
      tax: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      delivery_charge: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      total_discount: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP()"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()"),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Orders");
  },
};
