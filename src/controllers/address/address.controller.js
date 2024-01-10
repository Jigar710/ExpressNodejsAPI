const db = require("../../models");
const { internalServerErrorResponse, successResponse, badRequestResponse } = require("../../responses");

//models
const Address = db.Address;

class AddressController {
  constructor() {}
  addAdress = async (req, res) => {
    try {
      const { title, line1, line2, city, pincode } = req.body;
      const prepareData = {
        title: title,
        line1: line1,
        line2: line2,
        city: city,
        pincode: pincode,
        user_id: req.user.id,
      };
      const address = await Address.create(prepareData);
      return successResponse(res, "successfully added your address", address);
    } catch (error) {
      console.log(error);
      return internalServerErrorResponse(res);
    }
  };

  deleteAddress = async (req, res) => {
    try {
      const addressId = req.params.addressId;
      const address = await Address.findByPk(addressId);
      if (address.user_id != req.user.id) {
        return badRequestResponse(res, "this address is not yours");
      }
      await Address.destroy({ where: { id: addressId } });
      const addresses = await Address.findAll({
        where: {
          user_id: req.user.id,
        },
      });
      return successResponse(res, "successfully deleted address", addresses);
    } catch (error) {
      console.log(error);
      return internalServerErrorResponse(res, error);
    }
  };

  editAddress = async (req, res) => {
    try {
      const { id, title, line1, line2, city, pincode } = req.body;
      const address = await Address.findByPk(id);
      if (address.user_id != req.user.id) {
        return badRequestResponse(res, "this address is not yours");
      }
      const prepareUpdateData = {
        title: title,
        line1: line1,
        line2: line2,
        city: city,
        pincode: pincode,
      };
      await Address.update(prepareUpdateData, { where: { id: id } });
      const addresses = await Address.findAll({ where: { user_id: req.user.id } });
      return successResponse(res, "successfully edit address", addresses);
    } catch (error) {
      console.log(error);
      return internalServerErrorResponse(res, error);
    }
  };

  getAddresses = async (req, res) => {
    try {
      const addresses = await Address.findAll({ where: { user_id: req.user.id } });
      return successResponse(res, "successfully getting all the addresses", addresses);
    } catch (error) {
      console.log(error);
      return internalServerErrorResponse(res, error);
    }
  };
}
module.exports = AddressController;
