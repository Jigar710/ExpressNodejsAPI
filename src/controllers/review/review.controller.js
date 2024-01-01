const { internalServerErrorResponse, successResponse, badRequestResponse } = require("../../responses");
const db = require("../../models/index");

//models
const Review = db.Review;
const Product = db.Product;

class ReviewController {
  constructor() {}
  addReview = async (req, res) => {
    try {
      const { product_id, review, rating } = req.body;
      const createdReview = await Review.create({
        review: review,
        rating: rating,
        user_id: req.user.id,
        product_id: product_id,
      });
      return successResponse(res, "review added", createdReview);
    } catch (error) {
      console.log(error);
      return internalServerErrorResponse(res, error);
    }
  };

  getReviewOfProduct = async (req, res) => {
    try {
      const id = req.params.productID;
      const reviews = await Product.findAll({
        include: Review,
        where: {
          id: id,
        },
      });
      return successResponse(res, "review added", reviews);
    } catch (error) {
      console.log(error);
      return internalServerErrorResponse(res, error);
    }
  };

  deleteReview = async (req, res) => {
    try {
      const id = req.params.reviewID;
      const pastData = await Review.findByPk(id);
      if (pastData == undefined) {
        return badRequestResponse(res, "review doesn't exist.");
      }
      if (pastData.user_id != req.user.id) {
        return badRequestResponse(res, "this review isn't yours. ");
      }
      await Review.destroy({
        where: {
          id: id,
        },
      });
      return successResponse(res, "review deleted", pastData);
    } catch (error) {
      console.log(error);
      return internalServerErrorResponse(res, error);
    }
  };
}

module.exports = ReviewController;
