const db = require("../../models/index");
const { internalServerErrorResponse, successResponse, badRequestResponse } = require("../../responses");
//models
const Status = db.Status;
const User = db.User;
class StatusController {
  constructor() {}
  //coming soon, soldout, available
  addStatus = async (req, res) => {
    try {
      const { name } = req.body;
      const status = await Status.create({
        name: name,
      });
      return successResponse(res, "Status Successfully added", status);
    } catch (error) {
      console.log(error);
      return internalServerErrorResponse(res, error);
    }
  };

  updateStatus = async (req, res) => {
    try {
      const { id, name } = req.body;
      const status = await Status.findByPk(id);
      if (!status) {
        return badRequestResponse(res, "status doesn't exist");
      }

      const prepareUpdateData = { name: name };
      const prepareWhereClause = { where: { id: id } };

      await Status.update(prepareUpdateData, prepareWhereClause);
      return successResponse(res, "Status Successfully updated", status);
    } catch (error) {
      console.log(error);
      return internalServerErrorResponse(res, error);
    }
  };
  getAllStatus = async (req, res) => {
    try {
      const statuses = await Status.findAll();
      return successResponse(res, "successfully getting all statuses", statuses);
    } catch (error) {
      console.log(error);
      return internalServerErrorResponse(res, error);
    }
  };
  changeStatusOfUser = async (req, res) => {
    try {
      const { status, userId } = req.body;
      if (!["1", "2", "3"].includes(status)) {
        return badRequestResponse(res, "status is not valid");
      }
      await User.update(
        {
          status: status,
        },
        {
          where: {
            id: userId,
          },
        }
      );
      const data = await User.findByPk(userId);
      return successResponse(res, "Status successflly changed", data);
    } catch (error) {
      console.log(error);
      return internalServerErrorResponse(res, error);
    }
  };
}

module.exports = StatusController;
