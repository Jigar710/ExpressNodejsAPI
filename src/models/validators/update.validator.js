const Joi = require("joi");
const updateSchema = Joi.object({
  username: Joi.string()
    .required()
    .regex(/^[A-Za-z0-9_-]*$/)
    .messages({
      "any.required": `username is required`,
      "string.pattern.base": `Only alphabeat and numbers are allowed.`,
    }),
  id: Joi.string().uuid().required().messages({
    "any.required": `id is required`,
    "string.guid": `please give valid uuid`,
  }),
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

module.exports = updateSchema;
