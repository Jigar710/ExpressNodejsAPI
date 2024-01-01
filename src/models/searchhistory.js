"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SearchHistory extends Model {
    static associate(models) {}
  }
  SearchHistory.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      search: DataTypes.STRING,
      count: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "SearchHistory",
    }
  );
  return SearchHistory;
};
