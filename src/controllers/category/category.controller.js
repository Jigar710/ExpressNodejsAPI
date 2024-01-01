const fs = require("fs");

const slugify = require("slugify");

const db = require("../../models/index");
const { successResponse, internalServerErrorResponse, badRequestResponse } = require("../../responses");
const paginate = require("../../services/paginate.service");

// models`
const Category = db.Category;
const Product = db.Product;
const ProductCategory = db.ProductCategory;
const ProductPriceBySeller = db.ProductPriceBySeller;
const User = db.User;

class CategoryController {
  constructor() {}
  //for add category (only for admin)
  addCategory = async (req, res, next) => {
    try {
      console.log(req.file);
      const { name, small_desc, long_desc } = req.body;
      const prepareCreateData = {
        name: name,
        image: req.file.path.slice(7),
        small_desc: small_desc,
        long_desc: long_desc,
      };
      const category = await Category.create(prepareCreateData);
      return successResponse(res, "successfully added category", category);
    } catch (error) {
      console.log(error);
      return internalServerErrorResponse(res, error);
    }
  };

  updateCategory = async (req, res, next) => {
    try {
      const { id, name, small_desc, long_desc } = req.body;
      const categoryOld = await Category.findByPk(id);
      console.log(categoryOld);
      if (req.file.path) {
        fs.unlink(`public/images/categories/${categoryOld.image}`, function (err) {
          if (err) return console.log(err);
          console.log("file deleted successfully");
        });
      }

      if (categoryOld.slug == name) {
        const prepareWhereClause = { where: { id: id } };
        const prepareUpdateData = {
          name: name,
          image: req.file.path.slice(7),
          small_desc: small_desc,
          long_desc: long_desc,
        };
        await Category.update(prepareUpdateData, prepareWhereClause);
      } else {
        const count = await Category.findAndCountAll({ where: { name: name } });
        console.log(count);
        const countOfExisting = count.count;
        console.log(countOfExisting);
        const prepareUpdateData = {
          name: name,
          image: req.file.path.slice(7),
          small_desc: small_desc,
          long_desc: long_desc,
          slug: countOfExisting == 0 ? slugify(name) : `${slugify(name)}-${countOfExisting}`,
        };
        const prepareWhereClause = { where: { id: id } };
        await Category.update(prepareUpdateData, prepareWhereClause);
      }
      const category = await Category.findByPk(id);
      return successResponse(res, "Category details successfully updated", category);
    } catch (error) {
      console.log(error);
      return internalServerErrorResponse(res, error);
    }
  };

  getCategoryDetails = async (req, res) => {
    try {
      const id = req.params.categoryID;
      const category = await Category.findByPk(id);
      return successResponse(res, "successfully get details", category);
    } catch (error) {
      console.log(error);
      return internalServerErrorResponse(res, error);
    }
  };

  getAllProductsOfCategory = async (req, res) => {
    try {
      const id = req.params.categoryID;
      const { page, limit } = req.query;
      if (
        !(await Category.findOne({
          where: {
            slug: id,
          },
        }))
      ) {
        return badRequestResponse(res, "category doesn't exist");
      }
      var products = await Product.findAll({
        attributes: ["id", "product_code", "name", "image"],
        include: [
          {
            required: true,
            model: ProductCategory,
            attributes: [],
            include: [
              {
                required: true,
                model: Category,
                attributes: [],
                where: {
                  slug: id,
                },
              },
            ],
          },
        ],
      });
      products = await paginate(products, page, limit);
      return successResponse(res, "successfully get details", products);
    } catch (error) {
      console.log(error);
      return internalServerErrorResponse(res, error);
    }
  };

  removeCategory = async (req, res) => {
    try {
      const id = req.params.categoryID;
      const category = await Category.findByPk(id);
      console.log(category);
      if (!category) {
        return badRequestResponse(res, "Category is not exist");
      }
      const categories = await Category.findAll();
      await Category.destroy({ where: { id: id } });
      return successResponse(res, "successfully remove category", categories);
    } catch (error) {
      console.log(error);
      return internalServerErrorResponse(res, error);
    }
  };

  getAllCategory = async (req, res) => {
    try {
      const { page, limit } = req.query;
      var categories = await Category.findAll();
      categories = await paginate(categories, page, limit);
      return successResponse(res, "successfully getting all category", categories);
    } catch (error) {
      console.log(error);
      return internalServerErrorResponse(res, error);
    }
  };

  filter = async (req, res) => {
    try {
      const { categoryName, price, seller } = req.query;
      const prepareCategoryWhereClause = {};
      const prepareSellerWhereClause = {};
      const preparePriceWhereClause = {};
      if (categoryName) {
        prepareCategoryWhereClause.slug = categoryName;
      }
      if (price) {
        preparePriceWhereClause.price = price;
      }
      if (seller) {
        prepareSellerWhereClause.username = seller;
      }
      const products = await ProductPriceBySeller.findAll({
        include: [
          {
            model: Product,
            include: [
              {
                model: ProductCategory,
                include: [
                  {
                    model: Category,
                    where: prepareCategoryWhereClause,
                  },
                ],
              },
            ],
          },
          {
            model: User,
            where: prepareSellerWhereClause,
          },
        ],
        where: preparePriceWhereClause,
      });
      return successResponse(res, "successfully getting all category", products);
    } catch (error) {
      console.log(error);
      return internalServerErrorResponse(res, error);
    }
  };
}

module.exports = CategoryController;
