const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const projectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      default: "",
    },
    owner: {
      firstName: {
        type: String,
        default: "",
      },
      lastName: {
        type: String,
        default: "",
      },
      id: {
        type: String,
        default: "",
      },
    },
    tests: {
      type: Array,
      default: [],
    },
    description: {
      type: String,
      default: "",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: ObjectId,
      ref: "users",
    },
    updatedBy: {
      type: ObjectId,
      ref: "users",
    },
    createdAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("projects", projectSchema);
