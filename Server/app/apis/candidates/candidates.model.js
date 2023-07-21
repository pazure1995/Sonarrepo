const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const candidateSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      default: "",
    },
    jobId: {
      type: String,
      default: "",
    },
    clientName: {
      type: String,
      default: "",
    },
    skills: {
      type: Array,
      default: [""],
    },
    tags: {
      type: Array,
      default: "",
    },
    candidateInfo: {
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      email: {
        type: String,
      },
      phone: {
        type: String,
      },
    },
    expiryDate: {
      type: Date,
    },

    createdBy: {
      type: ObjectId,
    },
    updatedBy: {
      type: ObjectId,
    },
    testAssign: {
      type: ObjectId,
      ref: "assessments",
    },
    uniqueCode: {
      type: String,
      default: "",
    },
    testStatus: {
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
    deleted: {
      type: Boolean,
      default: false,
    },
    startTest: {
      started: Boolean,
      takes: Number,
    },
    companyInfo: {
      companyName: {
        type: String,
        default: "",
      },
      companyLogo: {
        type: String,
        default: "",
      },
      companyId: {
        type: String,
        default: "",
      },
      tenantId: {
        type: String,
        default: "",
      },
    },
    recruiterInfo: {
      firstName: {
        type: String,
        default: "",
      },
      lastName: {
        type: String,
        default: "",
      },
      email: {
        type: String,
        default: "",
      },
      recruiterId: {
        type: String,
        default: "",
      },
    },

    high5hireCandidateId: {
      type: String,
      default: "",
    },
    externalIdentifier: {
      type: String,
      default: "",
    },

    result: {
      type: Object,
      default: {},
    },

    takesForTest: {
      type: Number,
      default: 2,
    },
    createdAt: {
      type: Date,
    },
    createdFrom: {
      type: String,
      default: "",
    },
    updatedAt: {
      type: Date,
    },
    reminderEvents: {
      first: {
        type: Boolean,
        default: false,
      },
      second: {
        type: Boolean,
        default: false,
      },
      final: {
        type: Boolean,
        default: false,
      },
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("candidates", candidateSchema);
