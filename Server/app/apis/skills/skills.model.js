const mongoose = require("mongoose");

var skillsSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
    },
    createdAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("skills", skillsSchema);
