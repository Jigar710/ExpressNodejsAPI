"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Status extends Model {
    static associate(models) {
      this.hasMany(models.Product);
    }
  }
  Status.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Status",
    }
  );
  return Status;
};
