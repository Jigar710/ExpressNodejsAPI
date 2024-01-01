"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require("../../config/config.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js";
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

//connecting models
db.User = require("./user.model")(sequelize, Sequelize);
db.Role = require("./role.model")(sequelize, Sequelize);
db.Userroles = require("./userrole.model")(sequelize, Sequelize);
db.Category = require("./category")(sequelize, Sequelize);
db.Product = require("./product")(sequelize, Sequelize);
db.ProductImage = require("./productimage")(sequelize, Sequelize);
db.ProductCategory = require("./productcategory")(sequelize, Sequelize);
db.ProductPriceBySeller = require("./productpricebyseller")(sequelize, Sequelize);
db.BuyProductFromSeller = require("./buyproductfromseller")(sequelize, Sequelize);
db.SearchHistory = require("./searchhistory")(sequelize, Sequelize);
db.Address = require("./address")(sequelize, Sequelize);
db.Review = require("./review")(sequelize, Sequelize);
db.Status = require("./status")(sequelize, Sequelize);
db.Cart = require("./cart")(sequelize, Sequelize);
db.Order = require("./order")(sequelize, Sequelize);
db.OrderDetails = require("./orderdetails")(sequelize, Sequelize);
db.Coupon = require("./coupon")(sequelize, Sequelize);
db.PaymentCards = require("./paymentcards")(sequelize, Sequelize);

//association
db.User.hasMany(db.Userroles, { foreignKey: "user_id", onDelete: "cascade" });
db.Userroles.belongsTo(db.User, { foreignKey: "user_id" });

db.Role.hasMany(db.Userroles, { foreignKey: "role_id", onDelete: "cascade" });
db.Userroles.belongsTo(db.Role, { foreignKey: "role_id" });

db.ProductPriceBySeller.belongsTo(db.Product, { foreignKey: "product_id" });
db.Product.hasMany(db.ProductPriceBySeller, { foreignKey: "product_id", onDelete: "cascade" });

db.ProductCategory.belongsTo(db.Product, { foreignKey: "product_id" });
db.Product.hasMany(db.ProductCategory, { foreignKey: "product_id", onDelete: "cascade" });

db.ProductCategory.belongsTo(db.Category, { foreignKey: "category_id" });
db.Category.hasMany(db.ProductCategory, { foreignKey: "category_id", onDelete: "cascade" });

db.Product.hasMany(db.Review, { foreignKey: "product_id", onDelete: "cascade" });
db.Review.belongsTo(db.Product, { foreignKey: "product_id" });

db.User.hasMany(db.Review, { foreignKey: "user_id", onDelete: "cascade" });
db.Review.belongsTo(db.User, { foreignKey: "user_id" });

db.User.hasMany(db.ProductPriceBySeller, { foreignKey: "user_id", onDelete: "cascade" });
db.ProductPriceBySeller.belongsTo(db.User, { foreignKey: "user_id" });

db.ProductPriceBySeller.hasMany(db.BuyProductFromSeller, { foreignKey: "product_seller_id", onDelete: "cascade" });
db.BuyProductFromSeller.belongsTo(db.ProductPriceBySeller, { foreignKey: "product_seller_id" });

db.User.hasMany(db.Address, { foreignKey: "user_id", onDelete: "cascade" });
db.Address.belongsTo(db.User, { foreignKey: "user_id" });

db.ProductPriceBySeller.hasMany(db.Cart, { foreignKey: "product_seller_id" });
db.Cart.belongsTo(db.ProductPriceBySeller, { foreignKey: "product_seller_id" });

db.User.hasMany(db.PaymentCards, { foreignKey: "user_id" });
db.PaymentCards.belongsTo(db.User, { foreignKey: "user_id" });
module.exports = db;
