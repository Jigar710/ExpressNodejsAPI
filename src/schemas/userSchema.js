const Joi = require("joi");
const userSchema = Joi.object({
  firstName: Joi.string()
    .required()
    .regex(/^[A-Za-z]+$/)
    .max(30)
    .min(3)
    .messages({
      "any.required": `first name is required`,
      "string.pattern.base": `Only alphabets allowed.`,
    }),
  lastName: Joi.string()
    .required()
    .regex(/^[A-Za-z]+$/)
    .max(30)
    .min(3)
    .messages({
      "any.required": `last name is required`,
      "string.pattern.base": `Only alphabets allowed.`,
    }),
  username: Joi.string()
    .required()
    .regex(/^[A-Za-z0-9_-]*$/)
    .uppercase()
    .messages({
      "any.required": `username is required`,
      "string.pattern.base": `Only alphabeat and numbers are allowed.`,
    }),
  role: Joi.string().required().valid("Customer", "Seller").messages({
    "any.required": `role is required`,
    "string.pattern.base": `Only customer and seller are allowed for role`,
  }),
  password: Joi.string().required().max(50).min(4).messages({
    "any.required": `password is required`,
    "string.pattern.base": `password must be atleast 4 letter`,
  }),
  confirm_password: Joi.string().required().max(50).min(4),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .messages({
      "any.required": `email is required`,
      "string.pattern.base": `.com and .net are only allowed`,
    })
    .required(),
}).options({ abortEarly: false });

module.exports = userSchema;
