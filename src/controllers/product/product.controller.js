const fs = require("fs");
const slugify = require("slugify");
const stringArray = require("string-array");
const sequelize = require("sequelize");
const serial = require("generate-serial-key");
const db = require("../../models/index");
const Op = sequelize.Op;
const { findAllWithPagination, paginate } = require("../../services/index.service");
const { successResponse, internalServerErrorResponse, badRequestResponse } = require("../../responses");
const getDataWithPagination = require("../../services/paginate.service");

// models
const Product = db.Product;
const ProductCategory = db.ProductCategory;
const ProductPriceBySeller = db.ProductPriceBySeller;
const ProductImage = db.ProductImage;
const User = db.User;
const Category = db.Category;
const SearchHistory = db.SearchHistory;

class ProductController {
  constructor() {}
  //for add Product (only for Seller)
  addProduct = async (req, res, next) => {
    try {
      //   console.log(req.file);
      var { name, small_desc, long_desc, status_id, categories } = req.body;
      categories = categories.split(",");
      console.log({ categories });
      const prepareCreateData = {
        product_code: serial.generate(),
        name: name,
        image: req.file.path.slice(7),
        small_desc: small_desc,
        long_desc: long_desc,
        status_id: status_id,
      };
      const product = await Product.create(prepareCreateData);
      const prepareCategories = [];
      for (const category of categories) {
        prepareCategories.push({
          product_id: product.id,
          category_id: category,
        });
      }
      await ProductCategory.bulkCreate(prepareCategories);
      return successResponse(res, "successfully added product", product);
    } catch (error) {
      console.log(error);
    }
    res.send("add Product");
  };

  updateProduct = async (req, res) => {
    try {
      const { id, name, small_desc, long_desc, status_id } = req.body;
      const oldData = await Product.findByPk(id);
      if (req.file.path) {
        fs.unlink(`public/images/products/${oldData.image}`, function (err) {
          if (err) return console.log(err);
          console.log("file deleted successfully");
        });
      }
      if (oldData.slug == name) {
        await Product.update(
          {
            product_code: oldData.product_code,
            name: name,
            image: req.file.filename,
            small_desc: small_desc,
            long_desc: long_desc,
            status_id: status_id,
          },
          { where: { id: id } }
        );
      } else {
        const count = await Product.count({ where: { name: name } });

        console.log({ count });
        const countOfExisting = count;
        console.log(countOfExisting);
        await Product.update(
          {
            name: name,
            image: req.file.filename,
            small_desc: small_desc,
            long_desc: long_desc,
            slug: countOfExisting == 0 ? slugify(name) : `${slugify(name)}-${countOfExisting}`,
          },
          { where: { id: id } }
        );
      }
      const product = await Product.findByPk(id);
      return successResponse(res, "successfully update product", product);
    } catch (error) {
      console.log(error);
      return internalServerErrorResponse(res, error);
    }
  };

  getProductDetails = async (req, res) => {
    try {
      const id = req.params.productId;
      const product = await Product.findByPk(id);
      const productsFromAllSellers = await Product.findAll({
        include: {
          // attributes: ["product_id", "user_id", "price", "brand", "quantity", "weight"], //, [sequelize.fn("sum", sequelize.col("quantity")), "total"]],
          model: ProductPriceBySeller,
          // include: [
          //   {
          //     model: User,
          //   },
          // ],
          // group: ["ProductPriceBySeller.product_id"],
        },
        // raw: true,
        where: { id: id },
      });
      // const productsFromAllSellers = await ProductPriceBySeller.findAll({
      //   attributes: ["product_id", "user_id", [sequelize.fn("sum", sequelize.col("quantity")), "total"]],
      //   include: {
      //     model: Product,
      //   },
      //   group: ["ProductPriceBySeller.product_id"],
      //   where: { product_id: id },
      // });
      var totalQuantity = 0;
      console.log(productsFromAllSellers);
      console.log(totalQuantity);
      return successResponse(res, "successfully get product details", { productsFromAllSellers: productsFromAllSellers });
    } catch (error) {
      console.log(error);
      return internalServerErrorResponse(res, error);
    }
  };

  getAllProducts = async (req, res) => {
    try {
      const { page, limit } = req.query;
      var products = await Product.findAll({
        include: [
          {
            attributes: ["category_id"],
            model: ProductCategory,
            include: [
              {
                attributes: ["name"],
                model: Category,
              },
            ],
          },
        ],
      });
      products = await paginate(products, page, limit);
      return successResponse(res, "successfully get all products details", products);
    } catch (error) {
      console.log(error);
      return internalServerErrorResponse(res, error);
    }
  };

  removeProduct = async (req, res) => {
    try {
      const id = req.params.productID;
      const product = await Product.findByPk(id);
      console.log(product);
      if (!product) {
        return badRequestResponse(res, "Product is not exist");
      }
      await Product.destroy({ where: { id: id } });
      return successResponse(res, "successfully remove category", product);
    } catch (error) {
      console.log(error);
      return internalServerErrorResponse(res, error);
    }
  };

  addSpecsOfProduct = async (req, res) => {
    try {
      const { product_id, price, quantity, brand, weight } = req.body;

      const prepareCreateData = {
        user_id: req.user.id,
        product_id: product_id,
        price: price,
        quantity: quantity,
        weight: weight,
        brand: brand,
      };
      console.log(prepareCreateData);
      const productPriceBySeller = await ProductPriceBySeller.create(prepareCreateData);
      return successResponse(res, "successfull added specifications of your product", productPriceBySeller);
    } catch (error) {
      console.log(error);
      return internalServerErrorResponse(res, error);
    }
  };

