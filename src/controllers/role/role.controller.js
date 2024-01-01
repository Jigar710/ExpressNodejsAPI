//imports
const db = require("../../models");

const {
  successResponse,
  badRequestResponse,
  internalServerErrorResponse,
} = require("../../responses");

//model
const Role = db.Role;

class RoleController {
  constructor() {}
  //This is for admin for adding new role
  addRole = async (req, res, next) => {
    try {
      const { name } = req.body;
      const role = await Role.create({
        role: name,
      });
      if (role) {
        return successResponse(
          res,
          "Role has been successfully registered",
          role
        );
      } else {
        return badRequestResponse(res, "role is not created");
      }
    } catch (err) {
      console.log(err);
      return internalServerErrorResponse(res, err);
    }
  };
}

module.exports = RoleController;
