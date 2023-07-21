const assessmentSchema = require("./assessments.model");
const mongoose = require("mongoose");

exports.createAssessment = async (req, res) => {
  try {
    let inputData = req.body;

    let assessmentParams = {
      testName: inputData.testName,
      difficulty: inputData.difficulty,
      testCategory: inputData.testCategory,
      skills: inputData.skills,
      projects: inputData.projects,
      questions: inputData.questions,
      details: inputData.details,
      createdBy: inputData.createdBy,
      updatedBy: inputData.updatedBy,
      deleted: inputData.deleted,
    };

    let assessmentReq = new assessmentSchema(assessmentParams);
    assessmentReq.save().then(() => {
      res.send({
        message: "Assessment created successfully",
      });
    });
  } catch (err) {
    console.log("Error Caught", err);
    return res.status(500).send({
      message: "Some error has occurred, please try again later",
    });
  }
};

exports.findAllAssessment = async (req, res) => {
  try {
    const {
      role,
      currentPage,
      limit,
      sortParams,
      filterParams,
      companyId,
      createdBy,
      selectedTab,
      searchParam,
    } = req.body;
    let query = {};
    let sortQuery = {};
    sortQuery["createdAt"] = -1;
    let offset = limit * (parseInt(currentPage) - 1);

    if (searchParam !== "") {
      query["testName"] = {
        $regex: `${searchParam}`,
        $options: "i",
      };
    }

    if (sortParams.sortBy == "testName" && sortParams.sortOrder == "asc") {
      sortQuery["testName"] = 1;
      delete sortQuery["createdAt"];
    }
    if (sortParams.sortBy == "testName" && sortParams.sortOrder == "desc") {
      sortQuery["testName"] = -1;
      delete sortQuery["createdAt"];
    }
    if (sortParams.sortBy == "testCategory" && sortParams.sortOrder == "asc") {
      sortQuery["testCategory"] = 1;
      delete sortQuery["createdAt"];
    }
    if (sortParams.sortBy == "testCategory" && sortParams.sortOrder == "desc") {
      sortQuery["testCategory"] = -1;
      delete sortQuery["createdAt"];
    }
    // if (sortParams.sortBy == "skills" && sortParams.sortOrder == "asc") {
    //   sortQuery["skills"] = 1;
    //   delete sortQuery["createdAt"];
    // }
    // if (sortParams.sortBy == "skills" && sortParams.sortOrder == "desc") {
    //   sortQuery["skills"] = -1;
    //   delete sortQuery["createdAt"];
    // }
    if (
      sortParams.sortBy == "questionsLength" &&
      sortParams.sortOrder == "asc"
    ) {
      sortQuery["questionsLength"] = 1;
      delete sortQuery["createdAt"];
    }
    if (
      sortParams.sortBy == "questionsLength" &&
      sortParams.sortOrder == "desc"
    ) {
      sortQuery["questionsLength"] = -1;
      delete sortQuery["createdAt"];
    }

    if (filterParams?.skills?.length > 0) {
      query["skills"] = { $in: filterParams?.skills };
    }
    if (filterParams?.testCategory.length > 0) {
      query["testCategory"] = { $in: filterParams?.testCategory };
    }

    if (filterParams?.selectedDateType == "after") {
      let date = new Date(filterParams?.selectedDate[0]);
      query["createdAt"] = { $gte: new Date(date.setDate(date.getDate() + 1)) };
    }
    if (filterParams?.selectedDateType == "before") {
      query["createdAt"] = { $lte: new Date(filterParams?.selectedDate[1]) };
    }
    if (filterParams?.selectedDateType == "between") {
      let date = new Date(filterParams?.selectedDate[0]);
      let date2 = new Date(filterParams?.selectedDate[1]);
      query["createdAt"] = {
        $gte: date,
        $lt: date2,
      };
    }

    let assessmentResult = [];

    if (role === "admin" && selectedTab === "user") {
      query["createdFrom"] = { $ne: "High5hire" };
      assessmentResult = await assessmentSchema.aggregate([
        { $match: query },
        {
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $lookup: {
            from: "candidates",
            localField: "_id",
            foreignField: "testAssign",
            as: "candidateDetails",
          },
        },
        {
          $lookup: {
            from: "results",
            localField: "_id",
            foreignField: "testAssign._id",
            as: "results",
          },
        },
        { $addFields: { questionsLength: { $size: "$questions" } } },
        { $unwind: "$userDetails" },
        {
          $match: {
            "userDetails._id": { $ne: mongoose.Types.ObjectId(createdBy) },
          },
        },
        { $sort: sortQuery },
        {
          $facet: {
            count: [{ $count: "total" }],
            data: [{ $skip: offset }, { $limit: limit }],
          },
        },
      ]);
    }
    //  else if (role === "admin" && selectedTab === "high5hire") {
    //   query["createdFrom"] = "High5hire";
    //   assessmentResult = await assessmentSchema.aggregate([
    //     { $match: query },
    //     {
    //       $lookup: {
    //         from: "users",
    //         localField: "createdBy",
    //         foreignField: "_id",
    //         as: "userDetails",
    //       },
    //     },
    //     {
    //       $lookup: {
    //         from: "candidates",
    //         localField: "_id",
    //         foreignField: "testAssign",
    //         as: "candidateDetails",
    //       },
    //     },
    //     {
    //       $lookup: {
    //         from: "results",
    //         localField: "_id",
    //         foreignField: "testAssign._id",
    //         as: "results",
    //       },
    //     },
    //     { $addFields: { questionsLength: { $size: "$questions" } } },
    //     // { $unwind: "$userDetails" },
    //     { $sort: sortQuery },
    //     {
    //       $facet: {
    //         count: [{ $count: "total" }],
    //         data: [{ $skip: offset }, { $limit: limit }],
    //       },
    //     },
    //   ]);

    //   console.log("assessmentResult___________211", assessmentResult);
    // }
    else {
      query["createdFrom"] = { $ne: "High5hire" };
      assessmentResult = await assessmentSchema.aggregate([
        { $match: query },
        {
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $lookup: {
            from: "candidates",
            localField: "_id",
            foreignField: "testAssign",
            as: "candidateDetails",
          },
        },
        {
          $lookup: {
            from: "results",
            localField: "_id",
            foreignField: "testAssign._id",
            as: "results",
          },
        },
        { $addFields: { questionsLength: { $size: "$questions" } } },
        { $unwind: "$userDetails" },
        // {
        //   $unwind: {
        //     path: "$candidateDetails",
        //     preserveNullAndEmptyArrays: true,
        //   },
        // },
        // {
        //   $unwind: {
        //     path: "$results",
        //     preserveNullAndEmptyArrays: true,
        //   },
        // },

        { $match: { "userDetails.companyId": companyId } },
        { $sort: sortQuery },
        {
          $facet: {
            count: [{ $count: "total" }],
            data: [{ $skip: offset }, { $limit: limit }],
          },
        },
      ]);
    }

    res.send(assessmentResult);
  } catch (err) {
    console.log("Error Caught", err);
    return res.status(500).send({
      message: "Some error has occurred, please try again later",
    });
  }
};

