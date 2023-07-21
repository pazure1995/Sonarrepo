const express = require("express");
const skill = require("./skills.controller");
const authJwt = require("../../middlewares/authJwt");

const skillRouter = express.Router();

skillRouter.route("/addSkill").post([authJwt.verifyToken], skill.addSkills);
skillRouter
  .route("/findAllSkills")
  .post([authJwt.verifyToken], skill.findAllSkills);

module.exports = skillRouter;
