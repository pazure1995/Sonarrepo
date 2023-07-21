const express = require("express");
const user = require("./user.controller");
const authJwt = require("../../middlewares/authJwt");

const userRouter = express.Router();

userRouter.route("/signIn").post(user.signIn);
userRouter.route("/forgotPassword").post(user.forgotPassword);
userRouter.route("/resetPasswordById").post(user.resetPasswordById);

userRouter
  .route("/getUserInfoById")
  .post([authJwt.verifyToken], user.getUserInfo);
userRouter
  .route("/updateUserInfoById")
  .post([authJwt.verifyToken], user.updateUserInfo);

userRouter.route("/getAllUsers").post([authJwt.verifyToken], user.getAllUsers);
userRouter.route("/addUser").post([authJwt.verifyToken], user.addUser);
userRouter.route("/updateUser").post([authJwt.verifyToken], user.updateUser);
userRouter
  .route("/updateUserStatus")
  .post([authJwt.verifyToken], user.updateUserStatus);
userRouter
  .route("/getAllUsersByCompanyId")
  .post([authJwt.verifyToken], user.getAllUsersByCompanyId);

module.exports = userRouter;
