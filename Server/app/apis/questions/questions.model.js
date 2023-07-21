const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

var questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "",
    },
    difficulty: {
      type: String,
      default: "",
    },
    answer: {
      type: Array,
      default: [],
    },
    options: {
      type: Array,
      default: [],
    },
    skill: {
      type: String,
      default: "",
    },

    duration: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
    },

    // createdBy: {
    //   id: {
    //     type: String,
    //     default: "",
    //   },
    //   firstName: {
    //     type: String,
    //     default: "",
    //   },
    //   lastName: {
    //     type: String,
    //     default: "",
    //   },
    //   role: {
    //     type: String,
    //     default: "",
    //   },
    //   companyId: {
    //     type: String,
    //     default: "",
    //   },
    //   projectId: {
    //     type: String,
    //     default: "",
    //   },
    // },
    // modifiedBy: {
    //   id: {
    //     type: ObjectId,
    //   },
    //   firstName: {
    //     type: String,
    //     default: "",
    //   },
    //   lastName: {
    //     type: String,
    //     default: "",
    //   },
    //   role: {
    //     type: String,
    //     default: "",
    //   },
    //   companyId: {
    //     type: String,
    //     default: "",
    //   },
    //   projectId: {
    //     type: String,
    //     default: "",
    //   },
    // },

    createdBy: {
      type: ObjectId,
      ref: "users",
    },
    updatedBy: {
      type: ObjectId,
      ref: "users",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    remark: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("questions", questionSchema);
