const resultSchema = require("./results.model");
const candidateSchema = require("../candidates/candidates.model");
const mongoose = require("mongoose");
const mailTemplateSchema = require("../mailtemplates/mailtemplates.modal");
const mailRequestSchema = require("../mailrequests/mailrequest.model");
const moment = require("moment/moment");

exports.createResult = async (req, res) => {
  try {
    // const origin = req.header("Origin");

    let inputData = req.body;
    const origin = req.header("Origin");
    let testAssign = req.body.testAssign;

    testAssign.createdBy = mongoose.Types.ObjectId(testAssign.createdBy);
    testAssign.updatedBy = mongoose.Types.ObjectId(testAssign.updatedBy);
    testAssign._id = mongoose.Types.ObjectId(testAssign._id);

    let paramObj = {
      candidateId: inputData.candidateId,
      questions: inputData.questions,
      testAssign: testAssign,
      testStatus: req.body.testStatus,
      deleted: inputData.deleted,
      createdBy: inputData.createdBy,
      updatedBy: inputData.updatedBy,
      candidateInfo: req.body.candidateInfo,
      companyInfo: req.body.companyInfo,
      reviewer: req.body.reviewer,
      //   jobId: req.body.jobId,
      //   jobTitle: req.body.jobTitle,
      //   tags: req.body.jobTitle,
      //   skills: req.body.skills,
      //   isReviewed: req.body.isReviewed,
      //   isRecommended: req.body.recommended,
      //   testRejected: req.body.testRejected,
      //   videoUrl: req.body.videoUrl,
    };

    let page_link = `${origin}/reviewer/${inputData.candidateId}/`;
    let reviewTemplate = await mailTemplateSchema.findOne({
      mailType: "assessmentReview",
    });

    let resReq = new resultSchema(paramObj);
    resReq.save().then((resp) => {
      if (inputData.testAssign.testCategory !== "MCQ") {
        if (reviewTemplate) {
          var mBody = reviewTemplate.mailBody;
          var mSub = reviewTemplate.mailSubject;
          var mapObj = {
            REVIEWER_NAME: inputData.reviewer.firstName,
            CANDIDATE_NAME: inputData.candidateInfo.firstName,
            CANDIDATE_FULLNAME:
              inputData.candidateInfo.firstName +
              " " +
              inputData.candidateInfo.lastName,
            ASSESSMENT_NAME: inputData?.testAssign?.testName?.split("_")[0],
            ASSESSMENT_TYPE: inputData.testAssign.testCategory,
            PAGE_LINK: page_link,
            COMPANY_NAME: inputData.companyInfo.companyName,
          };
          var re = new RegExp(Object.keys(mapObj).join("|"), "gi");
          mBody = mBody.replace(re, function (matched) {
            return mapObj[matched];
          });
          var mailObj = {
            mailFrom: process.env.SMTP_MAIL_USER,
            mailTo: inputData.reviewer.reviewerEmail,
            mailSubject: mSub,
            mailContent: mBody,
            mStatus: 15,
          };
        }

        let mailReq = new mailRequestSchema(mailObj);
        mailReq.save().then((res) => {
          console.log("mail sent to reviewer", res);
        });
      }
      res.json({
        message: "Result created successfully",
      });
    });
  } catch (err) {
    console.log("Error Caught", err);
    return res.status(500).send({
      message: "Some error has occurred, please try again later",
    });
  }
};

exports.findResultByAssessmentId = async (req, res) => {
  try {
    const { companyId, assessmentId, limit, currentPage, createdBy } = req.body;
    let query = {};
    query["testAssign._id"] = mongoose.Types.ObjectId(assessmentId);

    let result = [];
    let offset = limit * (parseInt(currentPage) - 1);

    if (companyId == "") {
      result = await resultSchema.aggregate([
        { $match: query },
        {
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "userDetails",
          },
        },

        { $unwind: "$userDetails" },
        {
          $lookup: {
            from: "candidates",
            localField: "candidateId",
            foreignField: "_id",
            as: "candidateInfo",
          },
        },
        { $unwind: "$candidateInfo" },
        {
          $facet: {
            count: [{ $count: "total" }],
            data: [{ $skip: offset }, { $limit: limit }],
          },
        },
      ]);
    } else {
      result = await resultSchema.aggregate([
        { $match: query },
        {
          $match: { createdBy: mongoose.Types.ObjectId(createdBy) },
        },
        {
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "userDetails",
          },
        },

        { $unwind: "$userDetails" },
        {
          $match: {
            "userDetails.companyId": companyId,
          },
        },
        {
          $lookup: {
            from: "candidates",
            localField: "candidateId",
            foreignField: "_id",
            as: "candidateInfo",
          },
        },
        { $unwind: "$candidateInfo" },
        {
          $facet: {
            count: [{ $count: "total" }],
            data: [{ $skip: offset }, { $limit: limit }],
          },
        },
      ]);
    }

    res.send(result);
  } catch (err) {
    console.log("Error Caught", err);
    return res.status(500).send({
      message: "Some error has occurred, please try again later",
    });
  }
};

