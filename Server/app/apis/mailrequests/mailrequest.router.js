const express = require("express");
const mailrequest = require("./mailrequest.controller");
const authJwt = require("../../middlewares/authJwt");

const mailRequestRouter = express.Router();

mailRequestRouter
  .route("/getAllMailRequest")
  .post([authJwt.verifyToken], mailrequest.getAllMailRequest);

mailRequestRouter
  .route("/getAllMailSubjects")
  .post([authJwt.verifyToken], mailrequest.getAllMailSubjects);

module.exports = mailRequestRouter;
