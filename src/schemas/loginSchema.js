const Joi = require("joi");
const loginSchema = Joi.object({
  username: Joi.string()
    .required()
    .regex(/^[A-Za-z0-9_-]*$/)
    .uppercase()
    .messages({
      "any.required": `username is required`,
      "string.pattern.base": `Only alphabeat and numbers are allowed.`,
    }),
  password: Joi.string().required().min(4).messages({
    "any.required": `password is required1`,
    "string.min": `password123`,
  }),
}).options({ abortEarly: false });

module.exports = loginSchema;
