const assessmentSchema = require("../assessments/assessments.model");
const resultSchema = require("../results/results.model");
const questionSchema = require("../questions/questions.model");
const candidateSchema = require("../candidates/candidates.model");
const projectSchema = require("../projects/projects.model");
const usersSchema = require("../user/user.model");

const mongoose = require("mongoose");

exports.getDashboardData = async (req, res) => {
  try {
    const { companyId, userId, createdBy } = req.body;

    let question = await questionSchema.aggregate([
      {
        $match: { deleted: false },
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

    let questionInLastMonth = await questionSchema.aggregate([
      {
        $match: {
          deleted: false,
          createdAt: {
            $gte: new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000),
          },
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

    let assessmentsLastMonth = await assessmentSchema.aggregate([
      {
        $match: {
          deleted: false,
          createdAt: {
            $gte: new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000),
          },
          createdFrom: { $ne: "High5hire" },
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

    let matchQuery =
      companyId.length > 0 ? { "userDetails.companyId": companyId } : {};
    let query = { deleted: false };
    query["createdFrom"] = { $ne: "High5hire" };
    let assessments = await assessmentSchema.aggregate([
      {
        $match: query,
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
        $match: matchQuery,
      },
    ]);

    let results = [];
    let resultsLastMonth = [];

    if (companyId == "") {
      results = await resultSchema.aggregate([
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
        //{ $match: { "userDetails.companyId": companyId } },
      ]);
      resultsLastMonth = await resultSchema.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000),
            },
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

        // { $match: { "userDetails.companyId": companyId } },
      ]);
    } else {
      if (createdBy === "") {
        results = await resultSchema.aggregate([
          {
            $match: {
              testStatus: "completed",
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
        resultsLastMonth = await resultSchema.aggregate([
          {
            $match: {
              createdAt: {
                $gte: new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000),
              },
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
      } else {
        results = await resultSchema.aggregate([
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
        resultsLastMonth = await resultSchema.aggregate([
          {
            $match: {
              createdAt: {
                $gte: new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000),
              },
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
      }
    }

    let candidateInvite = [];
    let candidateInviteLastMonth = [];
    if (companyId == "") {
      candidateInvite = await candidateSchema.find({
        testStatus: "Invited",
        createdFrom: { $ne: "High5hire" },
        expiryDate: { $gte: new Date() },
      });
      candidateInviteLastMonth = await candidateSchema.find({
        testStatus: "Invited",
        createdAt: {
          $gte: new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000),
        },
        createdFrom: { $ne: "High5hire" },
        expiryDate: { $gte: new Date() },
      });
    } else {
      if (createdBy === "") {
        candidateInvite = await candidateSchema.aggregate([
          {
            $match: {
              testStatus: "Invited",
              createdFrom: { $ne: "High5hire" },
              expiryDate: { $gte: new Date() },
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
          { $match: { "userDetails.companyId": companyId } },
        ]);
        candidateInviteLastMonth = await candidateSchema.aggregate([
          {
            $match: {
              testStatus: "Invited",
              createdFrom: { $ne: "High5hire" },
              expiryDate: { $gte: new Date() },
              createdAt: {
                $gte: new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000),
              },
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
          { $match: { "userDetails.companyId": companyId } },
        ]);
      } else {
        candidateInvite = await candidateSchema.aggregate([
          {
            $match: {
              testStatus: "Invited",
              createdFrom: { $ne: "High5hire" },
              expiryDate: { $gte: new Date() },
              createdBy: mongoose.Types.ObjectId(createdBy),
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
          { $match: { "userDetails.companyId": companyId } },
        ]);
        candidateInviteLastMonth = await candidateSchema.aggregate([
          {
            $match: {
              testStatus: "Invited",
              createdFrom: { $ne: "High5hire" },
              expiryDate: { $gte: new Date() },
              createdAt: {
                $gte: new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000),
              },
              createdBy: mongoose.Types.ObjectId(createdBy),
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
          { $match: { "userDetails.companyId": companyId } },
        ]);
      }
    }

    let expiredInvitation = [];
    let expiredInvitationLastMonth = [];

    if (createdBy === "") {
      expiredInvitation = await candidateSchema.aggregate([
        {
          $match: {
            expiryDate: { $lte: new Date() },
            createdFrom: { $ne: "High5hire" },
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
      ]);
      expiredInvitationLastMonth = await candidateSchema.aggregate([
        {
          $match: {
            expiryDate: { $lte: new Date() },
            createdFrom: { $ne: "High5hire" },
            createdAt: {
              $gte: new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000),
            },
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
      ]);
    } else {
      expiredInvitation = await candidateSchema.aggregate([
        {
          $match: {
            expiryDate: { $lte: new Date() },
            createdFrom: { $ne: "High5hire" },
            testStatus: { $ne: "completed" },
            testStatus: { $ne: "underReview" },
            createdBy: mongoose.Types.ObjectId(createdBy),
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
        { $match: { "userDetails.companyId": companyId } },
      ]);
      expiredInvitationLastMonth = await candidateSchema.aggregate([
        {
          $match: {
            expiryDate: { $lte: new Date() },
            createdFrom: { $ne: "High5hire" },
            createdAt: {
              $gte: new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000),
            },
            createdBy: mongoose.Types.ObjectId(createdBy),
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
        { $match: { "userDetails.companyId": companyId } },
      ]);
    }

    let candidateUnderReview = [];
    let candidateUnderReviewLastMonth = [];

    if (createdBy === "") {
      candidateUnderReview = await candidateSchema.aggregate([
        {
          $match: {
            testStatus: "underReview",
            createdFrom: { $ne: "High5hire" },
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
          $match:
            req.body.companyId === ""
              ? {}
              : { "userDetails.companyId": companyId },
        },
      ]);
      candidateUnderReviewLastMonth = await candidateSchema.aggregate([
        {
          $match: {
            testStatus: "underReview",
            createdFrom: { $ne: "High5hire" },
            createdAt: {
              $gte: new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000),
            },
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
        { $match: { "userDetails.companyId": companyId } },
      ]);
    } else {
      candidateUnderReview = await candidateSchema.aggregate([
        {
          $match: {
            testStatus: "underReview",
            createdFrom: { $ne: "High5hire" },
            createdBy: mongoose.Types.ObjectId(createdBy),
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
          $match:
            req.body.companyId === ""
              ? {}
              : { "userDetails.companyId": companyId },
        },
      ]);
      candidateUnderReviewLastMonth = await candidateSchema.aggregate([
        {
          $match: {
            testStatus: "underReview",
            createdFrom: { $ne: "High5hire" },
            createdAt: {
              $gte: new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000),
            },
            createdBy: mongoose.Types.ObjectId(createdBy),
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
        { $match: { "userDetails.companyId": companyId } },
      ]);
    }

    let projects = await projectSchema.aggregate([
      {
        $match: {
          deleted: false,
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
      { $match: { "userDetails.companyId": companyId } },
    ]);
    let projectsLastMonth = await projectSchema.aggregate([
      {
        $match: {
          deleted: false,
          createdAt: {
            $gte: new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000),
          },
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
      { $match: { "userDetails.companyId": companyId } },
    ]);

    let adminUsers = [];
    let adminUsersInLastMonth = [];
    if (companyId === "") {
      adminUsers = await usersSchema.aggregate([
        {
          $match: {
            createdBy: mongoose.Types.ObjectId(userId),
          },
        },
      ]);
      adminUsersInLastMonth = await usersSchema.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000),
            },
            createdBy: mongoose.Types.ObjectId(userId),
          },
        },
      ]);
    }

    let companyAdminUsers = [];
    let companyAdminUsersInLastMonth = [];
    if (companyId !== "") {
      companyAdminUsers = await usersSchema.aggregate([
        {
          $match: {
            companyId: companyId,
            _id: { $ne: mongoose.Types.ObjectId(userId) },
          },
        },
      ]);
      companyAdminUsersInLastMonth = await usersSchema.aggregate([
        {
          $match: {
            companyId: companyId,
            _id: { $ne: mongoose.Types.ObjectId(userId) },
            createdAt: {
              $gte: new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000),
            },
          },
        },
      ]);
    }

    let count = {
      questionsCount: question.length,
      questionInLastMonth: questionInLastMonth.length,

      assessments: assessments.length,
      assessmentsLastMonth: assessmentsLastMonth.length,

      results: results.length,
      resultsLastMonth: resultsLastMonth.length,

      invitedCandidates: candidateInvite.length,
      invitedCandidatesLastMonth: candidateInviteLastMonth.length,

      expiredInvitation: expiredInvitation.length,
      expiredInvitationLastMonth: expiredInvitationLastMonth.length,

      candidateUnderReview: candidateUnderReview.length,
      candidateUnderReviewLastMonth: candidateUnderReviewLastMonth.length,

      projects: projects.length,
      projectsLastMonth: projectsLastMonth.length,
    };

    if (companyId === "") {
      count.adminUsers = adminUsers.length;
      count.adminUsersInLastMonth = adminUsersInLastMonth.length;
    }
    if (companyId !== "") {
      count.companyAdminUsers = companyAdminUsers.length;
      count.companyAdminUsersInLastMonth = companyAdminUsersInLastMonth.length;
    }

    res.send(count);
  } catch (err) {
    console.log("Error Caught", err);
    return res.status(500).send({
      message: "Some error has occurred, please try again later",
    });
  }
};
