var express = require("express");
var router = express.Router();
const { AddressController } = require("../../controllers");
const { isLoggedIn } = require("../../middlewares");

const addresscontroller = new AddressController();

/**
 * @group Address
 *
 * @bodyParam {string} title required title of address Example: Home, Office
 * @bodyParam {string} line1 required line 1 of address
 * @bodyParam {string} city city of this address
 * @bodyParam {number} pincode pincode of address Example: 395006
 * @bodyParam {uuid} user_id required Id of user
 */
router.route("/add").post(isLoggedIn, addresscontroller.addAdress);
router.route("/delete/:addressId").delete(isLoggedIn, addresscontroller.deleteAddress);
router.route("/edit").post(isLoggedIn, addresscontroller.editAddress);
router.route("/getAll").get(isLoggedIn, addresscontroller.getAddresses);
module.exports = router;
