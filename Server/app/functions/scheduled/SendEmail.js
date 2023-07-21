const mailRequestSchema = require("../../apis/mailrequests/mailrequest.model");
const { Header, Footer, Body } = require("./Email");
const getTransporter = (mailFrom) => {
  const nodemailer = require("nodemailer");

  let username = "";
  let password = "";

  if (mailFrom == "Recruiter@high5hire.com") {
    username = mailFrom;
    password = process.env.SMTP_RECRUITER_MAIL_PASSWORD;
  } else {
    username = process.env.SMTP_MAIL_USER;
    password = process.env.SMTP_MAIL_USER_PASSWORD;
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
      user: username,
      pass: password,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  return transporter;
};

const getMailOptions = (mailToAddress, mailSub, mailBody, mailFrom) => {
  const mailAddress = mailToAddress;

  var senderName = "";

  if (mailFrom == "Recruiter@high5hire.com") {
    senderName = `High5 <Recruiter@high5hire.com>`;
  } else {
    senderName = `High5 <alerts@high5hire.com>`;
  }

  const mailOptions = {
    from: senderName,
    to: mailAddress,
    subject: mailSub,
    text: mailBody,
    html: mailBody,
  };

  return mailOptions;
};

const sendMails = (mailFrom, mailToAddress, mailSub, mailBody, mailId) => {
  const transporter = getTransporter(mailFrom);

  const mailOptions = getMailOptions(
    mailToAddress,
    mailSub,
    mailBody,
    mailFrom
  );

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      if (info.accepted.length > 0) {
        mailRequestSchema
          .findOneAndUpdate({ _id: mailId }, { mStatus: 16 })
          .then((post) => {
            console.log("Mail Sent");
          });
      }
    }
  });
};

exports.SendEmail = async () => {
  let mailRes = await mailRequestSchema.find({ mStatus: 15 });

  if (mailRes) {
    mailRes.map((item) => {
      if (item.mailTo !== null) {
        let mailFrom = item.mailFrom;
        let mailToAddress = item.mailTo;
        let mailSub = item.mailSubject;
        // let mailBody = item.mailContent;
        let mailId = item._id;

        let mailBody =
          Header + " " + Body + " " + item.mailContent + " " + Footer;

        sendMails(mailFrom, mailToAddress, mailSub, mailBody, mailId);
      }
    });
  }
};

// exports.SendEmailCandidateInvite = async (req, res) => {
//   const inputData = req.body;

//   let mailTemplateRes = await mailTemplateSchema.findOne({
//     mailType: "reminderAssessmentInvite",
//   });

//   var mBody = mailTemplateRes.mailBody;
//   var mSub = mailTemplateRes.mailSubject;

//   var mailSubMapObj = {
//     COMPANY_NAME: inputData.companyName,
//   };
//   var mapObj = {
//     CANDIDATE_FIRST_NAME: item.firstName,
//     UNIQUE_CODE: uniqueId,
//     PAGE_LINK: page_link,
//     TEST_NAME: inputData.testName,
//     TEST_CATEGORY: inputData.testCategory,
//     TEST_DURATION: inputData.testDuration,
//     CREATED_BY_NAME: inputData.createdByName,
//     COMPANY_NAME: inputData.companyName,
//   };
//   var re = new RegExp(Object.keys(mapObj).join("|"), "gi");
//   mBody = mBody.replace(re, function (matched) {
//     return mapObj[matched];
//   });

//   var repl = new RegExp(Object.keys(mailSubMapObj).join("|"), "gi");
//   mSub = mSub.replace(repl, function (matched) {
//     return mailSubMapObj[matched];
//   });

//   var mailObj = {
//     mailFrom: process.env.SMTP_RECRUITER_MAIL_USER,
//     mailTo: item.email,
//     mailSubject: mSub,
//     mailContent: mBody,
//     mStatus: 15,
//   };

//   mailList.push(mailObj);

//   // if (mailRes) {
//   //   mailRes.map((item) => {
//   //     if (item.mailTo !== null) {
//   //       let mailFrom = item.mailFrom;
//   //       let mailToAddress = item.mailTo;
//   //       let mailSub = item.mailSubject;
//   //       let mailId = item._id;
//   //       let mailBody =
//   //         Header + " " + Body + " " + item.mailContent + " " + Footer;
//   //       sendMails(mailFrom, mailToAddress, mailSub, mailBody, mailId);
//   //     }
//   //   });
//   // }
// };
