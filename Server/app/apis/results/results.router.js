const express = require("express");
const results = require("./results.controller");
const authJwt = require("../../middlewares/authJwt");

const resultRouter = express.Router();

resultRouter.route("/create").post(results.createResult);
resultRouter
  .route("/findResults")
  .post([authJwt.verifyToken], results.findResults);
resultRouter
  .route("/findResultByAssessmentId")
  .post([authJwt.verifyToken], results.findResultByAssessmentId);
resultRouter
  .route("/findLatestResults")
  .post([authJwt.verifyToken], results.findLatestResults);

resultRouter
  .route("/findResultByCandidateId")
  .post(results.findResultByCandidateId);

resultRouter
  .route("/findResultsCount")
  .post([authJwt.verifyToken], results.findResultsCount);
resultRouter
  .route("/updateResultByCandidateId")
  .post(results.updateResultByCandidateId);

module.exports = resultRouter;
