var express = require("express");
var router = express.Router();
const { RoleController } = require("../../controllers");
const { isLoggedIn, roleWiseAccess } = require("../../middlewares");
const roleController = new RoleController();

/**
 * @group Role
 *
 * @bodyParam {string} name Example: Admin, Customer, Seller
 *
 */
router.route("/create").post(isLoggedIn, roleWiseAccess("Admin"), roleController.addRole);
module.exports = router;
