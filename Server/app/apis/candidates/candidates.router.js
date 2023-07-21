const express = require("express");
const candidates = require("./candidates.controller");
const authJwt = require("../../middlewares/authJwt");

const candidateRouter = express.Router();

candidateRouter
  .route("/create")
  .post([authJwt.verifyToken], candidates.createCandidate);

candidateRouter
  .route("/findAllCandidates")
  .post([authJwt.verifyToken], candidates.getAllCandidates);

candidateRouter
  .route("/findCandidateByUniqueId")
  .post(candidates.findCandidateByUniqueId);
candidateRouter
  .route("/findCandidateByAssessmentId")
  .post([authJwt.verifyToken], candidates.findCandidateByAssessmentId);

candidateRouter.route("/updateCandidate").post(candidates.updateCandidate);

module.exports = candidateRouter;
