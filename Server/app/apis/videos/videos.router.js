const express = require("express");
const video = require("./videos.controller");
const authJwt = require("../../middlewares/authJwt");
let uploadFile = require("../../middlewares/uploadVideos");
let upload = uploadFile.uploadFileMethod("videoContainer/");

const videoRouter = express.Router();

videoRouter.post("/storeVideo", upload.array("videos"), video.storeVideos);

videoRouter.get("/all", [authJwt.verifyToken], video.findAllVideos);

videoRouter.get("/:id", [authJwt.verifyToken], video.findOneVideo);

videoRouter.put("/updateVideo", video.updateVideos);

module.exports = videoRouter;