exports.findResults = async (req, res) => {
  try {
    const {
      selectedTab,
      companyId,
      sortParams,
      filterParams,
      createdBy,
      currentPage = 1,
      limit = 10,
    } = req.body;

    let offset = limit * (parseInt(currentPage) - 1);
    let sortQuery = {};
    let sortQuery2 = {};
    let query = {};

    let candidateInfoQuery = {};
    sortQuery["createdAt"] = -1;
    sortQuery2["createdAt"] = -1;

    if (
      sortParams?.sortBy == "candidateName" &&
      sortParams?.sortOrder == "asc"
    ) {
      sortQuery["candidateData.candidateInfo.firstName"] = 1;
      sortQuery2["candidateInfo.firstName"] = 1;
      delete sortQuery["createdAt"];
    }
    if (
      sortParams?.sortBy == "candidateName" &&
      sortParams?.sortOrder == "desc"
    ) {
      sortQuery["candidateData.candidateInfo.firstName"] = -1;
      sortQuery2["candidateInfo.firstName"] = -1;
      delete sortQuery["createdAt"];
    }
    if (sortParams?.sortBy == "inviteOn" && sortParams?.sortOrder == "asc") {
      sortQuery["candidateData.createdAt"] = 1;
      sortQuery2["createdAt"] = 1;
      delete sortQuery["createdAt"];
    }
    if (sortParams?.sortBy == "inviteOn" && sortParams?.sortOrder == "desc") {
      sortQuery["candidateData.createdAt"] = -1;
      sortQuery2["createdAt"] = -1;
      delete sortQuery["createdAt"];
    }

    if (filterParams?.assessmentCategory?.length > 0) {
      query["testAssign.testCategory"] = {
        $in: filterParams?.assessmentCategory,
      };
      candidateInfoQuery["assessmentDetails.testCategory"] = {
        $in: filterParams?.assessmentCategory,
      };
    }

    if (filterParams?.selectedDateType == "after") {
      let date = new Date(filterParams?.selectedDate[0]);
      query["candidateData.createdAt"] = {
        $gt: date.setDate(date.getDate() + 1),
      };
      candidateInfoQuery["createdAt"] = {
        $gt: date.setDate(date.getDate() + 1),
      };
    }
    if (filterParams?.selectedDateType == "before") {
      query["candidateData.createdAt"] = {
        $lt: new Date(filterParams?.selectedDate[1]),
      };
      candidateInfoQuery["createdAt"] = {
        $lt: new Date(filterParams?.selectedDate[1]),
      };
    }
    if (filterParams?.selectedDateType == "between") {
      let date = new Date(filterParams?.selectedDate[0]);
      let date2 = new Date(filterParams?.selectedDate[1]);
      query["candidateData.createdAt"] = {
        $lte: new Date(filterParams?.selectedDate[1]),
        $gte: date.setDate(date.getDate() + 1),
      };

      candidateInfoQuery["createdAt"] = {
        $lte: date2.setDate(date2.getDate() + 1),
        $gte: date.setDate(date.getDate() - 1),
      };
    }

    let queryTab = {};
    if (createdBy.length > 1)
      queryTab["createdBy"] = mongoose.Types.ObjectId(createdBy);

    if (selectedTab == "all") {
      let candidateResult = await candidateSchema.aggregate([
        {
          $match: queryTab,
        },
        {
          $lookup: {
            from: "assessments",
            localField: "testAssign",
            foreignField: "_id",
            as: "assessmentDetails",
          },
        },
        { $unwind: "$assessmentDetails" },
        {
          $lookup: {
            from: "results",
            localField: "_id",
            foreignField: "candidateId",
            as: "resultData",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        { $unwind: "$userDetails" },
        {
          $match: {
            "userDetails.companyId": companyId,
          },
        },
        { $match: candidateInfoQuery },
        { $sort: sortQuery2 },
        // {
        //   $facet: {
        //     count: [{ $count: "total" }],
        //     data: [{ $skip: offset }, { $limit: limit }],
        //   },
        // },
      ]);
      res.send(candidateResult);
    }

    if (selectedTab == "invited") {
      queryTab["testStatus"] = "Invited";
      queryTab["expiryDate"] = { $gte: new Date() };

      let candidateResult = await candidateSchema.aggregate([
        {
          $match: queryTab,
        },
        {
          $match: queryTab,
        },
        {
          $lookup: {
            from: "assessments",
            localField: "testAssign",
            foreignField: "_id",
            as: "assessmentDetails",
          },
        },
        { $unwind: "$assessmentDetails" },
        {
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        { $unwind: "$userDetails" },
        { $match: { "userDetails.companyId": companyId } },
        { $match: candidateInfoQuery },
        { $sort: sortQuery2 },
        {
          $facet: {
            count: [{ $count: "total" }],
            data: [{ $skip: offset }, { $limit: limit }],
          },
        },
      ]);
      res.send(candidateResult);
    }

    if (selectedTab == "expired") {
      let query = {};
      let date = new Date();

      query["expiryDate"] = { $lte: date };
      query["testStatus"] = { $ne: "completed" };
      query["testStatus"] = { $ne: "underReview" };

      if (createdBy.length > 1)
        query["createdBy"] = mongoose.Types.ObjectId(createdBy);

      let expiredInvitation = await candidateSchema.aggregate([
        {
          $match: query,
        },
        {
          $lookup: {
            from: "assessments",
            localField: "testAssign",
            foreignField: "_id",
            as: "assessmentDetails",
          },
        },
        { $unwind: "$assessmentDetails" },
        {
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        { $unwind: "$userDetails" },
        { $match: { "userDetails.companyId": companyId } },
        { $match: candidateInfoQuery },
        { $sort: sortQuery2 },
        {
          $facet: {
            count: [{ $count: "total" }],
            data: [{ $skip: offset }, { $limit: limit }],
          },
        },
      ]);
      res.send(expiredInvitation);
    }

    if (selectedTab == "underReview") {
      queryTab["testStatus"] = "underReview";
      let result = await resultSchema.aggregate([
        {
          $match: queryTab,
        },
        {
          $lookup: {
            from: "candidates",
            localField: "candidateId",
            foreignField: "_id",
            as: "candidateData",
          },
        },
        { $unwind: "$candidateData" },

        {
          $lookup: {
            from: "users",
            localField: "candidateData.createdBy",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        { $unwind: "$userDetails" },

        { $match: { "userDetails.companyId": companyId } },
        { $match: query },
        { $sort: sortQuery },
        {
          $facet: {
            count: [{ $count: "total" }],
            data: [{ $skip: offset }, { $limit: limit }],
          },
        },
      ]);
      res.send(result);
    }

    if (selectedTab == "completed") {
      queryTab["testStatus"] = "completed";
      let result = await resultSchema.aggregate([
        {
          $match: queryTab,
        },
        {
          $lookup: {
            from: "candidates",
            localField: "candidateId",
            foreignField: "_id",
            as: "candidateData",
          },
        },
        { $unwind: "$candidateData" },

        {
          $lookup: {
            from: "users",
            localField: "candidateData.createdBy",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        { $unwind: "$userDetails" },

        { $match: { "userDetails.companyId": companyId } },
        { $match: query },
        { $sort: sortQuery },
        {
          $facet: {
            count: [{ $count: "total" }],
            data: [{ $skip: offset }, { $limit: limit }],
          },
        },
      ]);
      res.send(result);
    }
  } catch (err) {
    console.log(err);
  }
};

exports.findResultsCount = async (req, res) => {
  try {
    const { companyId, createdBy } = req.body;

    // let allResult = await resultSchema.aggregate([
    //   {
    //     $lookup: {
    //       from: "candidates",
    //       localField: "candidateId",
    //       foreignField: "_id",
    //       as: "candidateData",
    //     },
    //   },
    //   { $unwind: "$candidateData" },

    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "candidateData.createdBy",
    //       foreignField: "_id",
    //       as: "userDetails",
    //     },
    //   },
    //   { $unwind: "$userDetails" },

    //   { $match: { "userDetails.companyId": companyId } },
    // ]);

    let allResult = await candidateSchema.aggregate([
      {
        $match: { createdBy: mongoose.Types.ObjectId(createdBy) },
      },
      {
        $lookup: {
          from: "results",
          localField: "_id",
          foreignField: "candidateId",
          as: "resultData",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $match: { "userDetails.companyId": companyId },
      },
    ]);

    let invitedResult = await candidateSchema.aggregate([
      {
        $match: {
          testStatus: "Invited",
          createdBy: mongoose.Types.ObjectId(createdBy),
          expiryDate: { $gte: new Date() },
        },
      },
      {
        $lookup: {
          from: "assessments",
          localField: "testAssign",
          foreignField: "_id",
          as: "assessmentDetails",
        },
      },
      { $unwind: "$assessmentDetails" },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      { $match: { "userDetails.companyId": companyId } },
    ]);

    let query = {};
    let date = new Date();
    query["expiryDate"] = { $lte: date };
    query["createdBy"] = mongoose.Types.ObjectId(createdBy);
    query["testStatus"] = { $ne: "completed" };

    let expiredInvitation = await candidateSchema.aggregate([
      {
        $match: query,
      },
      {
        $lookup: {
          from: "assessments",
          localField: "testAssign",
          foreignField: "_id",
          as: "assessmentDetails",
        },
      },
      { $unwind: "$assessmentDetails" },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      { $match: { "userDetails.companyId": companyId } },
    ]);

    let underReview = await resultSchema.aggregate([
      {
        $match: {
          testStatus: "underReview",
          createdBy: mongoose.Types.ObjectId(createdBy),
        },
      },
      {
        $lookup: {
          from: "candidates",
          localField: "candidateId",
          foreignField: "_id",
          as: "candidateData",
        },
      },
      { $unwind: "$candidateData" },

      {
        $lookup: {
          from: "users",
          localField: "candidateData.createdBy",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },

      { $match: { "userDetails.companyId": companyId } },
    ]);

    let completedResult = await resultSchema.aggregate([
      {
        $match: {
          testStatus: "completed",
          createdBy: mongoose.Types.ObjectId(createdBy),
        },
      },
      {
        $lookup: {
          from: "candidates",
          localField: "candidateId",
          foreignField: "_id",
          as: "candidateData",
        },
      },
      { $unwind: "$candidateData" },

      {
        $lookup: {
          from: "users",
          localField: "candidateData.createdBy",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },

      { $match: { "userDetails.companyId": companyId } },
    ]);

    let count = {
      all: allResult.length,
      invited: invitedResult.length,
      expired: expiredInvitation.length,
      underReview: underReview.length,
      completed: completedResult.length,
    };
    res.send(count);
  } catch (err) {
    console.log(err);
  }
};

exports.findLatestResults = async (req, res) => {
  try {
    const { companyId, createdBy } = req.body;
    let result = [];
    if (createdBy === "") {
      result = await resultSchema.aggregate([
        {
          $lookup: {
            from: "candidates",
            localField: "candidateId",
            foreignField: "_id",
            as: "candidateData",
          },
        },
        { $unwind: "$candidateData" },
        {
          $match: {
            "candidateData.testStatus": "completed",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "candidateData.createdBy",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        { $unwind: "$userDetails" },
        {
          $match: {
            "userDetails.companyId": companyId,
          },
        },
        { $sort: { _id: -1 } },
        { $limit: 10 },
      ]);
    } else {
      result = await resultSchema.aggregate([
        {
          $match: { createdBy: mongoose.Types.ObjectId(createdBy) },
        },
        {
          $lookup: {
            from: "candidates",
            localField: "candidateId",
            foreignField: "_id",
            as: "candidateData",
          },
        },
        { $unwind: "$candidateData" },
        {
          $match: {
            "candidateData.testStatus": "completed",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "candidateData.createdBy",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        { $unwind: "$userDetails" },
        {
          $match: {
            "userDetails.companyId": companyId,
          },
        },
        { $sort: { _id: -1 } },
        { $limit: 10 },
      ]);
    }
    res.send(result);
  } catch (err) {
    console.log(err);
  }
};

exports.findResultByCandidateId = async (req, res) => {
  try {
    console.log("req", req.body);
    let result = await resultSchema
      .findOne({
        candidateId: req.body.candidateId,
      })
      .populate("candidateId");
    res.send(result);
  } catch (err) {
    console.log(err);
  }
};

exports.updateResultByCandidateId = async (req, res) => {
  try {
    let data = req.body.data;
    data.testAssign.createdBy = mongoose.Types.ObjectId(
      data.testAssign.createdBy
    );
    data.testAssign.updatedBy = mongoose.Types.ObjectId(
      data.testAssign.updatedBy
    );
    data.testAssign._id = mongoose.Types.ObjectId(data.testAssign._id);

    resultSchema
      .updateOne(
        { candidateId: req.body.candidateId },
        {
          $set: data,
        }
      )
      .exec()
      .then(async (result) => {
        console.log(result);
        console.log("data===>>>", data);
        res.status(200).send({ message: "Updated Successfully" });
      })
      .catch((error) => {
        console.log("error caught", error);
        res.status(400).json(error);
      });
  } catch (err) {
    console.log(err);
  }
};