  updateSpecsOfProduct = async (req, res) => {
    try {
      const { id, product_id, price, quantity } = req.body;
      const oldData = await ProductPriceBySeller.findByPk(id);
      console.log(oldData);
      if (oldData.user_id == req.user.id) {
        const productPriceBySeller = await ProductPriceBySeller.update(
          {
            product_id: product_id,
            price: price,
            quantity: quantity,
          },
          {
            where: {
              id: id,
            },
          }
        );
        return successResponse(res, "successfull update specifications of your product", productPriceBySeller);
      } else {
        return badRequestResponse(res, "This is not your product.So you can't edit this.");
      }
    } catch (error) {
      console.log(error);
      return internalServerErrorResponse(res, error);
    }
  };

  addProductImages = async (req, res) => {
    try {
      const { product_id } = req.body;
      console.log(req.files);
      req.files.map(async (val, i) => {
        await ProductImage.create({
          product_id: product_id,
          image: val.filename,
        });
      });
      return successResponse(
        res,
        "successfully added all the images",
        req.files.map((val) => val.path)
      );
    } catch (error) {
      console.log(error);
      return internalServerErrorResponse(res, error);
    }
  };

  filter = async (req, res) => {
    try {
      const { name, minPrice, maxPrice, seller, sortBy, page, limit } = req.query;

      let prepareCategoryWhereClause = {};
      let preparePriceSellerWhereClause = {};
      let requiredFlagCategory = false;
      let requiredFlagPriceSeller = false;
      let orderSortBy = null;

      if (name) {
        prepareCategoryWhereClause.slug = name;
        requiredFlagCategory = true;
      }
      //this is for price range
      if (maxPrice && minPrice) {
        preparePriceSellerWhereClause.price = {
          [Op.gte]: minPrice,
          [Op.lte]: maxPrice,
        };
        requiredFlagPriceSeller = true;
      } else {
        if (minPrice) {
          preparePriceSellerWhereClause.price = {
            [Op.gte]: minPrice,
          };
          requiredFlagPriceSeller = true;
        }
        if (maxPrice) {
          preparePriceSellerWhereClause.price = {
            [Op.lte]: maxPrice,
          };
          requiredFlagPriceSeller = true;
        }
      }
      //specific seller
      if (seller) {
        preparePriceSellerWhereClause.brand = seller;
        requiredFlagPriceSeller = true;
      }

      if (sortBy) {
        if (sortBy == "price-asc") {
          requiredFlagPriceSeller = true;
          orderSortBy = [[ProductPriceBySeller, "price", "ASC"]];
        } else if (sortBy == "price-desc") {
          requiredFlagPriceSeller = true;
          orderSortBy = [[ProductPriceBySeller, "price", "DESC"]];
        } else if (sortBy == "newest") {
          orderSortBy = [["createdAt", "ASC"]];
        } else if (sortBy == "oldest") {
          orderSortBy = [["createdAt", "DESC"]];
        }
      }

      let limit1 = limit;
      let offset = 0 + (page - 1) * limit1;
      const options = {
        include: [
          {
            model: ProductCategory,
            attributes: [],
            required: requiredFlagCategory,
            include: [
              {
                model: Category,
                attributes: [],
                where: prepareCategoryWhereClause,
                required: requiredFlagCategory,
              },
            ],
          },
          {
            model: ProductPriceBySeller,
            attributes: ["price", "brand"],
            where: preparePriceSellerWhereClause,
            required: requiredFlagPriceSeller,
          },
        ],
        offset: offset,
        limit: parseInt(limit1),
        order: orderSortBy,
      };

      let products = await Product.findAndCountAll(options);
      // let products = await Product.findAll(getDataWithPagination({ options }, { page, limit }));
      console.log({ products });
      // let products = await findAllWithPagination(Product, options, parseInt(page), parseInt(limit));
      return successResponse(res, "successfully getting all category", products);
    } catch (error) {
      console.log(error);
      return internalServerErrorResponse(res, error);
    }
  };

  search = async (req, res) => {
    try {
      const { name } = req.query;
      const isPastSearchExist = await SearchHistory.findOne({
        where: {
          search: name,
        },
      });
      if (isPastSearchExist) {
        await SearchHistory.update(
          {
            count: isPastSearchExist.count + 1,
          },
          {
            where: {
              id: isPastSearchExist.id,
            },
          }
        );
      } else {
        const prepareCreateData = {
          search: name,
        };
        await SearchHistory.create(prepareCreateData);
      }

      var products = await Product.findAll({
        where: {
          name: { [Op.like]: `%${name}%` },
        },
      });
      const productsInCategory = await Product.findAll({
        include: [
          {
            attributes: [],
            model: ProductCategory,
            required: true,
            include: [
              {
                attributes: [],
                model: Category,
                required: true,
                where: {
                  name: { [Op.like]: `%${name}%` },
                },
              },
            ],
          },
        ],
      });
      products = products.concat(productsInCategory);
      products = products.filter((v, i, a) => a.findIndex((v2) => v2.id === v.id) === i);
      if (products[0].length == 0) {
        return successResponse(res, "not found any record", products);
      }
      return successResponse(res, "searching is compeleted", products);
    } catch (error) {
      console.log(error);
      return internalServerErrorResponse(res, error);
    }
  };

  suggestions = async (req, res) => {
    try {
      const { search } = req.query;
      const orderSortBy = [["count", "DESC"]];
      let suggestions = await SearchHistory.findAll({
        attributes: ["search", "count"],
        where: {
          search: { [Op.like]: `%${search}%` },
        },

        order: orderSortBy,
      });
      suggestions = suggestions.map((value) => value.search);
      return successResponse(res, "suggestions", suggestions);
    } catch (error) {
      console.log(error);
      return internalServerErrorResponse(res, error);
    }
  };
}
module.exports = ProductController;
