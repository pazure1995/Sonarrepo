const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
var generator = require("generate-password");
const jwt = require("jsonwebtoken");
const config = require("../../config/auth.config");
const usersSchema = require("./user.model");
const mailTemplateSchema = require("../mailtemplates/mailtemplates.modal");
const mailRequestSchema = require("../mailrequests/mailrequest.model");
const {
  uploadImage,
  getImageUrl,
} = require("../../functions/fileupload/uploadImage");

exports.signIn = async (req, res) => {
  try {
    let userRes = await usersSchema.findOne({
      email: req.body.email,
      uStatus: "Active",
    });
    if (userRes) {
      if (userRes?.deleted === true)
        return res.send({
          message: "User Is Not Registered",
          status: "deleted",
        });
      else {
        let passwordIsValid = bcrypt.compareSync(
          req.body.password,
          userRes.password
        );
        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Incorrect Password!",
          });
        }

        let token = jwt.sign(
          { id: userRes.id, role: userRes.role },
          config.secret,
          {}
        );

        let userObj = {
          token,
          id: userRes._id,
          firstName: userRes.firstName,
          lastName: userRes.lastName,
          name: userRes.firstName, // need to delete after
          address: userRes.address,
          companyName: userRes.companyName,
          phoneNumber: userRes.phoneNumber,
          companyId: userRes.companyId,
          email: userRes.email,
          role: userRes.role,
          // accessToken: token,
          companyId: userRes.companyId,
          companyLogo: userRes.companyLogo,
          subRole: userRes.subRole,
          location: userRes.location,
        };
        res.status(200).send(userObj);
      }
    } else {
      return res.status(404).send({ message: "User Not found." });
    }
  } catch (err) {
    console.log("Exception Caught", err);
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const origin = req.header("Origin");
    let userRes = await usersSchema.findOne({ email: req.body.email });
    if (!userRes) {
      return res.status(404).send({
        message: "Sorry, email is not existing !",
      });
    }
    const link = `${origin}/createPassword/${userRes._id}`;
    let mailTemplateRes = await mailTemplateSchema.findOne({
      mailType: "forgotPassword",
    });
    if (mailTemplateRes) {
      var mBody = mailTemplateRes.mailBody;
      var mSub = mailTemplateRes.mailSubject;
      var mapObj = {
        User_Name: userRes.firstName,
        Reset_Password_Link: link,
        COMPANY_NAME: userRes.companyName,
      };
      var re = new RegExp(Object.keys(mapObj).join("|"), "gi");
      mBody = mBody.replace(re, function (matched) {
        return mapObj[matched];
      });
      var mailObj = {
        mailFrom: process.env.SMTP_MAIL_USER,
        mailTo: req.body.email,
        mailSubject: mSub,
        mailContent: mBody,
        mStatus: 15,
      };
      let mailReq = new mailRequestSchema(mailObj);
      mailReq.save().then(() => {
        res.send({
          message: `Password reset link has been successfully sent to ${req.body.email}`,
        });
      });
    }
  } catch (err) {
    console.log("Exception Caught", err);
    return res.status(500).send({
      message: "Some error has occurred, please try again later",
    });
  }
};

exports.resetPasswordById = async (req, res) => {
  try {
    const { password, id } = req.body;

    bcrypt.hash(password, 10, (error, hashedPassword) => {
      if (error) {
        res.status(500).send({
          message: "Error updating password",
        });
      } else {
        usersSchema
          .findByIdAndUpdate(id, { password: hashedPassword })
          .then((data) => {
            if (!data) {
              res.status(404).send({
                message: `Cannot update User with id=${id}. Maybe User was not found!`,
              });
            } else
              res.send({
                message: "Password updated successfully.",
                data: data,
              });
          })
          .catch((err) => {
            res.status(500).send({
              message: "Error updating password",
            });
          });
      }
    });
  } catch (err) {
    console.log("Exception Caught", err);
    return res.status(500).send({
      message: "Some error has occurred, please try again later",
    });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    let userRes = await usersSchema.findOne({ email: req.body.email });
    res.send(userRes);
  } catch (err) {
    console.log("Exception Caught", err);
    return res.status(500).send({
      message: "Some error has occurred, please try again later",
    });
  }
};

