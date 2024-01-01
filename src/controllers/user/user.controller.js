// Import statements
const db = require("../../models");
const bcrypt = require("bcryptjs");
const otpGenerator = require("otp-generator");

const { validatorService, jwtService } = require("../../services/index.service");
const { successResponse, internalServerErrorResponse, conflictErrorResponse, badRequestResponse, unauthorizedResponse } = require("../../responses");
const { paginate } = require("../../services/index.service");
const env = require("../../../envConfig");
const { options } = require("../../models/validators/login.validator");

// MODELS
const User = db.User;
const Userroles = db.Userroles;
const Role = db.Role;

/**
 * @group User management
 *
 * APIs for managing users
 */
class UserController {
  constructor() {}

  //this is for user resgistration
  /**
   * @group User management
   *
   * APIs for managing users
   */
  register = async (req, res, next) => {
    try {
      const imageType = req.file.mimetype;
      if (imageType !== "image/png" && imageType !== "image/jpg") {
        return res.status(200).json({
          status: "ok",
          statusCode: 409,
          isSuccess: false,
          message: "Please upload only jpg and png.",
          data: null,
        });
      }
      const { firstName, lastName, email, password, confirm_password, username, role, mobileNo } = req.body;
      // const results = validatorService.validator(
      //   {
      //     firstName: firstName,
      //     lastName: lastName,
      //     email: email,
      //     password: password,
      //     username: username,
      //     confirm_password: confirm_password,
      //     role: role,
      //   },
      //   res
      // );

      if (
        await User.findOne({
          where: { email: email },
        })
      ) {
        return conflictErrorResponse(res, "User with this email id already exist.");
      }
      if (
        await User.findOne({
          where: { username: username },
        })
      ) {
        return conflictErrorResponse(res, "User with this username already exist.");
      }
      if (password !== confirm_password) {
        return badRequestResponse(res, "Password and Confirm Password does not matched.");
      }
      const rolesObject = await Role.findAll({ attributes: ["role"] });
      const roles = rolesObject?.map((i) => i.dataValues.role);
      if (!roles.includes(role)) {
        return badRequestResponse(res, "Invalid Role");
      }

      var imageName = req.file.filename;
      const salt = await bcrypt.genSalt(10);
      const ecryptedPassword = await bcrypt.hash(password, salt);
      const createdUser = await User.create({
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: ecryptedPassword,
        username: username,
        photo: imageName,
        mobile_no: mobileNo,
      });
      const givenRole = await Role.findOne({
        where: {
          role: role,
        },
      });
      console.log({
        role_id: givenRole.id,
        user_id: createdUser.id,
      });
      const userRole = await Userroles.create({
        role_id: givenRole.id,
        user_id: createdUser.id,
      });
      console.log(req.file.path);
      const pathOfImage = req.file.path;
      return successResponse(res, "User has been successfully registered", {
        user: createdUser,
        imagePath: `${pathOfImage}`,
        userRole: userRole,
      });
    } catch (err) {
      console.log(err);
      return internalServerErrorResponse(res, err);
    }
  };

