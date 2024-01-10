//roleWiseRouteAccess
var express = require("express");
const multer = require("multer");
const { UserController } = require("../../controllers");
const { isLoggedIn } = require("../../middlewares");
const { roleWiseAccess } = require("../../middlewares");
const validator = require("../../middlewares/validator.middleware");
var router = express.Router();

//multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/profilePics");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".png");
  },
});

const upload = multer({ storage: storage });
const userController = new UserController();

/**
 * @group User
 *
 * @bodyParam {string} firstName required first name of user. Example: testrfirstuser
 * @bodyParam {string} lastName required last name of user. Example: testlastname
 * @bodyParam {string} username required user name of user. Example: testusername
 * @bodyParam {string} email required email of user. Example: testemail
 * @bodyParam {string} password required password of authentication. Example: testpassword@123
 * @bodyParam {string} confirm_password required confirm password for confirmation. Example: testpassword@123
 * @bodyParam {string} role required role of user. Example: Customer
 * @bodyParam {string} image required provide image in png
 *
 */
router.route("/signup").post(upload.single("photo"), validator("signup"), userController.register);

/**
 * @group User
 *
 * @bodyParam {string} mobileNo required mobile number of user. Example: +918000711872
 *
 */
router.route("/mobileEntry").post(userController.mobileEntry);
// router.route("/login").post(validator("login"), userController.login);

/**
 * @group User
 *
 * @bodyParam {string} username required user name of user. Example: testusername
 * @bodyParam {string} password required password. Example: testpassword
 *
 */
router.route("/login").post(process.env.INDBAZAAR == 1 ? validator("login2") : validator("login"), userController.login);

/**
 * @group User
 *
 * @bodyParam {string} firstName required first name of user. Example: testrfirstuser
 * @bodyParam {string} lastName required last name of user. Example: testlastname
 * @bodyParam {string} username required user name of user. Example: testusername
 * @bodyParam {string} email required email of user. Example: testemail
 *
 */
router.route("/change").post(isLoggedIn, roleWiseAccess("Customer", "Seller"), userController.update);

/**
 * @group User
 *
 * @bodyParam {string} username required user name of user. Example: testusername
 * @bodyParam {string} email required email of user. Example: testemail
 *
 */
router.route("/update").post(validator("update"), userController.updateMyDetails);

router.route("/getAll").get(userController.getAllUsers);
module.exports = router;
