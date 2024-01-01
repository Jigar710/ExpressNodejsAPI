const otpGenerator = require("otp-generator");
const moment = require("moment");
const db = require("../../models/index");

const { internalServerErrorResponse, successResponse, badRequestResponse } = require("../../responses");
const paginate = require("../../services/paginate.service");
//models
const Coupon = db.Coupon;
// status:
// 1:Active for all
// 2.Active
// 3.Deactive
class CouponController {
  constructor() {}
  addCoupon = async (req, res) => {
    try {
      const { name, percentage, discount, term_condition, expire_in, status } = req.body;
      console.log(req.body);
      const prepareCreateData = {
        redeem_code: otpGenerator.generate(20, { upperCaseAlphabets: false, lowerCaseAlphabets: true, specialChars: false }),
        name: name,
        percentage: percentage,
        discount: discount,
        term_condition: term_condition,
        expire_date: moment(moment()).add(parseInt(expire_in), "days"),
        status: status,
      };
      const coupon = await Coupon.create(prepareCreateData);
      return successResponse(res, "successfully added coupon", coupon);
    } catch (error) {
      console.log(error);
      return internalServerErrorResponse(res, error);
    }
  };

  deleteCoupon = async (req, res) => {
    try {
      const couponId = req.params.couponId;
      const { page, limit } = req.query;

      const coupon = await Coupon.findByPk(couponId);
      console.log(coupon);
      if (!coupon) {
        return badRequestResponse(res, "coupon is not exist");
      }
      await Coupon.destroy({ where: { id: couponId } });
      let coupons = await Coupon.findAll();
      coupons = await paginate(coupons, page, limit);
      return successResponse(res, "successfully deleted coupon", coupons);
    } catch (error) {
      console.log(error);
      return internalServerErrorResponse(res, error);
    }
  };

  editCoupon = async (req, res) => {
    try {
      const { id, name, percentage, discount, term_condition, expire_in, status } = req.body;
      console.log(req.body);
      const { page, limit } = req.query;
      const prepareUpdateData = {
        name: name,
        percentage: percentage,
        discount: discount,
        term_condition: term_condition,
        expire_date: moment(moment()).add(parseInt(expire_in), "days"),
        status: parseInt(status),
      };
      const prepareWhereClause = {
        where: {
          id: id,
        },
      };
      await Coupon.update(prepareUpdateData, prepareWhereClause);
      let coupons = await Coupon.findAll();
      coupons = await paginate(coupons, page, limit);
      return successResponse(res, "successfully edited coupon", coupons);
    } catch (error) {
      console.log(error);
      return internalServerErrorResponse(res, error);
    }
  };
  getAllCouponsForUser = async (req, res) => {
    try {
      const { page, limit } = req.query;
      let coupons = await Coupon.findAll();
      coupons = await paginate(coupons, page, limit);
      return successResponse(res, "successfully getting data", coupons);
    } catch (error) {
      console.log(error);
      return internalServerErrorResponse(res, error);
    }
  };
  getCoupons = async (req, res) => {
    try {
      let coupons = await Coupon.findAll({
        where: {
          status: 1,
        },
      });
      return successResponse(res, "successfully getting data", coupons);
    } catch (error) {
      console.log(error);
      return internalServerErrorResponse(res, error);
    }
  };
}

module.exports = CouponController;