exports.findByProjectId = async (req, res) => {
  try {
    const { projectId } = req.body;
    let result = await assessmentSchema.find({
      projects: { $elemMatch: { projectId: projectId } },
    });
    res.status(200).send(result);
  } catch (err) {
    console.log("Error Caught", err);
    return res.status(500).send({
      message: "Some error has occurred, please try again later",
    });
  }
};

exports.findAssessmentById = async (req, res) => {
  try {
    let result = await assessmentSchema.findOne({
      _id: req.body.id,
    });
    res.status(200).send(result);
  } catch (err) {
    console.log("Error Caught", err);
    return res.status(500).send({
      message: "Some error has occurred, please try again later",
    });
  }
};

exports.updateAssessment = async (req, res) => {
  try {
    const { projects, assessmentId } = req.body;

    assessmentSchema
      .findByIdAndUpdate(assessmentId, {
        $push: { projects: { $each: projects } },
      })
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `Update Failed`,
          });
        } else
          res.send({
            message: "Updated successfully.",
            data: data,
            status: 200,
          });
      })
      .catch((err) => {
        console.log("err", err);
        res.status(500).send({
          message: "Some error occurred , please try later",
        });
      });
  } catch (err) {
    console.log("Error Caught", err);
    return res.status(500).send({
      message: "Some error has occurred, please try again later",
    });
  }
};

exports.findQuestionsByAssessmentId = async (req, res) => {
  try {
    let result = await assessmentSchema.findOne({
      _id: req.body.assessmentId,
    });
    if (result) {
      let questionRes = result?.questions;
      res.status(200).send(result);
    }
  } catch (err) {
    console.log("Error Caught", err);
    return res.status(500).send({
      message: "Some error has occurred, please try again later",
    });
  }
};
