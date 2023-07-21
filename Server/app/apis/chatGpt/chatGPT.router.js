const express = require("express");
const chatRouter = express.Router();
//const authJwt = require("../../middlewares/authJwt");
const chat = require("./chatGPT.controller");

chatRouter.route("/chat").post(chat.chatGPT);

module.exports = chatRouter;
