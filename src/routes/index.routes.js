var express = require("express");

//import routers
const userRouter = require("./user");
const roleRouter = require("./role");
const categoryRouter = require("./category");
const productRouter = require("./product");
const statusRouter = require("./status");
const reviewRouter = require("./review");
const buyRouter = require("./buy");
const addressRouter = require("./address");
const cartRouter = require("./cart");
const orderRouter = require("./order");
const paymentRouter = require("./paymentCards");
const couponRouter = require("./coupon");

var router = express.Router();

router.use("/user", userRouter);
router.use("/role", roleRouter);
router.use("/category", categoryRouter);
router.use("/product", productRouter);
router.use("/status", statusRouter);
router.use("/review", reviewRouter);
router.use("/buy", buyRouter);
router.use("/address", addressRouter);
router.use("/cart", cartRouter);
router.use("/order", orderRouter);
router.use("/payments", paymentRouter);
router.use("/coupon", couponRouter);
module.exports = router;
