require("dotenv").config();
const env = {
  JWT_SECRET:
    process.env.NODE_ENV == "development"
      ? process.env.JWT_SECRET_DEV
      : process.env.NODE_ENV == "production"
      ? process.env.JWT_SECRET_PRO
      : process.env.JWT_SECRET_TEST,

  JWT_EXPIRY:
    process.env.NODE_ENV == "development"
      ? process.env.JWT_EXPIRY_DEV
      : process.env.NODE_ENV == "production"
      ? process.env.JWT_EXPIRY_PRO
      : process.env.JWT_EXPIRY_TEST,

  PORT:
    process.env.NODE_ENV == "development"
      ? process.env.PORT_DEV
      : process.env.NODE_ENV == "production"
      ? process.env.PORT_PRO
      : process.env.PORT_TEST,
};
module.exports = env;
