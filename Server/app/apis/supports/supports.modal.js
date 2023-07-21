const mongoose = require("mongoose");
const supportsSchema = new mongoose.Schema(
  {
    supportQue: {
      type: String,
      default: "",
    },
    supportAns: {
      type: String,
      default: "",
    },
    supportQueNo: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("supports", supportsSchema);
