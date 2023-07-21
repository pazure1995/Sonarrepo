const candidateSchema = require("./candidates.model");
const mailTemplateSchema = require("../mailtemplates/mailtemplates.modal");
const mailRequestSchema = require("../mailrequests/mailrequest.model");
const moment = require("moment");

const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const ShortUniqueId = require("short-unique-id");
const uid = new ShortUniqueId({ length: 10 });

exports.createCandidate = async (req, res) => {
  try {
    let inputData = req.body;

    let mailTemplateRes = await mailTemplateSchema.findOne({
      mailType: "AssessmentInvitation",
    });

    let objArr = [];
    let mailList = [];
    const origin = req.header("Origin");
    const page_link = `${origin}/candidate`;

    if (inputData.candidateInfo.length > 0) {
      inputData.candidateInfo.map((item) => {
        let uniqueId = uid();
        let candidateParams = {
          jobTitle: inputData.jobTitle,
          jobId: inputData.jobId,
          clientName: inputData.clientName,
          skills: inputData.skills, // []
          tags: inputData.tags, //[]
          candidateInfo: item,
          expiryDate: new Date(inputData.expiryDate),
          createdBy: inputData.createdBy, ///  ObjectId
          updatedBy: inputData.updatedBy, ///  ObjectId
          testAssign: inputData.testAssign,
          uniqueCode: uniqueId, //create a unigue code   use uuid
          testStatus: inputData.testStatus,
          reviewer: inputData.reviewer,
          deleted: inputData.deleted,
          startTest: {
            takes: 0,
          },
          companyInfo: inputData.companyInfo,
          recruiterInfo: inputData.recruiterInfo,
        };
        objArr.push(candidateParams);

        if (mailTemplateRes) {
          var mBody = mailTemplateRes.mailBody;
          var mSub = mailTemplateRes.mailSubject;
          var mailSubMapObj = {
            COMPANY_NAME: inputData.companyName,
          };
          var mapObj = {
            CANDIDATE_FIRST_NAME: item.firstName,
            UNIQUE_CODE: uniqueId,
            PAGE_LINK: page_link,
            TEST_NAME: inputData.testName?.split("_")[0],
            TEST_CATEGORY: inputData.testCategory,
            TEST_DURATION: inputData.testDuration,
            CREATED_BY_NAME: inputData.createdByName,
            COMPANY_NAME: inputData.companyName,
          };
          var re = new RegExp(Object.keys(mapObj).join("|"), "gi");
          mBody = mBody.replace(re, function (matched) {
            return mapObj[matched];
          });

          var repl = new RegExp(Object.keys(mailSubMapObj).join("|"), "gi");
          mSub = mSub.replace(repl, function (matched) {
            return mailSubMapObj[matched];
          });

          var mailObj = {
            mailFrom: process.env.SMTP_RECRUITER_MAIL_USER,
            mailTo: item.email,
            mailSubject: mSub,
            mailContent: mBody,
            mStatus: 15,
          };

          mailList.push(mailObj);
        }
      });
    }

    candidateSchema.insertMany(objArr).then((result) => {
      mailRequestSchema.insertMany(mailList).then((mailData) => {
        res.send({
          message: "Candidate created successfully",
        });
      });
    });
  } catch (err) {
    console.log("Error Caught", err);
    return res.status(500).send({
      message: "Some error has occurred, please try again later",
    });
  }
};

exports.getAllCandidates = async (req, res) => {
  try {
    let candidateRes = await candidateSchema.find();
    res.status(200).send(candidateRes);
  } catch (err) {
    console.log("Error Caught", err);
    return res.status(500).send({
      message: "Some error has occurred, please try again later",
    });
  }
};

exports.findCandidateByUniqueId = async (req, res) => {
  try {
    let candidateRes = await candidateSchema
      .findOne({
        uniqueCode: req.body.uniqueCode,
      })
      .populate("testAssign");

    if (candidateRes) {
      res.status(200).send(candidateRes);
    } else {
      res.status(200).send({ message: "Please enter correct unique ID" });
    }
  } catch (err) {
    console.log("Error Caught", err);
    return res.status(500).send({
      message: "Some error has occurred, please try again later",
    });
  }
};

exports.findCandidateByAssessmentId = async (req, res) => {
  try {
    const { assessmentId, testStatus, currentPage, limit, createdBy, parent } =
      req.body;

    let query = {};
    let offset = limit * (parseInt(currentPage) - 1);

    if (createdBy !== "") {
      query["createdBy"] = createdBy;
    }

    if (parent === "vetting") {
      query["createdFrom"] = { $ne: "High5hire" };
    }

    if (testStatus == "Invited") {
      query["testAssign"] = mongoose.Types.ObjectId(assessmentId);
      query["testStatus"] = testStatus;
      query["expiryDate"] = { $gte: new Date() };

      let total = await candidateSchema.find(query).countDocuments();
      let result = await candidateSchema.find({
        testStatus: "Invited",
        expiryDate: { $gte: new Date() },
        testAssign: mongoose.Types.ObjectId(assessmentId),
      });
      console.log("result_invite_cand", assessmentId);
      let Obj = {
        total: total,
        data: result,
      };
      res.status(200).send(Obj);
    }

    if (testStatus == "Expired") {
      query["testAssign"] = mongoose.Types.ObjectId(assessmentId);
      query["expiryDate"] = { $lte: new Date() };
      query["testStatus"] = { $ne: "completed" };
      query["testStatus"] = { $ne: "underReview" };

      let total = await candidateSchema.find(query).countDocuments();
      let result = await candidateSchema.find(query).skip(offset).limit(limit);
      let Obj = {
        total: total,
        data: result,
      };
      res.status(200).send(Obj);
    }
  } catch (err) {
    console.log("Error Caught", err);
    return res.status(500).send({
      message: "Some error has occurred, please try again later",
    });
  }
};

exports.updateCandidate = async (req, res) => {
  try {
    const { candidateId, testStatus } = req.body;

    candidateSchema
      .findByIdAndUpdate(candidateId, { testStatus: testStatus })
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `Error while updating candidate. Try again later`,
          });
        } else
          res.send({
            message: "Candidate data updated successfully.",
            data: data,
          });
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error updating candidate data",
        });
      });
  } catch (err) {
    console.log("Error Caught", err);
    return res.status(500).send({
      message: "Some error has occurred, please try again later",
    });
  }
};
