"use strict";
const { Model } = require("sequelize");
const SequelizeSlugify = require("sequelize-slugify");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      // this.belongsTo(models.Status, {
      //   foreignKey: "status_id",
      // });
      console.log(models);
      // this.hasMany(models.Review);
      // this.hasMany(models.ProductPriceBySeller, {
      //   foreignKey: "product_id",
      //   onDelete: "CASCADE",
      // });
    }
  }
  Product.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      product_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      small_desc: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      long_desc: {
        type: DataTypes.TEXT("long"),
        allowNull: true,
      },
      slug: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },
      status_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Statuses",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Product",
    }
  );

  SequelizeSlugify.slugifyModel(Product, {
    source: ["name"],
  });
  return Product;
};
