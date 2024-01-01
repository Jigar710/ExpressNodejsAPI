const Joi = require("joi");
const cartSchema = Joi.object({
  quantity: Joi.allow(),
  weight: Joi.allow(),
  color: Joi.allow(),
  size: Joi.allow(),
  productSellerId: Joi.string().uuid().required().messages({
    "any.required": `productSellerId is required`,
    "string.guid": `please enter proper uuid of productSellerId`,
  }),
}).options({ abortEarly: false });

module.exports = cartSchema;
