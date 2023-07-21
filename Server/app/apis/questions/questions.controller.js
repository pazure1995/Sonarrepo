const questionSchema = require("./questions.model");
const mongoose = require("mongoose");
const {
  uploadImage,
  getImageUrl,
} = require("../../functions/fileupload/uploadImage");

exports.findAllQuestions = async (req, res) => {
  try {
    const {
      currentPage,
      limit,
      deleted,
      companyId,
      role,
      sortParams,
      filterParams,
      testCategory,
    } = req.body;

    let adminData = [];
    let offset = limit * (parseInt(currentPage) - 1);
    let query = {};
    query["deleted"] = deleted;

    if (testCategory) {
      query["type"] = testCategory;
    }

    if (filterParams.type.length > 0) {
      query["type"] = { $in: filterParams.type };
    }
    if (filterParams.skill.length > 0) {
      query["skill"] = { $in: filterParams.skill };
    }

    if (filterParams.difficulty.length > 0) {
      query["difficulty"] = { $in: filterParams.difficulty };
    }

    let sortQuery = {};
    sortQuery["createdAt"] = -1;

    if (sortParams.sortBy == "question" && sortParams.sortOrder == "asc") {
      sortQuery["question"] = 1;
      delete sortQuery["createdAt"];
    }
    if (sortParams.sortBy == "question" && sortParams.sortOrder == "desc") {
      sortQuery["question"] = -1;
      delete sortQuery["createdAt"];
    }
    if (sortParams.sortBy == "type" && sortParams.sortOrder == "asc") {
      sortQuery["type"] = 1;
      delete sortQuery["createdAt"];
    }
    if (sortParams.sortBy == "type" && sortParams.sortOrder == "desc") {
      sortQuery["type"] = -1;
      delete sortQuery["createdAt"];
    }
    if (sortParams.sortBy == "skill" && sortParams.sortOrder == "asc") {
      sortQuery["skill"] = 1;
      delete sortQuery["createdAt"];
    }
    if (sortParams.sortBy == "skill" && sortParams.sortOrder == "desc") {
      sortQuery["skill"] = -1;
      delete sortQuery["createdAt"];
    }

    if (role === "admin") {
      adminData = await questionSchema.aggregate([
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
          $match: {
            "userDetails.companyId": companyId,
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

      res.status(200).json({
        data: adminData[0].data,
        total: adminData[0]?.count[0]?.total || 0,
      });
    }
    if (role === "companyAdmin" || role === "member") {
      let matchQuery = {};
      if (req.body.parent === "createAssessment") {
        matchQuery = {
          $or: [
            { "userDetails.companyId": "" },
            { "userDetails.companyId": companyId },
          ],
        };
      } else {
        matchQuery = { "userDetails.companyId": companyId };
      }

      adminData = await questionSchema.aggregate([
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
        { $sort: sortQuery },
        {
          $facet: {
            count: [{ $count: "total" }],
            data: [{ $skip: offset }, { $limit: limit }],
          },
        },
      ]);

      res.status(200).json({
        data: adminData[0].data,
        total: adminData[0]?.count[0]?.total || 0,
      });
    }
  } catch (err) {
    console.log("Error Caught".err);
  }
};

exports.findAllAssessmentQuestions = async (req, res) => {
  try {
    const { currentPage, limit, deleted, companyId, role, testCategory } =
      req.body;

    let adminData = [];
    let offset = limit * (parseInt(currentPage) - 1);
    let query = {};
    query["deleted"] = deleted;

    if (testCategory) {
      query["type"] = testCategory;
    }

    let sortQuery = {};
    sortQuery["createdAt"] = -1;

    // if (role === "companyAdmin" || role === "member") {
    adminData = await questionSchema.aggregate([
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
      // {
      //   $match: { "userDetails.companyId": "" },
      // },
      {
        $match: {
          $or: [
            { "userDetails.companyId": "" },
            { "userDetails.companyId": companyId },
          ],
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

    res.status(200).json({
      data: adminData[0].data,
      total: adminData[0]?.count[0]?.total || 0,
    });
    // }
  } catch (err) {
    console.log("Error Caught".err);
  }
};

exports.createQuestion = async (req, res) => {
  try {
    let inputData = req.body;
    let blobName = "";

    let questionObj = {
      question: inputData.question,
      type: inputData.type,
      difficulty: inputData.difficulty,
      skill: inputData.skill,
      remark: inputData.remark,
      createdBy: inputData.createdBy,
      updatedBy: inputData.modifiedBy,
      imageUrl: "",
      deleted: false,
      answer: [],
      options: [],
    };

    if (inputData.type == "MCQ") {
      questionObj.answer = req.body.answer;
      questionObj.options = req.body.options;
    }

    if (inputData.uploadedFileInfo !== "") {
      const currentDate = Date.parse(new Date());
      const file = inputData.uploadedFileInfo;
      const filePath = `Questions/${inputData.createdBy}_${{ currentDate }}`;
      const fileType = file.fileType;
      const base64data = file.base64.substring(0, file.base64.length - 2);

      const uploadData = await uploadImage(
        file.fileName,
        fileType,
        base64data,
        filePath
      );
      if (uploadData) {
        const imageUrl = await getImageUrl(uploadData.result.name);
        blobName = imageUrl;
      }
      questionObj.imageUrl = blobName;
      let question = new questionSchema(questionObj);
      question.save().then((resp) => {
        res.json({
          message: "Question inserted successfully",
          data: resp,
        });
      });
    } else {
      let question = new questionSchema(questionObj);
      question.save().then((resp) => {
        res.json({
          message: "Question inserted successfully",
          data: resp,
        });
      });
    }
  } catch (err) {
    console.log("Error Caught", err);
    return res.status(500).send({
      message: "Some error has occurred, please try again later",
    });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    let inputData = req.body;
    let blobName = "";
    let questionObj = {
      question: inputData.question,
      type: inputData.type,
      difficulty: inputData.difficulty,
      skill: inputData.skill,
      remark: inputData.remark,
      createdBy: inputData.createdBy,
      updatedBy: inputData.modifiedBy,
      imageUrl: inputData?.imageUrl,
      deleted: false,
      answer: [],
      options: [],
    };

    if (inputData.type === "MCQ") {
      questionObj.answer = req.body.answer;
      questionObj.options = req.body.options;
    }

    if (inputData.uploadedFileInfo !== "") {
      console.log("@if condition");
      const currentDate = Date.parse(new Date());
      const file = inputData.uploadedFileInfo;
      const filePath = `Questions/${inputData.createdBy}_${{ currentDate }}`;
      const fileType = file.fileType;
      const base64data = file.base64.substring(0, file.base64.length - 2);

      const uploadData = await uploadImage(
        file.fileName,
        fileType,
        base64data,
        filePath
      );
      if (uploadData) {
        const imageUrl = await getImageUrl(uploadData.result.name);
        blobName = imageUrl;
      }
      questionObj.imageUrl = blobName;

      questionSchema
        .findByIdAndUpdate(inputData.id, questionObj)
        .then((data) => {
          if (!data) {
            res.status(404).send({
              message: `Error while updating question. Try again later`,
            });
          } else
            res.send({
              message: "Question updated successfully.",
              data: data,
            });
        })
        .catch((err) => {
          res.status(500).send({
            message: "Error updating Question",
          });
        });
    } else {
      console.log("questionObj-----------------", questionObj);

      questionSchema
        .findByIdAndUpdate(
          { _id: mongoose.Types.ObjectId(inputData.id) },
          questionObj
        )
        .then((data) => {
          if (!data) {
            res.status(404).send({
              message: `Error while updating question. Try again later`,
            });
          } else
            res.send({
              message: "Question updated successfully.",
              data: data,
            });
        })
        .catch((err) => {
          res.status(500).send({
            message: "Error updating Question",
          });
        });
    }
  } catch (err) {
    console.log("Error Caught", err);
    return res.status(500).send({
      message: "Some error has occurred, please try again later",
    });
  }
};

exports.removeQuestion = async (req, res) => {
  try {
    let id = req.body.id;

    questionSchema
      .findByIdAndUpdate(id, { deleted: true })
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `Error while removing the question.Please try again`,
          });
        } else
          res.send({
            message: "Question removed successfully.",
            data: data,
          });
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error removing question",
        });
      });
  } catch (err) {
    console.log("Error Caught", err);
    return res.status(500).send({
      message: "Some error has occurred, please try again later",
    });
  }
};

exports.removeMultipleQuestions = async (req, res) => {
  try {
    let idArray = req.body.questionsIds;
    let updateOperation = { $set: { deleted: true } };
    questionSchema.updateMany(
      { _id: { $in: idArray } },
      updateOperation,
      (err, result) => {
        if (err) {
          console.error(err);
        } else {
          res.send({
            message: "Questions removed successfully.",
            data: result,
          });
        }
      }
    );
  } catch (err) {
    console.log("Error Caught", err);
    return res.status(500).send({
      message: "Some error has occurred, please try again later",
    });
  }
};
