//roleWiseRouteAccess
var express = require("express");
const multer = require("multer");
const { ProductController } = require("../../controllers");
const { isLoggedIn, roleWiseAccess } = require("../../middlewares");
const validator = require("../../middlewares/validator.middleware");
var router = express.Router();

//multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/products");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".png");
  },
});

const upload = multer({ storage: storage });
const productController = new ProductController();

/**
 * @group Product
 *
 * @bodyParam {string} name required name of product. Example: food
 * @bodyParam {string} small_desc required small description of product.
 * @bodyParam {string} long_desc required long description of product
 * @bodyParam {string} image required this is file.
 * @bodyParam {uuid} status_id required
 * @bodyParam {string} categories required you can provide multiple categories too. Example: c30af3d1-d6b8-4a90-b58e-49e124431f71,d30af3d1-d8b8-4a90-b58e-49e12551f71
 *
 */
router.route("/create").post(isLoggedIn, roleWiseAccess("Seller"), upload.single("image"), validator("product"), productController.addProduct);

/**
 * @group Product
 *
 *
 * @bodyParam {uuid} id required ID of product
 * @bodyParam {string} name required name of Product. Example: food
 * @bodyParam {string} small_desc required small description of product.
 * @bodyParam {string} long_desc required long description of product
 * @bodyParam {image} image required this is file.
 * @bodyParam {uuid} status_id required
 *
 *
 */
router.route("/update").post(isLoggedIn, roleWiseAccess("Admin"), upload.single("image"), validator("product"), productController.updateProduct);

/**
 * @group Product
 *
 * @urlParam {uuid} productId
 */
router.route("/getDetails/:productId").get(isLoggedIn, roleWiseAccess("Admin", "Seller", "Customer"), productController.getProductDetails);

/**
 * @group Product
 *
 */
router.route("/getAll").get(isLoggedIn, roleWiseAccess("Admin", "Seller", "Customer"), productController.getAllProducts);
/**
 * @group Product
 *
 */
router.route("/delete/:productID").delete(isLoggedIn, roleWiseAccess("Admin"), productController.removeProduct);

/**
 * @group Product
 *
 * @bodyParam {uuid} user_id required
 * @bodyParam {uuid} product_id required
 * @bodyParam {number} price required
 * @bodyParam {number} quantity required
 * @bodyParam {string} brand required
 *
 */
router.route("/addPriceQuantity").post(isLoggedIn, roleWiseAccess("Seller"), productController.addSpecsOfProduct);

const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/productsOtherPics");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".png");
  },
});
const upload2 = multer({ storage: storage2 });
/**
 * @group Product
 *
 * @bodyParam {uuid} product_id required
 * @bodyParam {image} images required other images of product
 *
 */
router.route("/addImages").post(isLoggedIn, roleWiseAccess("Seller"), upload2.array("images", 6), productController.addProductImages);
/**
 * @group Product
 *
 * @bodyParam {uuid} id required product seller id
 * @bodyParam {uuid} product_id required id of product
 * @bodyParam {number} price required new price of product
 *
 */
router.route("/updateSpecs").post(isLoggedIn, roleWiseAccess("Seller"), productController.updateSpecsOfProduct);
/**
 * @group Product
 *
 * @queryParam {string} name Category's Name
 * @queryParam {string} seller name of seller brand
 * @queryParam {string} sortBy Example: price-desc, price-asc, oldest, newest
 * @queryParam {number} minPrice
 * @queryParam {number} maxPrice
 * @queryParam {number} limit
 * @queryParam {number} page
 */
router.route("/filter").get(productController.filter);
/**
 * @group Product
 *
 */
router.route("/search").get(productController.search);
/**
 * @group Product
 *
 * @queryParam {string} name searching word
 *
 */
router.route("/suggestions").get(productController.suggestions);

module.exports = router;