exports.updateUserInfo = async (req, res) => {
  try {
    let inputData = req.body;
    let id = inputData.id;

    if (inputData.password) {
      bcrypt.hash(req.body.password, 10, (error, hashedPassword) => {
        if (error) {
          res.status(500).send({
            message: "Error updating password",
          });
        } else {
          usersSchema
            .findByIdAndUpdate(id, { password: hashedPassword })
            .then((data) => {
              if (!data) {
                res.status(404).send({
                  message: `Cannot update User with id=${id}. Maybe User was not found!`,
                });
              } else
                res.send({
                  message: "Password updated successfully.",
                  data: data,
                });
            })
            .catch((err) => {
              res.status(500).send({
                message: "Error updating password",
              });
            });
        }
      });
    } else {
      let blobName = "";
      if (inputData.companyLogo !== "") {
        const file = inputData.companyLogo;
        const filePath = `Image/${inputData.id}/`;
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
      }

      let updateObj = {
        firstName: inputData.firstName,
        lastName: inputData.lastName,
        companyLogo: blobName,
        address: inputData.address,
        zipCode: inputData.zipCode,
        city: inputData.city,
        state: inputData.state,
        country: inputData.country,
        phoneNumber: inputData.phoneNumber,
      };

      usersSchema
        .findByIdAndUpdate({ _id: id }, updateObj)
        .then((data) => {
          res.send({ message: "Profile has updated successfully" });
        })
        .catch((err) => {
          res.status(500).send({
            message: "Error updating User with id=" + id,
          });
        });
    }
  } catch (err) {
    console.log("Exception Caught", err);
    res.status(500).send({
      message: "An unexpected error occurred. please try after some time",
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { id, currentPage, limit, sortParams, filterParams, searchParam } =
      req.body;

    let offset = limit * (parseInt(currentPage) - 1);

    let query = {};
    let sortQuery = {};
    sortQuery["createdAt"] = -1;
    if (id !== "") query["createdBy"] = id;

    if (searchParam !== "") {
      query = {
        $or: [
          {
            firstName: {
              $regex: `${searchParam}`,
              $options: "i",
            },
          },
          {
            lastName: {
              $regex: `${searchParam}`,
              $options: "i",
            },
          },
          {
            email: {
              $regex: `${searchParam}`,
              $options: "i",
            },
          },
        ],
        createdBy: id,
      };
    }

    if (sortParams.sortBy == "name" && sortParams.sortOrder == "asc") {
      sortQuery["firstName"] = 1;
      delete sortQuery["createdAt"];
    }
    if (sortParams.sortBy == "name" && sortParams.sortOrder == "desc") {
      sortQuery["firstName"] = -1;
      delete sortQuery["createdAt"];
    }

    if (sortParams.sortBy == "companyName" && sortParams.sortOrder == "asc") {
      sortQuery["companyName"] = 1;
      delete sortQuery["createdAt"];
    }
    if (sortParams.sortBy == "companyName" && sortParams.sortOrder == "desc") {
      sortQuery["companyName"] = -1;
      delete sortQuery["createdAt"];
    }

    if (sortParams.sortBy == "uStatus" && sortParams.sortOrder == "asc") {
      sortQuery["uStatus"] = 1;
      delete sortQuery["createdAt"];
    }
    if (sortParams.sortBy == "uStatus" && sortParams.sortOrder == "desc") {
      sortQuery["uStatus"] = -1;
      delete sortQuery["createdAt"];
    }

    if (filterParams?.selectedStatus.length > 0) {
      query["uStatus"] = { $in: filterParams?.selectedStatus };
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

    let count = await usersSchema.find(query).countDocuments();

    let result = await usersSchema
      .find(query)
      .skip(offset)
      .limit(limit)
      .sort(sortQuery);

    let Obj = {
      data: result,
      total: count,
    };

    res.send(Obj);
  } catch (err) {
    console.log("Error Caught", err);
  }
};

exports.addUser = async (req, res) => {
  try {
    const inputData = req.body;

    let blobName = "";
    let role = "";
    const origin = req.header("Origin");

    let isUserExists = await usersSchema.findOne({
      email: inputData.email,
      companyName: inputData.companyName,
    });

    if (isUserExists) {
      return res.status(400).send({ message: "User already exists" });
    }
    if (req.body.createdByRole == "admin") {
      role = "companyAdmin";
    }
    if (req.body.createdByRole == "companyAdmin") {
      role = "member";
    }

    var password = generator.generate({
      length: 10,
      numbers: true,
    });

    let Obj = {
      companyLogo: "",
      companyName: inputData.companyName,
      createdBy: inputData.createdBy,
      companyId: inputData.companyId,
      firstName: inputData.firstName,
      lastName: inputData.lastName,
      email: inputData.email,
      uStatus: "Active",
      role: role,
    };

    if (inputData.companyLogo !== "") {
      Obj.companyLogo = inputData.companyLogo;
    }

    if (inputData?.companyLogo?.base64) {
      const file = inputData.companyLogo;
      const filePath = `Image/${inputData.id}/`;
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
    }

    Obj.companyLogo = blobName;

    const link = `${origin}`;
    let mailTemplateRes = await mailTemplateSchema.findOne({
      mailType: "addUser",
    });

    let addUserNotification = await mailTemplateSchema.findOne({
      mailType: "addUserNotification",
    });
    let mailList = [];

    bcrypt.hash(password, 10, (error, hashedPassword) => {
      if (error) {
        console.log(error);
        res.json({
          error: "Some error has occurred. please try after some time",
        });
      } else {
        Obj.password = hashedPassword;
        let userReq = new usersSchema(Obj);
        userReq.save().then(() => {
          if (mailTemplateRes) {
            var mBody = mailTemplateRes.mailBody;
            var mSub = mailTemplateRes.mailSubject;

            var mailSubMapObj = {
              Company_Name: inputData.createdByCompany,
            };

            var mapObj = {
              User_Name: inputData.firstName,
              Page_Link: link,
              Company_Name: inputData.createdByCompany,
              User_Email: inputData.email,
              User_Password: password,
            };

            var repl = new RegExp(Object.keys(mailSubMapObj).join("|"), "gi");
            mSub = mSub.replace(repl, function (matched) {
              return mailSubMapObj[matched];
            });

            var re = new RegExp(Object.keys(mapObj).join("|"), "gi");
            mBody = mBody.replace(re, function (matched) {
              return mapObj[matched];
            });
            var mailObj = {
              mailFrom: process.env.SMTP_MAIL_USER,
              mailTo: req.body.email,
              mailSubject: mSub,
              mailContent: mBody,
              mStatus: 15,
            };

            mailList.push(mailObj);
          }

          if (addUserNotification) {
            var mBody = addUserNotification.mailBody;
            var mSub = addUserNotification.mailSubject;

            var mailSubMapObj = {
              USER_ROLE: role === "companyAdmin" ? "User" : "Member",
            };

            var mapObj = {
              CREATED_BY_NAME: inputData.createdByName,
              USER_ROLE: role === "companyAdmin" ? "Company Admin" : role,
              USER_NAME: inputData.firstName + " " + inputData.lastName,
              COMPANY_NAME: inputData.createdByCompany,
            };

            var repl = new RegExp(Object.keys(mailSubMapObj).join("|"), "gi");
            mSub = mSub.replace(repl, function (matched) {
              return mailSubMapObj[matched];
            });

            var re = new RegExp(Object.keys(mapObj).join("|"), "gi");
            mBody = mBody.replace(re, function (matched) {
              return mapObj[matched];
            });
            var notifyObj = {
              mailFrom: process.env.SMTP_MAIL_USER,
              mailTo: inputData.createdByEmail,
              mailSubject: mSub,
              mailContent: mBody,
              mStatus: 15,
            };
            mailList.push(notifyObj);
          }

          mailRequestSchema.insertMany(mailList).then((result) => {
            res.status(200).json({
              message: "User Created Successfully ",
            });
          });
        });
      }
    });
  } catch (err) {
    console.log("Error Caught", err);
    return res.status(500).send({
      message: "Some error has occurred, please try again later",
    });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const {
      uStatus,
      userFirstName,
      userLastName,
      updatedByName,
      updatedByEmail,
      companyName,
      role,
      userId,
      userEmail,
    } = req.body;

    let userRole = role == "admin" ? "companyAdmin" : "member";

    usersSchema
      .updateOne(
        { _id: userId },
        {
          $set: { uStatus: uStatus },
        }
      )
      .exec()
      .then(async (result) => {
        if (uStatus === "Active") {
          let activateUserTemplate = await mailTemplateSchema.findOne({
            mailType: role == "admin" ? "activateUser" : "activateMember",
          });

          let notifyUserTemplate = await mailTemplateSchema.findOne({
            mailType: "userActivatedNotificationMail",
          });

          let mailRequestObj = [];

          if (activateUserTemplate) {
            let mBody = activateUserTemplate.mailBody;
            let mSub = activateUserTemplate.mailSubject;
            let mapObj = {
              User_Name: userFirstName + " " + userLastName,
              CreatedBy_Name: updatedByName,
              Company_Name: companyName,
              User_Role:
                userRole === "companyAdmin" ? "Company Admin" : userRole,
            };
            var re = new RegExp(Object.keys(mapObj).join("|"), "gi");
            mBody = mBody.replace(re, function (matched) {
              return mapObj[matched];
            });
            let mailObj = {
              mailFrom: process.env.SMTP_MAIL_USER,
              mailTo: updatedByEmail,
              mailSubject: mSub,
              mailContent: mBody,
              mStatus: 15,
            };

            mailRequestObj.push(mailObj);
          }
          if (notifyUserTemplate) {
            let mBody = notifyUserTemplate.mailBody;
            let mSub = notifyUserTemplate.mailSubject;
            let mapObj = {
              User_Name: userFirstName,
              CreatedBy_Name: updatedByName,
              Company_Name: companyName,
              User_Role:
                userRole === "companyAdmin" ? "Company Admin" : userRole,
            };
            var re = new RegExp(Object.keys(mapObj).join("|"), "gi");
            mBody = mBody.replace(re, function (matched) {
              return mapObj[matched];
            });
            let mailObj = {
              mailFrom: process.env.SMTP_MAIL_USER,
              mailTo: userEmail,
              mailSubject: mSub,
              mailContent: mBody,
              mStatus: 15,
            };

            mailRequestObj.push(mailObj);
          }

          mailRequestSchema.insertMany(mailRequestObj).then((result) => {
            res.status(200).json({
              message: "User Activated Successfully ",
            });
          });
        } else {
          let mailTemplateRes = await mailTemplateSchema.findOne({
            mailType: role == "admin" ? "deactivateUser" : "deactivateMember",
          });

          if (mailTemplateRes) {
            var mBody = mailTemplateRes.mailBody;
            var mSub = mailTemplateRes.mailSubject;
            var mapObj = {
              User_Name: userFirstName + " " + userLastName,
              CreatedBy_Name: updatedByName,
              Company_Name: companyName,
              User_Role:
                userRole === "companyAdmin" ? "Company Admin" : userRole,
            };
            var re = new RegExp(Object.keys(mapObj).join("|"), "gi");
            mBody = mBody.replace(re, function (matched) {
              return mapObj[matched];
            });
            var mailObj = {
              mailFrom: process.env.SMTP_MAIL_USER,
              mailTo: updatedByEmail,
              mailSubject: mSub,
              mailContent: mBody,
              mStatus: 15,
            };

            let mailReq = new mailRequestSchema(mailObj);
            mailReq.save().then(() => {
              res.status(200).json({
                message: "User Deactivated Successfully ",
              });
            });
          }
        }
      })
      .catch((error) => {
        console.log("error caught", error);
        res.status(400).json(error);
      });
  } catch (err) {
    console.log("Error Caught", err);
    return res.status(500).send({
      message: "Some error has occurred, please try again later",
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    let inputData = req.body;

    let blobName = "";
    if (inputData.companyLogo !== "") {
      const file = inputData.companyLogo;
      const filePath = `Image/${inputData.id}/`;
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
    }

    let updateObj = {
      firstName: inputData.firstName,
      lastName: inputData.lastName,
      companyLogo: blobName,
    };

    usersSchema
      .findByIdAndUpdate({ _id: inputData.id }, updateObj)
      .then((data) => {
        res.send({ message: "Successfully updated user info" });
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error updating User with id=" + id,
        });
      });
  } catch (err) {
    console.log("Error Caught", err);
    return res.status(500).send({
      message: "Some error has occurred, please try again later",
    });
  }
};

exports.getAllUsersByCompanyId = async (req, res) => {
  try {
    let inputData = req.body;

    let userResult = await usersSchema.find({ companyId: inputData.companyId });
    res.status(200).send(userResult);
  } catch (err) {
    console.log("Exception Caught", err);
    return res.status(500).send({
      message: "Some error has occurred, please try again later",
    });
  }
};
