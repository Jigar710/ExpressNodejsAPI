var express = require("express");
var router = express.Router();
const { CartController } = require("../../controllers");
const { validator, isLoggedIn } = require("../../middlewares");
const cartController = new CartController();

/**
 * @group Cart
 *
 * @bodyParam {uuid} userId required Id of user
 * @bodyParam {number} quantity quantity of product
 * @bodyParam {number} weight weight of product
 * @bodyParam {string} color color of product
 * @bodyParam {string} size size of product
 * @bodyParam {uuid} productSellerId id of product_seller
 *
 */
router.route("/add").post(isLoggedIn, validator("cart"), cartController.addToCart);

router.route("/buy").get(isLoggedIn, cartController.buyProductsOfCart);

router.route("/delete/:cartId").delete(isLoggedIn, cartController.deleteProductOfCart);

router.route("/get").get(isLoggedIn, cartController.getCart);
module.exports = router;
