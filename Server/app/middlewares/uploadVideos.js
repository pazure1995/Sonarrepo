const multer = require("multer");
const fs = require("fs");
class uploadAzureVideo {
  uploadFileMethod(folderName) {
    this.folderName = "videoContainer/";
    let selt = this;

    let storage = multer.diskStorage({
      destination: (req, file, cb) => {
        const dir = "./videoContainer";
        fs.exists(dir, (exist) => {
          if (!exist) {
            return fs.mkdir(dir, (error) => cb(error, dir));
          }
          return cb(null, dir);
        });
      },
      filename: (req, file, cb) => {
        cb(
          null,
          file.fieldname +
            "-" +
            Date.now() +
            "." +
            file.originalname.split(".")[
              file.originalname.split(".").length - 1
            ]
        );
      },
    });
    return multer({
      storage: storage,
      // limits: { fileSize: 1024 * 1024 * 201 },
      fileFilter: function (req, file, cb) {
        if (
          file.mimetype === "video/quicktime" ||
          file.mimetype === "video/avi" ||
          file.mimetype === "video/x-flv" ||
          file.mimetype === "video/mp4"
        )
          return cb(null, true);

        cb(
          JSON.stringify({
            code: 500,
            success: false,
            message:
              "Invalid file type. Only quicktime, avi, flx, mp4 video files are allowed.",
          }),
          false
        );
      },
    });
  }
}
module.exports = new uploadAzureVideo();
