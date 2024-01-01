"use strict";
const { sequelize, Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const PROTECTED_ATTRIBUTES = ["password"];
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
    toJSON() {
      // hide protected fields
      let attributes = Object.assign({}, this.get());
      for (let a of PROTECTED_ATTRIBUTES) {
        delete attributes[a];
      }
      return attributes;
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      username: DataTypes.STRING,
      mobile_no: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      otp: {
        type: DataTypes.INTEGER,
        unique: true,
      },
      photo: DataTypes.STRING,
      status: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  // User.beforeCreate((user) => (user.id = uuid()));
  return User;
};
