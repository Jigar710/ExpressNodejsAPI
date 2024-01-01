const sequelize = require("sequelize");

const { internalServerErrorResponse, successResponse, badRequestResponse } = require("../../responses");
const db = require("../../models/index");

//models
const Cart = db.Cart;
const ProductPriceBySeller = db.ProductPriceBySeller;
const Product = db.Product;
class CartController {
  constructor() {}
  addToCart = async (req, res) => {
    try {
      // console.log(req.body);
      const { quantity, weight, color, size, productSellerId } = req.body;
      if (quantity && weight) {
        return badRequestResponse(res, "Please provide only one parameter...quantity or weight");
      }
      if (!(quantity || weight)) {
        return badRequestResponse(res, "Please provide quantity or weight.");
      }

      var createCart = null;
      const prepareSerachData = {
        where: {
          product_seller_id: productSellerId,
          user_id: req.user.id,
        },
      };
      const productSeller = await ProductPriceBySeller.findByPk(productSellerId);
      const alreadyExist = await Cart.findOne(prepareSerachData);
      if (alreadyExist) {
        const prepareUpdateData = {
          quantity: quantity && parseInt(alreadyExist.quantity) + parseInt(quantity),
          weight: weight && parseFloat(alreadyExist.weight) + parseFloat(weight),
        };
        if (quantity && productSeller.quantity < prepareUpdateData.quantity) {
          return badRequestResponse(res, "These much items are not available");
        }
        if (weight && productSeller.weight < prepareUpdateData.weight) {
          return badRequestResponse(res, "These much items are not available");
        }
        await Cart.update(prepareUpdateData, prepareSerachData);
        createCart = await Cart.findOne(prepareSerachData);
      } else {
        const productPriceBySeller = await ProductPriceBySeller.findByPk(productSellerId);
        const amount = quantity ? productPriceBySeller.price * quantity : productPriceBySeller.price * weight;
        const prepareCreateData = {
          user_id: req.user.id,
          quantity: quantity ? quantity : null,
          weight: weight ? weight : null,
          color: color,
          size: size,
          price: productPriceBySeller.price,
          amount: amount,
          product_seller_id: productSellerId,
        };
        createCart = await Cart.create(prepareCreateData);
      }

      return successResponse(res, "successfully added to the cart", createCart);
    } catch (error) {
      console.log(error);
      return internalServerErrorResponse(res, error);
    }
  };

  buyProductsOfCart = async (req, res) => {
    try {
      const { userId } = req.body;
      const prepareWhereClause = {
        attributes: ["user_id", sequelize.fn("sum", sequelize.col("price"))],
        group: ["user_id"],
        raw: true,
        where: {
          user_id: userId,
        },
      };
      const amount = await Cart.findOne(prepareWhereClause);
      return successResponse(res, "successfully purchased items", { totalAmount: amount["sum(`price`)"] });
    } catch (error) {
      console.log(error);
      return internalServerErrorResponse(res);
    }
  };

  deleteProductOfCart = async (req, res) => {
    try {
      const id = req.params.cartId;
      const prepareWhereClause = {
        where: {
          id: id,
        },
      };
      await Cart.destroy(prepareWhereClause);
      const cart = await Cart.findAll();
      return successResponse(res, "successfully deleted item form cart", cart);
    } catch (error) {
      console.log(error);
      return internalServerErrorResponse(res, error);
    }
  };

  getCart = async (req, res) => {
    try {
      const cartsItems = await Cart.findAll({
        include: [
          {
            attributes: ["price", "brand"],
            model: ProductPriceBySeller,
            include: [
              {
                model: Product,
              },
            ],
          },
        ],
        where: {
          user_id: req.user.id,
        },
      });
      console.log(cartsItems);
      return successResponse(res, "successfully get", cartsItems);
    } catch (error) {
      console.log(error);
      return internalServerErrorResponse(res, error);
    }
  };
}

module.exports = CartController;
