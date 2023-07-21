const express = require("express");
const projects = require("./projects.controller");
const authJwt = require("../../middlewares/authJwt");

const projectRouter = express.Router();

projectRouter
  .route("/create")
  .post([authJwt.verifyToken], projects.createProject);
projectRouter
  .route("/getAllProjects")
  .post([authJwt.verifyToken], projects.getAllProjectsByCompanyId);
projectRouter
  .route("/updateProject")
  .post([authJwt.verifyToken], projects.updateProject);
projectRouter
  .route("/findAllProjects")
  .post([authJwt.verifyToken], projects.findAllProjects);

module.exports = projectRouter;
