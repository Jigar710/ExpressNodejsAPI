var express = require("express");
var router = express.Router();
const { BuyController } = require("../../controllers");
const { isLoggedIn, roleWiseAccess } = require("../../middlewares");
const buyController = new BuyController();

/**
 * @group Buy
 *
 * @bodyParam {uuid} productSellerId required
 * @bodyParam {number} quantity required
 *
 */
router.route("/buyProduct").post(isLoggedIn, roleWiseAccess("Customer"), buyController.buyProduct);
module.exports = router;
