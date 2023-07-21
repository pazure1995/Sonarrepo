const express = require("express");
const QuestionRouter = express.Router();
const authJwt = require("../../middlewares/authJwt");
const question = require("./questions.controller");

QuestionRouter.route("/findAllQuestions").post(
  [authJwt.verifyToken],
  question.findAllQuestions
);

QuestionRouter.route("/findAllAssessmentQuestions").post(
  [authJwt.verifyToken],
  question.findAllAssessmentQuestions
);

QuestionRouter.route("/createQuestion").post(
  [authJwt.verifyToken],
  question.createQuestion
);

QuestionRouter.route("/updateQuestion").post(
  [authJwt.verifyToken],
  question.updateQuestion
);

QuestionRouter.route("/removeQuestion").post(
  [authJwt.verifyToken],
  question.removeQuestion
);

QuestionRouter.route("/removeMultipleQuestions").post(
  [authJwt.verifyToken],
  question.removeMultipleQuestions
);

module.exports = QuestionRouter;
