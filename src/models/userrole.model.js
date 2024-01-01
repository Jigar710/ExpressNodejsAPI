"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Userrole extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // this.belongsTo(models.User, {
      //   foreignKey: "id",
      //   as: "user_id",
      // });
    }
  }
  Userrole.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      // user_id: DataTypes.STRING,
      role_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Roles",
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
    },
    {
      sequelize,
      modelName: "Userrole",
    }
  );
  return Userrole;
};
