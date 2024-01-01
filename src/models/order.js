"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Order.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      order_number: DataTypes.INTEGER,
      order_status: DataTypes.UUID,
      payment_status: DataTypes.UUID,
      total_amount: DataTypes.DOUBLE,
      coupon_id: DataTypes.UUID,
      estimated_date: DataTypes.DATE,
      order_type: DataTypes.STRING,
      user_id: DataTypes.UUID,
      address_id: DataTypes.UUID,
      tax: DataTypes.FLOAT,
      delivery_charge: DataTypes.DECIMAL,
      total_discount: DataTypes.DOUBLE,
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
