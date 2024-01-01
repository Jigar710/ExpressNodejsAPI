"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PaymentCards extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PaymentCards.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "cascade",
      },
      card_holder_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      card_no: {
        type: DataTypes.BIGINT(16),
        allowNull: false,
        unique: true,
      },
      expire_date: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cvv: {
        type: DataTypes.INTEGER(3),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "PaymentCards",
    }
  );
  return PaymentCards;
};
