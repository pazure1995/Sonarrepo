const express = require("express");
const supportsRouter = express.Router();
const authJwt = require("../../middlewares/authJwt");
const supports = require("./supports.controller");

supportsRouter
  .route("/findAllSupports")
  .get([authJwt.verifyToken], supports.findAllSupports);

module.exports = supportsRouter;
