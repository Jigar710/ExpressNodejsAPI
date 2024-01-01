const moment = require("moment");
const db = require("../../models/index");
const { internalServerErrorResponse, successResponse, badRequestResponse } = require("../../responses");

//models
const PaymentCards = db.PaymentCards;

class PaymentCardsController {
  constructor() {}
  addPayment = async (req, res) => {
    try {
      const { name, cardNo, expireDate, cvv } = req.body;
      const currentYear = moment().format("YY");
      const currentMonth = moment().format("MM");
      const exYear = expireDate.slice(3);
      const exMonth = expireDate.slice(0, 2);
      if (currentYear > exYear) {
        return badRequestResponse(res, "your card has been expired.");
      } else {
        if (exYear == currentYear) {
          if (exMonth < currentMonth) {
            return badRequestResponse(res, "your card has been expired.");
          }
        }
      }
      const prepareCreateData = {
        user_id: req.user.id,
        card_holder_name: name,
        card_no: cardNo,
        expire_date: expireDate,
        cvv: cvv,
      };
      //   const card = await PaymentCards.create(prepareCreateData);
      return successResponse(res, "successfully card added");
    } catch (error) {
      console.log(error);
      return internalServerErrorResponse(res, error);
    }
  };
  editPaymentcard = async (req, res) => {
    try {
      const { id, name, cardNo, expireDate, cvv } = req.body;
      const currentYear = moment().format("YY");
      const currentMonth = moment().format("MM");
      const exYear = expireDate.slice(3);
      const exMonth = expireDate.slice(0, 2);
      if (currentYear > exYear) {
        return badRequestResponse(res, "your card has been expired.");
      } else {
        if (exYear == currentYear) {
          if (exMonth < currentMonth) {
            return badRequestResponse(res, "your card has been expired.");
          }
        }
      }
      const prepareUpdateData = {
        card_holder_name: name,
        card_no: cardNo,
        expire_date: expireDate,
        cvv: cvv,
      };
      const prepareWhereClause = {
        where: {
          id: id,
        },
      };
      await PaymentCards.update(prepareUpdateData, prepareWhereClause);
      const paymentCards = PaymentCards.findAll({
        where: {
          user_id: req.user.id,
        },
      });
      return successResponse(res, "successfully edited your details", paymentCards);
    } catch (error) {
      console.log(error);
      return internalServerErrorResponse(res, error);
    }
  };

  deletePaymentCard = async (req, res) => {
    try {
      const id = req.params.paymentCardId;
      await PaymentCards.destroy({
        where: { id: id },
      });
      const paymentCards = PaymentCards.findAll({
        where: {
          user_id: req.user.id,
        },
      });
      return successResponse(res, "successfully deleted", paymentCards);
    } catch (error) {
      console.log(error);
      return internalServerErrorResponse(res, error);
    }
  };
  getPaymentCard = async (req, res) => {
    try {
      const prepareWhereClause = {
        where: {
          user_id: req.user.id,
        },
      };
      const paymentCards = await PaymentCards.findAll(prepareWhereClause);
      return successResponse(res, "successfuly getting all the cards", paymentCards);
    } catch (error) {
      console.log(error);
      return internalServerErrorResponse(res, error);
    }
  };
}

module.exports = PaymentCardsController;
