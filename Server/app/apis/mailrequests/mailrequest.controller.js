const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const mailRequestSchema = require("./mailrequest.model");

exports.getAllMailRequest = async (req, res) => {
  try {
    const { id, currentPage, limit, sortParams, filterParams, searchParam } =
      req.body;

    let offset = limit * (parseInt(currentPage) - 1);

    let query = {};
    let sortQuery = {};
    sortQuery["createdAt"] = -1;

    if (searchParam !== "") {
      query = {
        $or: [
          {
            mailTo: {
              $regex: `${searchParam}`,
              $options: "i",
            },
          },
          {
            mailSubject: {
              $regex: `${searchParam}`,
              $options: "i",
            },
          },
        ],
      };
    }

    if (sortParams.sortBy == "email" && sortParams.sortOrder == "asc") {
      delete sortQuery["createdAt"];
      sortQuery["mailTo"] = 1;
    }
    if (sortParams.sortBy == "email" && sortParams.sortOrder == "desc") {
      delete sortQuery["createdAt"];
      sortQuery["mailTo"] = -1;
    }

    if (sortParams.sortBy == "subject" && sortParams.sortOrder == "asc") {
      sortQuery["mailSubject"] = 1;
      delete sortQuery["createdAt"];
    }
    if (sortParams.sortBy == "subject" && sortParams.sortOrder == "desc") {
      sortQuery["mailSubject"] = -1;
      delete sortQuery["createdAt"];
    }

    if (sortParams.sortBy == "status" && sortParams.sortOrder == "asc") {
      sortQuery["mStatus"] = 1;
      delete sortQuery["createdAt"];
    }
    if (sortParams.sortBy == "status" && sortParams.sortOrder == "desc") {
      sortQuery["mStatus"] = -1;
      delete sortQuery["createdAt"];
    }

    if (filterParams?.selectedStatus?.length > 0) {
      query["mStatus"] = { $in: filterParams?.selectedStatus };
    }

    if (filterParams?.selectedSubject?.length > 0) {
      query["mailSubject"] = { $in: filterParams?.selectedSubject };
    }

    if (filterParams?.memberFromType == "after") {
      let date = new Date(filterParams?.memberFrom[0]);
      query["createdAt"] = { $gte: date.setDate(date.getDate() + 1) };
    }
    if (filterParams?.memberFromType == "before") {
      query["createdAt"] = { $lt: new Date(filterParams?.memberFrom[1]) };
    }
    if (filterParams?.memberFromType == "between") {
      let date = new Date(filterParams?.memberFrom[0]);
      let date2 = new Date(filterParams?.memberFrom[1]);
      query["createdAt"] = {
        $lte: date2.setDate(date2.getDate() + 1),
        $gte: date,
      };
    }

    let count = await mailRequestSchema.find(query).countDocuments();

    let result = await mailRequestSchema
      .find(query)
      .sort(sortQuery)
      .skip(offset)
      .limit(limit);

    let Obj = {
      data: result,
      total: count,
    };

    res.send(Obj);
  } catch (err) {
    console.log("Error Caught", err);
  }
};

exports.getAllMailSubjects = async (req, res) => {
  try {
    let resp = await mailRequestSchema.distinct("mailSubject");
    res.send(resp);
  } catch (err) {
    console.log("Error Caught", err);
  }
};
