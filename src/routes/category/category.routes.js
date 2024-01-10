var express = require("express");
const multer = require("multer");

var router = express.Router();

//import statements
const { CategoryController } = require("../../controllers");
const validator = require("../../middlewares/validator.middleware");
const { roleWiseAccess, isLoggedIn } = require("../../middlewares");

//creating instance
const categoryController = new CategoryController();
//multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/categories");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".png");
  },
});
const upload = multer({ storage: storage });

/**
 * @group Category
 *
 * @bodyParam {string} name required name of category. Example: food
 * @bodyParam {string} small_desc required small description of category.
 * @bodyParam {string} long_desc required long description of category
 * @bodyParam {image} image required this is file.
 *
 */
router.route("/add").post(isLoggedIn, roleWiseAccess("Admin"), upload.single("image"), validator("category"), categoryController.addCategory);

/**
 * @group Category
 *
 * @bodyParam {string} id required id of category Example: 78196526-7254-4abc-a101-7bc2ba6ba89c
 * @bodyParam {string} name required name of category. Example: food
 * @bodyParam {string} small_desc required small description of category.
 * @bodyParam {string} long_desc required long description of category
 * @bodyParam {string} image required this is file.
 *
 */
router.route("/update").post(isLoggedIn, roleWiseAccess("Admin"), upload.single("image"), validator("category"), categoryController.updateCategory);
/**
 * @group Category
 *
 *
 */
router.route("/getDetails/:categoryID").get(isLoggedIn, roleWiseAccess("Admin", "Seller", "Customer"), categoryController.getCategoryDetails);
/**
 * @group Category
 *
 *
 */
router.route("/getAllProducts/:categoryID").get(isLoggedIn, roleWiseAccess("Admin", "Seller", "Customer"), categoryController.getAllProductsOfCategory);
/**
 * @group Category
 *
 *
 */
router.route("/delete/:categoryID").delete(isLoggedIn, roleWiseAccess("Admin"), categoryController.removeCategory);

/**
 * @group Category
 *
 *
 */
router.route("/getAllcategories").get(isLoggedIn, roleWiseAccess("Admin", "Seller", "Customer"), categoryController.getAllCategory);

// router.route("/product").get(categoryController.filter);
module.exports = router;
