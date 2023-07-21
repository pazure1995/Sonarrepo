const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

var UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    address: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    zipCode: {
      type: Number,
      default: null,
    },
    state: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
    companyName: {
      type: String,
      default: "",
    },
    companyId: {
      type: String,
      default: "",
    },
    companyLogo: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "user",
    },
    subRole: {
      type: String,
      default: "",
    },
    email: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    password: {
      type: String,
    },
    uStatus: {
      type: String,
    },
    token: {
      type: String,
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

module.exports = mongoose.model("users", UserSchema);
