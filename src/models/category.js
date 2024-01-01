"use strict";
const { Model } = require("sequelize");

const SequelizeSlugify = require("sequelize-slugify");
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    // static associate(models) {
    //   this.hasMany(models.Product);
    // }
  }
  Category.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
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
    },
    {
      sequelize,
      modelName: "Category",
    }
  );
  SequelizeSlugify.slugifyModel(Category, {
    source: ["name"],
    overwrite: true,
  });
  // Category.afterCreate(async (user) => {
  //   // console.log(user);
  // });
  // Category.beforeBulkUpdate(async (user) => {
  //   console.log("updateed");
  //   user.attributes["slug"] = "gg";
  // });
  // // Category.addHook("afterBulkUpdate", (user) => {
  // //   console.log({ user: user });
  // //   const newData = user.attributes;
  // //   console.log(newData);
  // //   SequelizeSlugify.slugifyModel(Category, {
  // //     source: ["name"],
  // //   });
  // // });
  return Category;
};
