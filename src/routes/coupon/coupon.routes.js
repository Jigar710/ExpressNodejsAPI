const express = require("express");
const { CouponController } = require("../../controllers");
const router = express.Router();

const couponController = new CouponController();

router.route("/add").post(couponController.addCoupon);
router.route("/edit").post(couponController.editCoupon);
router.route("/delete/:couponId").delete(couponController.deleteCoupon);
router.route("/getAll").get(couponController.getAllCouponsForUser);
router.route("/get").get(couponController.getCoupons);

module.exports = router;
