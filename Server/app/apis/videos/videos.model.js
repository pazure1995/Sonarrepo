const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const videoSchema = new mongoose.Schema(
  {
    candidateId: {
      type: ObjectId,
    },
    testId: {
      type: ObjectId,
    },
    questionId: {
      type: ObjectId,
    },
    videoUrl: {
      type: String,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("videos", videoSchema);
