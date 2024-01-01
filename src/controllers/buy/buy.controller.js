const db = require("../../models/index");
const { internalServerErrorResponse, successResponse } = require("../../responses");

//models
const BuyProductFromSeller = db.BuyProductFromSeller;
const ProductPriceBySeller = db.ProductPriceBySeller;
//buy controller
class BuyController {
  constructor() {}
  buyProduct = async (req, res) => {
    try {
      const { productSellerId, quantity } = req.body;
      const customer_id = req.user.id;
      const buyProduct = await BuyProductFromSeller.create({
        product_seller_id: productSellerId,
        quantity: quantity,
        customer_id: customer_id,
      });
      const pastData = await ProductPriceBySeller.findByPk(productSellerId);
      await ProductPriceBySeller.update(
        {
          quantity: pastData.quantity - quantity,
        },
        { where: { id: productSellerId } }
      );
      return successResponse(res, "Successfully purchased item", buyProduct);
    } catch (error) {
      console.log(error);
      return internalServerErrorResponse(res, error);
    }
  };
}
module.exports = BuyController;
