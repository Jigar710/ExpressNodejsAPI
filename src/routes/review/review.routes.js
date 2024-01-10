//roleWiseRouteAccess
var express = require("express");
const { ReviewController } = require("../../controllers");
const validator = require("../../middlewares/validator.middleware");

const { isLoggedIn, roleWiseAccess } = require("../../middlewares");
var router = express.Router();

const reviewController = new ReviewController();

/**
 * @group Review
 *
 * @bodyParam {string} review required
 * @bodyParam {float} rating required
 * @bodyParam {uuid} product_id required
 *
 */
router.route("/create").post(isLoggedIn, roleWiseAccess("Customer"), reviewController.addReview);

/**
 * @group Review
 *
 */
router.route("/get/:productID").get(reviewController.getReviewOfProduct);
/**
 * @group Review
 *
 */
router.route("/delete/:reviewID").delete(isLoggedIn, roleWiseAccess("Customer", "Admin"), reviewController.deleteReview);
module.exports = router;
