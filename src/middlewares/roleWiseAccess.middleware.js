const db = require("../models");
const { internalServerErrorResponse } = require("../responses");
const Role = db.Role;

//this will allow role for access which will give in parameter
const roleWiseAccess = (...roles) => {
  return async (req, res, next) => {
    try {
      if (process.env.NODE_ENV == "development" || process.env.NODE_ENV == "production") {
        next();
      } else {
        const userRoleObject = await db.Userroles.findOne({
          where: { user_id: req.user.id },
        });
        const roleOfUser = await Role.findOne({
          where: { id: userRoleObject.role_id },
        });
        if (!roles.includes(roleOfUser.dataValues.role)) {
          return res.status(400).json({
            success: false,
            message: `You are not eligble, so that you are not allowed for this resource.`,
          });
        } else {
          next();
        }
      }
    } catch (error) {
      return internalServerErrorResponse(res, error);
    }
  };
};

module.exports = roleWiseAccess;
