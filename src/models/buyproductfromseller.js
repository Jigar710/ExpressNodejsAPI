"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BuyProductFromSeller extends Model {
    static associate(models) {
      // define association here
    }
  }
  BuyProductFromSeller.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      product_seller_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "ProductPriceBySellers",
          key: "id",
        },
      },
      customer_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "BuyProductFromSeller",
    }
  );
  return BuyProductFromSeller;
};
