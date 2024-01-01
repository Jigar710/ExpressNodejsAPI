const Joi = require("joi");
const login2Schema = Joi.object({
  mobileNo: Joi.string()
    .length(13)
    .regex(/^[0-9+]+$/)
    .required(),
  otp: Joi.number().min(4),
}).options({ abortEarly: false });

module.exports = login2Schema;
