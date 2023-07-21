const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const mailTemplateSchema = new mongoose.Schema(
  {
    mailType: {
      type: String,
    },

    mailBody: {
      type: String,
    },
    mailSubject: {
      type: String,
    },
    createdAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
    },
    createdBy: {
      type: ObjectId,
      ref: "users",
    },
    updatedBy: {
      type: ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("mailtemplates", mailTemplateSchema);
