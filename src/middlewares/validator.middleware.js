const Joi = require("joi");
const { badRequestResponse } = require("../responses");

//* Include all validators
const Validators = require("../models/validators");

const validator = (validator) => {
  return async function (req, res, next) {
    try {
      if (!Validators.hasOwnProperty(validator)) {
        return badRequestResponse(res, `${validator}' validator is not exist`);
      }
      // console.log(req.body);
      const validated = await Validators[validator].validateAsync(req.body);
      req.body = validated;
      // console.log("data is validated");
      next();
    } catch (err) {
      if (err.isJoi) {
        return badRequestResponse(
          res,
          err?.details.map((data) => data?.message)
        );
      }
    }
  };
};
module.exports = validator;