  mobileEntry = async (req, res) => {
    try {
      const { mobileNo } = req.body;
      const isUserExist = await User.findOne({
        where: { mobile_no: mobileNo },
      });
      if (isUserExist) {
        var otp = otpGenerator.generate(4, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
        console.log(otp);
        await User.update(
          {
            otp: otp,
          },
          {
            where: {
              mobile_no: mobileNo,
            },
          }
        );
      } else {
        return badRequestResponse(res, "Please first register with this number");
      }
      return successResponse(res, "successfully otp send", { otp: otp });
    } catch (error) {
      console.log(error);
      return internalServerErrorResponse(res, error);
    }
  };
  //For Login
  login = async (req, res, next) => {
    try {
      const { loginType } = req.body;
      if (loginType == "MOBILE") {
        const { mobileNo, otp } = req.body;
        const userExist = await User.findOne({
          where: {
            mobile_no: mobileNo,
          },
        });
        if (!userExist) {
          return badRequestResponse(res, "your mobile number is not exist i");
        }
        if (otp == userExist.otp) {
          const token = jwtService.getJwtToken(userExist);
          const refreshToken = await jwtService.getRefreshToken(userExist);
          console.log(refreshToken);
          console.log(token);
          let isAdmin = false;
          const userrole = await Role.findOne({
            include: [
              {
                model: Userroles,
                where: {
                  user_id: userExist.id,
                },
              },
            ],
            where: {
              role: "Admin",
            },
          });
          if (userrole) {
            isAdmin = true;
          }
          console.log({ userrole: userrole });
          await User.update(
            {
              otp: null,
            },
            {
              where: {
                mobile_no: mobileNo,
              },
            }
          );
          return successResponse(res, "User has been successfully login.", {
            user: userExist,
            isAdmin: isAdmin,
            token: token,
            refreshToken: refreshToken,
          });
        } else {
          return badRequestResponse(res, "otp is wrong");
        }
      } else {
        console.log("no");
        const { username, password } = req.body;
        const userExist = await User.findOne({
          where: {
            username: username,
          },
        });
        if (!userExist) {
          return unauthorizedResponse(res, "User doesn't exist");
        }
        const validPassword = await bcrypt.compare(password, userExist.password);

        if (validPassword) {
          const token = await jwtService.getJwtToken(userExist);
          const refreshToken = await jwtService.getRefreshToken(userExist);
          console.log(refreshToken);
          console.log("enter");
          console.log(token);
          // let isAdmin = false;
          // const userrole = await Role.findOne({
          //   include: [
          //     {
          //       model: Userroles,
          //       where: {
          //         user_id: userExist.id,
          //       },
          //     },
          //   ],
          //   where: {
          //     role: "Admin",
          //   },
          // });
          // if (userrole) {
          //   isAdmin = true;
          // }
          // console.log({ userrole: userrole });
          const user = await User.findOne({
            include: [
              {
                attributes: ["user_id"],
                model: Userroles,
                include: [
                  {
                    attributes: ["role"],
                    model: Role,
                  },
                ],
              },
            ],
            where: {
              id: userExist.id,
            },
          });
          return successResponse(res, "User has been successfully login.", {
            user: user,
            // isAdmin: isAdmin,
            token: token,
            refreshToken: refreshToken,
          });
        } else {
          return unauthorizedResponse(res, "Invalid credentials");
        }
      }
    } catch (error) {
      console.log(error);
      return internalServerErrorResponse(res, error);
    }
  };

  //Updating user details
  update = async (req, res) => {
    try {
      const { firstName, lastName, email, username } = req.body;
      const newdata = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        username: username,
      };
      newdata.updatedAt = new Date();
      await User.update(newdata, { where: { id: req.user.id } });
      return successResponse(res, "user details are successfully updated", null);
    } catch (error) {
      return internalServerErrorResponse(res, error);
    }
  };

  updateMyDetails = async (req, res) => {
    try {
      const { username, email, id } = req.body;
      const prepareUpdateData = {
        username: username,
        email: email,
      };
      const prepareWhereClause = {
        where: {
          id: id,
        },
      };
      await User.update(prepareUpdateData, prepareWhereClause);
      const user = await User.findByPk(id);
      return successResponse(res, "successfully changed your details", user);
    } catch (error) {
      console.log(error);
      return internalServerErrorResponse(res, error);
    }
  };

  getAllUsers = async (req, res) => {
    try {
      const data = await User.findAll();
      const users = await paginate(data, parseInt(req.query.page), parseInt(req.query.limit));
      return successResponse(res, "successfully getting all the users", users);
    } catch (error) {
      console.log(error);
      return internalServerErrorResponse(res, error);
    }
  };
}

module.exports = UserController;
