const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;
const mailRequestSchema = new mongoose.Schema(
  {
    mailFrom: {
      type: String,
    },
    mailTo: {
      type: String,
    },
    mailSubject: {
      type: String,
      required: true,
    },
    mailContent: {
      type: String,
    },
    mStatus: {
      type: Number,
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

module.exports = mongoose.model("mailrequests", mailRequestSchema);
