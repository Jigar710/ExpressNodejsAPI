const jwt = require("jsonwebtoken");
const clc = require("cli-color");
const env = require("../../envConfig");
const { internalServerErrorResponse, badRequestResponse, successResponse } = require("../responses");

const { jwtService } = require("../services/index.service");
const isLoggedIn = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV == "development") {
      req.user = { id: "cb583f85-6002-4b82-a9e6-0cf4e433a460" };
      next();
    } else {
      const token = req.headers["authorization"] || req.body.token || req.query.token;
      console.log(token);
      if (token == undefined) {
        return badRequestResponse(res, "Please login first");
      }
      if (jwtService.isTokenExpired(token)) {
        const refreshToken = req.headers["refreshtoken"] || req.body.refreshToken;
        const decoded = jwt.verify(refreshToken, env.JWT_SECRET);
        const newToken = jwtService.getJwtToken(decoded);
        const f = jwtService.isTokenExpired(newToken);
        return successResponse(res, "Valid token is generated", {
          token: newToken,
        });
      } else {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        console.log(token);
        if (decoded) {
          req.user = decoded;
          console.log("Your token is valid& you can allow to access this route.");
          next();
        } else {
          return badRequestResponse(res, "Please login first");
        }
      }
    }
  } catch (error) {
    console.log(error);
    return internalServerErrorResponse(res, error);
  }
};

module.exports = isLoggedIn;
