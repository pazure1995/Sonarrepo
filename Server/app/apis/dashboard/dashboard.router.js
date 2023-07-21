const express = require("express");
const dashboardRouter = express.Router();
const authJwt = require("../../middlewares/authJwt");
const dashboard = require("./dashboard.controller");

dashboardRouter
  .route("/getDashboardData")
  .post([authJwt.verifyToken], dashboard.getDashboardData);

module.exports = dashboardRouter;
