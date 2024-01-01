const Joi = require("joi");
const productSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": `name is required`,
  }),
  small_desc: Joi.string().required().messages({
    "any.required": `small description is required.`,
  }),
  long_desc: Joi.string().min(20).messages({
    "string.min": `long description must have atleast 20 letters`,
  }),
  status_id: Joi.string().messages({
    "any.required": `status id is required`,
  }),
  id: Joi.string(),
  categories: Joi.allow(),
  image: Joi.allow(),
}).options({ abortEarly: false });

module.exports = productSchema;
