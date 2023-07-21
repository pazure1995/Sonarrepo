const express = require("express");
const high5hire = require("./high5hire.controller");
const authJwt = require("../../middlewares/authJwt");

const high5router = express.Router();

high5router.route("/getAssessments").post(high5hire.getAssessmentBasedOnSkills);
high5router.route("/createAssessment").post(high5hire.createAssessment);
high5router.route("/inviteCandidate").post(high5hire.createCandidate);
high5router
  .route("/vettingDetailsUpdateStatus")
  .post(high5hire.vettingDetailsUpdateStatus);

high5router
  .route("/getAssessmentForInterview")
  .post(high5hire.getAssessmentForInterview);

module.exports = high5router;
