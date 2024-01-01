const Joi = require("joi");
const categorySchema = Joi.object({
  name: Joi.string().required().min(3).messages({
    "any.required": `category name is required`,
    "string.min": `category name must have atleast 3 characters`,
  }),
  small_desc: Joi.string().required().min(4).messages({
    "any.required": `small description of category is always required.`,
    "string.min": `long description must have atleast 4 letters`,
  }),
  long_desc: Joi.string().min(20).messages({
    "string.min": `long description must have atleast 20 letters`,
  }),
  id: Joi.string(),
}).options({ abortEarly: false });

module.exports = categorySchema;
