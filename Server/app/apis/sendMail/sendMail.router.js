const express = require("express");
const sendMails = require("./sendMail.controller");
const authJwt = require("../../middlewares/authJwt");

const sendMailRouter = express.Router();

sendMailRouter.route("/send").post([authJwt.verifyToken], sendMails.sendMail);

sendMailRouter
  .route("/sendReminderMail")
  .post([authJwt.verifyToken], sendMails.sendReminderMail);

module.exports = sendMailRouter;
