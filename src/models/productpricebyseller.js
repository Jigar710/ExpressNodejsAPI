"use strict";
const { Model } = require("sequelize");
const SequelizeSlugify = require("sequelize-slugify");
module.exports = (sequelize, DataTypes) => {
  class ProductPriceBySeller extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // this.belongsTo(models.Product, {
      //   foreignKey: "product_id",
      // });
      // this.belongsTo(models.User, {
      //   foreignKey: "user_id",
      // });
    }
  }
  ProductPriceBySeller.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
      },
      quantity: {
        type: DataTypes.INTEGER,
      },
      weight: {
        type: DataTypes.FLOAT,
      },
      product_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Products",
          key: "id",
        },
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      brand: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "ProductPriceBySeller",
    }
  );
  SequelizeSlugify.slugifyModel(ProductPriceBySeller, {
    source: ["brand"],
    overwrite: true,
  });
  return ProductPriceBySeller;
};
