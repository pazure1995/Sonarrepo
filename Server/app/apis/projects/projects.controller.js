const projectSchema = require("./projects.model");
const mongoose = require("mongoose");

exports.createProject = async (req, res) => {
  try {
    let inputData = req.body;

    let projectParams = {
      projectName: inputData.projectName,
      owner: inputData.owner,
      description: inputData.description,
      tests: inputData.tests,
      createdBy: inputData.createdBy,
      updatedBy: inputData.updatedBy,
    };

    let projectReq = new projectSchema(projectParams);
    projectReq.save().then(() => {
      res.send({
        message: "Project created successfully",
      });
    });
  } catch (err) {
    console.log("Error Caught", err);
    return res.status(500).send({
      message: "Some error has occurred, please try again later",
    });
  }
};

exports.getAllProjectsByCompanyId = async (req, res) => {
  try {
    const { limit, currentPage, companyId, sortParams, filterParams } =
      req.body;

    let query = {};
    query["deleted"] = false;
    let offset = limit * (parseInt(currentPage) - 1);

    if (filterParams?.owner !== "") {
      query["owner.id"] = filterParams.owner;
    }
    // if (filterParams?.testCategory !== "") {
    //   query["testCategory"] = filterParams?.testCategory;
    // }

    let result = await projectSchema.aggregate([
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
      { $match: { "userDetails.companyId": companyId } },
      {
        $facet: {
          count: [{ $count: "total" }],
          data: [{ $skip: offset }, { $limit: limit }],
        },
      },
    ]);
    res.send(result);
  } catch (err) {
    console.log("Error Caught", err);
    return res.status(500).send({
      message: "Some error has occurred, please try again later",
    });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { tests, projectId } = req.body;

    projectSchema
      .findByIdAndUpdate(projectId, {
        $push: { tests: { $each: tests } },
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

exports.findAllProjects = async (req, res) => {
  try {
    const { companyId } = req.body;

    let query = {};
    query["deleted"] = false;

    let result = await projectSchema.aggregate([
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
      { $match: { "userDetails.companyId": companyId } },
    ]);

    let newRes = [];
    if (result.length > 0) {
      newRes = result.map((elem) => ({
        label: elem.projectName,
        value: elem._id,
      }));
    }
    res.send(newRes);
  } catch (err) {
    console.log("Error Caught", err);
    return res.status(500).send({
      message: "Some error has occurred, please try again later",
    });
  }
};
