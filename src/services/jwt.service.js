const jwt = require("jsonwebtoken");
const env = require("../../envConfig");
const getJwtToken = (user) => {
  // console.log({ user: user });

  const token = jwt.sign({ id: user.id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRY,
  });
  return token;
};

const getRefreshToken = async (user) => {
  const refreshToken = jwt.sign({ id: user.id, email: user.email }, env.JWT_SECRET, {
    expiresIn: "30d",
  });
  return refreshToken;
};

const isTokenExpired = (token) => {
  const payloadBase64 = token.split(".")[1];
  const decodedJson = Buffer.from(payloadBase64, "base64").toString();
  const decoded = JSON.parse(decodedJson);
  const exp = decoded.exp;
  const expired = Date.now() >= exp * 1000;
  return expired;
};

module.exports = {
  getJwtToken,
  getRefreshToken,
  isTokenExpired,
};
