const { OrderController } = require("../../controllers");
const { isLoggedIn } = require("../../middlewares");
const express = require("express");
const router = express.Router();

const orderController = new OrderController();
router.route("/cart").post(isLoggedIn, orderController.order);
router.route("/track/:orderId").get(isLoggedIn, orderController.trackOrder);
module.exports = router;
