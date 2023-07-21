const express = require("express");
const assessment = require("./assessments.controller");
const authJwt = require("../../middlewares/authJwt");

const assessmentRouter = express.Router();

assessmentRouter
  .route("/create")
  .post([authJwt.verifyToken], assessment.createAssessment);
assessmentRouter
  .route("/findAll")
  .post([authJwt.verifyToken], assessment.findAllAssessment);

assessmentRouter
  .route("/findByProjectId")
  .post([authJwt.verifyToken], assessment.findByProjectId);

assessmentRouter
  .route("/findAssessmentById")
  .post([authJwt.verifyToken], assessment.findAssessmentById);

assessmentRouter
  .route("/updateAssessment")
  .post([authJwt.verifyToken], assessment.updateAssessment);

assessmentRouter
  .route("/findQuestionsByAssessmentId")
  .post([authJwt.verifyToken], assessment.findQuestionsByAssessmentId);

module.exports = assessmentRouter;
