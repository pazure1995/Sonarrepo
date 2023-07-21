const axios = require("axios");
const assessmentSchema = require("../assessments/assessments.model");
const usersSchema = require("../user/user.model");
const mongoose = require("mongoose");
const questionSchema = require("../questions/questions.model");
const candidateSchema = require("../candidates/candidates.model");

exports.getAssessmentBasedOnSkills = async (req, res) => {
  try {
    let inputData = req.body;

    let superAdminData = await usersSchema.findOne({ role: "admin" });

    let query = {};
    query["questions"] = { $elemMatch: { skill: { $in: inputData.Skills } } };
    query["createdBy"] = superAdminData._id;

    let result = await assessmentSchema.aggregate([
      {
        $match: query,
      },
    ]);
    res.send({ count: result.length, data: result });
  } catch (err) {
    console.log("Error Caught".err);
  }
};

exports.createAssessment = async (req, res) => {
  try {
    let inputData = req.body;

    let questions = await questionSchema.find({
      skill: { $in: inputData.Skills },
      difficulty: inputData.Difficulty,
      type: inputData.AssessmentType,
    });
    let numberOfQuestions = 12 / inputData.Skills.length;

    let skills = {};
    questions.forEach((element) => {
      if (skills.hasOwnProperty(element.skill)) {
        skills[element.skill] = [...skills[element.skill], element];
      } else {
        skills[element.skill] = [element];
      }
    });
    let result = [];
    inputData.Skills.forEach((element) => {
      if (skills[element]) {
        if (skills[element].length > numberOfQuestions) {
          result = [...result, ...skills[element].slice(0, 4)];
        } else {
          result = [...result, ...skills[element]];
        }
      }
    });

    if (result.length > 0) {
      let assessmentParam = {
        testName: inputData.JobTitle,
        difficulty: inputData.Difficulty,
        testCategory: inputData.AssessmentType,
        skills: inputData.Skills,
        createdFrom: "High5hire",
        questions: result,
        details: {
          duration: inputData.Duration,
          passScore: inputData.PassingScore,
        },
      };
      let assessmentReq = new assessmentSchema(assessmentParam);
      assessmentReq.save().then((result) => {
        res.send(result);
      });
    }
  } catch (err) {
    console.log("Error Caught", err);
  }
};

exports.createCandidate = async (req, res) => {
  try {
    let inputData = req.body;

    let candidateParams = {
      jobTitle: inputData.jobTitle,
      candidateInfo: inputData.candidateInfo,
      expiryDate: inputData.expiryDate,
      createdBy: inputData.createdBy, ///  ObjectId
      updatedBy: inputData.updatedBy,
      createdFrom: inputData.createdFrom, ///  ObjectId
      testAssign: inputData.testAssign,
      uniqueCode: inputData.uniqueCode, //create a unigue code   use uuid
      testStatus: inputData.testStatus,
      reviewer: inputData.reviewer,
      startTest: {
        takes: 0,
      },
      companyInfo: inputData.companyInfo,
      recruiterInfo: inputData.recruiterInfo,
    };

    let candidateReq = new candidateSchema(candidateParams);
    candidateReq.save().then((result) => {
      res.send(result);
    });
  } catch (err) {
    console.log("Error Caught", err);
    return res.status(500).send({
      message: "Some error has occurred, please try again later",
    });
  }
};

exports.vettingDetailsUpdateStatus = async (req, res) => {
  try {
    axios
      .post(
        `${process.env.BASE_URL_H5H_API}/vetIntegration/candidate/updateStatus`,
        req.body
      )
      .then((response) => {
        res.send("Status updated successfully");
      })
      .catch((err) => console.log({ error: err }));
  } catch (err) {
    console.log("Error Caught", err);
    return res.status(500).send({
      message: "Some error has occurred, please try again later",
    });
  }
};

exports.getAssessmentForInterview = async (req, res) => {
  try {
    const { testCategory } = req.body;

    let superAdminData = await usersSchema.findOne({ role: "admin" });

    let query = {};

    query["createdBy"] = superAdminData._id;

    query["testCategory"] = testCategory;

    let result = await assessmentSchema.aggregate([
      {
        $match: query,
      },
    ]);
    res.send(result);
  } catch (err) {
    console.log("Error Caught".err);
  }
};
