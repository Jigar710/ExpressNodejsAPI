var express = require("express");
var router = express.Router();
const { StatusController } = require("../../controllers");
const { isLoggedIn, roleWiseAccess } = require("../../middlewares");
const statusController = new StatusController();

/**
 * @group Status
 *
 * @bodyParam {string} name required Name of status
 *
 */
router.route("/create").post(isLoggedIn, roleWiseAccess("Admin"), statusController.addStatus);

/**
 * @group Status
 *
 * @bodyParam {uuid} id required
 * @bodyParam {string} name required Name of status
 *
 */
router.route("/update").post(isLoggedIn, roleWiseAccess("Admin"), statusController.updateStatus);

/**
 * @group Status
 *
 * @bodyParam {uuid} userId required
 * @bodyParam {number} status required Number of status
 *
 */
router.route("/changeStatus").post(isLoggedIn, roleWiseAccess("Admin"), statusController.changeStatusOfUser);

/**
 * @group Status
 *
 *
 */
router.route("/getAll").get(statusController.getAllStatus);
module.exports = router;
