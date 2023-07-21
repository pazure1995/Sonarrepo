const supportsSchema = require("./supports.modal");

exports.getAllSupports = async (req, res) => {
  try {
    let result = await supportsSchema.find();
    res.status(200).send(result);
  } catch (err) {
    console.log("Error Caught", err);
  }
};

exports.findAllSupports = async (req, res) => {
  try {
    let result = await supportsSchema.find();
    res.status(200).send(result);
  } catch (err) {
    console.log("Error Caught @support API", err);
  }
};
