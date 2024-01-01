const sequelize = require("sequelize");
const moment = require("moment");
const otp = require("otp-generator");
const db = require("../../models/index");
const { internalServerErrorResponse, successResponse, badRequestResponse } = require("../../responses");
const coupon = require("../../models/coupon");

//models
const Cart = db.Cart;
const Order = db.Order;
const OrderDetails = db.OrderDetails;
const ProductPriceBySeller = db.ProductPriceBySeller;
const Coupon = db.Coupon;
class OrderController {
  constructor() {}
  order = async (req, res) => {
    try {
      const { order_type, address_id, redeem_code } = req.body;

      const cartTotalAmount = await Cart.findOne({
        attributes: ["product_seller_id", "user_id", [sequelize.fn("sum", sequelize.col("amount")), "total"]],
        where: { user_id: req.user.id },
        group: ["Cart.user_id"],
        raw: true,
      });
      let totalAmount = cartTotalAmount.total;
      console.log(totalAmount);
      var discount = 0;
      if (redeem_code) {
        const coupon = await Coupon.findOne({ where: { redeem_code: redeem_code } });
        if (coupon.status == 3) {
          return badRequestResponse(res, "your redeem code is not active.");
        }
        const isExpired = moment(moment()).isBefore(moment(coupon.expire_date));
        if (!isExpired) {
          return badRequestResponse(res, "your redeem code is expired");
        }
        if (coupon.discount) {
          console.log("ehehd");
          discount = coupon.discount;
          totalAmount = totalAmount - discount;
        } else {
          console.log("ehehddoljeefefe");
          discount = (coupon.percentage * totalAmount) / 100;
          totalAmount = totalAmount - discount;
        }
      }
      const prepareCreateData = {
        order_number: otp.generate(7, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false }),
        order_status: "784e92a0-ebdb-11ec-8ea0-0242ac120002",
        payment_status: "b68094bc-ebdb-11ec-b08d-7020840e0e92",
        total_amount: totalAmount >= 500 ? totalAmount + 10 : totalAmount + 60,
        coupon_id: coupon.id,
        estimated_date: moment(moment()).add(4, "days"),
        order_type: order_type,
        user_id: req.user.id,
        address_id: address_id,
        tax: 10,
        delivery_charge: totalAmount >= 500 ? 0 : 80,
        total_discount: discount,
      };
      //   console.log({ prepareCreateData: prepareCreateData });
      const order = await Order.create(prepareCreateData);
      const cart = await Cart.findAll({
        where: {
          user_id: req.user.id,
        },
      });
      const prepareCreateDataOfOrderDetails = [];
      var temp = {};
      var price = 0;
      for (const iterator of cart) {
        temp = await ProductPriceBySeller.findByPk(iterator.product_seller_id);
        console.log(temp);
        price = temp.price;
        prepareCreateDataOfOrderDetails.push({
          product_seller_id: iterator.product_seller_id,
          order_id: order.id,
          quantity: iterator.quantity,
          weight: iterator.weight,
          price: price,
          amount: iterator.price,
        });
        await Cart.destroy({ where: { id: iterator.id } });
      }
      console.log(prepareCreateDataOfOrderDetails);
      await OrderDetails.bulkCreate(prepareCreateDataOfOrderDetails);
      return successResponse(res, "successfully purchased", order);
    } catch (error) {
      console.log(error);
      return internalServerErrorResponse(res, error);
    }
  };

  trackOrder = async (req, res) => {
    try {
      const id = req.params.orderId;
      const order = await Order.findByPk(id);
      console.log(order.estimated_date);

      const trackOrder = {
        orderPlaced: moment(order.estimated_date).subtract(4, "days").format("DD MMMM,YY - hh:mm A"),
        processingOrder: moment(order.estimated_date).subtract(4, "days").add(2, "hours").format("DD MMMM,YY - hh:mm A"),
        shippedOrder: moment(order.estimated_date).subtract(2, "days").add(2, "hours").format("DD MMMM,YY"),
        deliveryOrder: moment(order.estimated_date).format("DD MMMM,YY"),
      };

      console.log(trackOrder);

      const data = {
        trackOrder: trackOrder,
        Order: order,
      };
      return successResponse(res, "successfully tracked", data);
    } catch (error) {
      console.log(error);
      return internalServerErrorResponse(res, error);
    }
  };
}

module.exports = OrderController;
