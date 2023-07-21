const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const resultSchema = new mongoose.Schema(
  {
    jobId: {
      type: String,
      default: "",
    },
    jobTitle: {
      type: String,
      default: "",
    },
    tags: {
      type: Array,
      default: "",
    },
    skills: {
      type: Array,
      default: "",
    },

    candidateId: {
      type: ObjectId,
      ref: "candidates",
    },
    testStatus: {
      type: String,
      default: "",
    },
    high5hireCandidateId: {
      type: String,
      default: "",
    },
    reviewer: {
      firstName: {
        type: String,
        default: "",
      },
      lastName: {
        type: String,
        default: "",
      },
      reviewerEmail: {
        type: String,
        default: "",
      },
      instructions: {
        type: String,
        default: "",
      },
    },
    candidateInfo: {
      type: Object,
      default: {},
    },
    companyInfo: {
      type: Object,
      default: {},
    },
    externalIdentifier: {
      type: String,
      default: "",
    },
    questions: {
      type: Array,
      default: [],
    },
    testAssign: {
      type: Object,
      default: {},
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    isReviewed: {
      type: Boolean,
      default: false,
    },
    isRecommended: {
      type: Boolean,
      default: null,
    },
    feedback: {
      type: String,
      default: "",
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

module.exports = mongoose.model("results", resultSchema);
