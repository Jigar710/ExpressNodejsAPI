const express = require("express");
const { PaymentCardsController } = require("../../controllers");
const { isLoggedIn, validator } = require("../../middlewares");
const router = express.Router();

const paymentCardsController = new PaymentCardsController();
router.route("/create").post(isLoggedIn, validator("card"), paymentCardsController.addPayment);
router.route("/edit").post(isLoggedIn, validator("card"), paymentCardsController.editPaymentcard);
router.route("/delete/:paymentCardId").delete(isLoggedIn, paymentCardsController.deletePaymentCard);
router.route("/get").get(isLoggedIn, paymentCardsController.getPaymentCard);
module.exports = router;
