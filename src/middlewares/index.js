const isLoggedIn = require("./isLoggedIn.middleware");
const roleWiseAccess = require("./roleWiseAccess.middleware");
const validator = require("./validator.middleware");
module.exports = {
  isLoggedIn,
  roleWiseAccess,
  validator,
};
