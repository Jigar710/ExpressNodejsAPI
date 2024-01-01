const Joi = require("joi");
const loginSchema = Joi.object({
  username: Joi.string()
    .regex(/^[A-Za-z0-9_-]*$/)
    .messages({
      "any.required": `username is required`,
      "string.pattern.base": `Only alphabeat and numbers are allowed.`,
    }),
  password: Joi.string().min(4).required().messages({
    "any.required": `password is required`,
    "string.min": `password must have atleast 4 characters`,
  }),
}).options({ abortEarly: false });

module.exports = loginSchema;
