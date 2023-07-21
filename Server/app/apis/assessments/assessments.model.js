const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const assessmentSchema = new mongoose.Schema(
  {
    testName: {
      type: String,
      default: "",
    },
    difficulty: {
      type: String,
      default: "",
    },
    skills: {
      type: Array,
      default: "",
    },
    testCategory: {
      type: String,
      default: "",
    },
    createdFrom: {
      type: String,
      default: "",
    },
    projects: {
      type: Array,
      default: [],
    },
    questions: {
      type: Array,
      default: [],
    },
    details: {
      duration: {
        type: String,
        default: "",
      },
      passScore: {
        type: String,
        default: "",
      },
      qRandom: {
        type: Boolean,
        default: false,
      },
      oRandom: {
        type: Boolean,
        default: false,
      },
      numberOfQtoAppear: {
        type: Number,
        default: 999999999999,
      },
    },
    completed: {
      type: Boolean,
      default: false,
    },
    invited: {
      type: Boolean,
      default: false,
    },
    expiryDate: {
      type: Date,
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

module.exports = mongoose.model("assessments", assessmentSchema);
