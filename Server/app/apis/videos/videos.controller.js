const Video = require("./videos.model");
const mongoose = require("mongoose");
let Vimeo = require("vimeo").Vimeo;
var fs = require("fs");
const chokidar = require("chokidar");
require("dotenv/config");

let client = new Vimeo(
  process.env.VIMEO_CLIENT_ID,
  process.env.VIMEO_CLIENT_SECRET,
  process.env.VIMEO_ACCESS_TOKEN
);

exports.storeVideos = async (req, res) => {
  //   if (!req.body.candidateId) {
  //     res.status(400).send({ message: "Content can not be empty!" });
  //     return;
  //   }

  //   if (!req.body.testId) {
  //     res.status(400).send({ message: "Content can not be empty!" });
  //     return;
  //   }

  //   if (!req.files) {
  //     res.status(400).send({ message: "Content can not be empty!" });
  //     return;
  //   }

  const video = new Video({
    candidateId: req.body.candidateId,
    testId: req.body.testId,
    questionId: req.body.questionId,
    videoUrl: req.files[0].filename,
  });
  video
    .save(video)
    .then((data) => {
      // res.send(data);
      const watcher = chokidar.watch(`videoContainer/${data.videoUrl}`, {
        persistent: false,
        ignoreInitial: false,
      });
      watcher.on("add", (path) => {
        let file_name = path;
        client.upload(
          file_name,
          {
            name: "Untitled",
            description: "The description goes here.",
          },
          (uri) => {
            client.request(
              uri + "?fields=link",
              (error, body, statusCode, headers) => {
                if (error) {
                  console.log("There was an error making the request.");
                  console.log("Server reported: " + error);
                  return;
                }
                let result_Id = data._id
                  .toString()
                  .replace(/ObjectId\("(.*)"\)/, "$1");
                Video.findByIdAndUpdate(
                  result_Id,
                  { videoUrl: body.link },
                  (err, docs) => {
                    if (err) {
                      console.log(err);
                    } else {
                      fs.unlinkSync(file_name);
                      res.send({
                        message: "video uploaded on vimeo...!!!",
                        videoUrl: body.link,
                      });
                    }
                  }
                );
              }
            );
          },
          (bytes_uploaded, bytes_total) => {
            var percentage = ((bytes_uploaded / bytes_total) * 100).toFixed(2);
            console.log(bytes_uploaded, bytes_total, percentage + "%");
          },
          (error) => {
            console.log("Failed because: " + error);
            res.send(error);
          }
        );
        // res.send({ data: data });
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while storing the videos",
      });
    });
};

exports.findAllVideos = (req, res) => {
  Video.find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Videos.",
      });
    });
};

exports.findOneVideo = (req, res) => {
  const id = req.params.id;
  Video.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Video with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error retrieving Video with id=" + id });
    });
};

exports.updateVideos = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }
  const id = req.params.id;
  Video.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Video with id=${id}. Maybe Video was not found!`,
        });
      } else res.send({ message: "Video was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Video with id=" + id,
      });
    });
};
