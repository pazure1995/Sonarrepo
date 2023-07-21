const mailTemplateSchema = require("../mailtemplates/mailtemplates.modal");
const mailRequestSchema = require("../mailrequests/mailrequest.model");

exports.sendMail = async (req, res) => {
  let inputData = req.body;
  let mailList = [];
  const origin = req.header("Origin");
  const page_link = `${origin}/result/${inputData.candidateId}`;

  let mailTemplateRes = await mailTemplateSchema.findOne({
    mailType: "resultShare",
  });

  if (mailTemplateRes) {
    let mBody = mailTemplateRes.mailBody;
    let mSub = mailTemplateRes.mailSubject;
    let mailSubMapObj = {
      COMPANY_NAME: inputData.companyName,
      CANDIDATE_FULLNAME: inputData.fullName,
    };
    let mapObj = {
      PAGE_LINK: page_link,
      CANDIDATE_FIRSTNAME: inputData.firstName,
      CANDIDATE_FULLNAME: inputData.fullName,
      ASSESSMENT_NAME: inputData.testName,
      ASSESSMENT_CATEGORY: inputData.testCategory,
      COMPANY_NAME: inputData.companyName,
    };

    let re = new RegExp(Object.keys(mapObj).join("|"), "gi");
    mBody = mBody.replace(re, function (matched) {
      return mapObj[matched];
    });

    let repl = new RegExp(Object.keys(mailSubMapObj).join("|"), "gi");
    mSub = mSub.replace(repl, function (matched) {
      return mailSubMapObj[matched];
    });

    let mailObj = {
      mailFrom: process.env.SMTP_MAIL_USER,
      mailTo: inputData.email,
      mailSubject: mSub,
      mailContent: mBody,
      mStatus: 15,
    };
    mailList.push(mailObj);
  }

  await mailRequestSchema
    .insertMany(mailList)
    .then((mailData) => {
      res.send({
        message: "Mail sent successfully",
        mailData: mailData,
      });
    })
    .catch((err) => {
      res.send({
        message: "Mail not sent successfully",
        error: err,
      });
    });
};

exports.sendReminderMail = async (req, res) => {
  let inputData = req.body;
  let mailList = [];
  const origin = req.header("Origin");
  const page_link = `${origin}/result/${inputData.candidateId}`;

  let mailTemplateRes = await mailTemplateSchema.findOne({
    mailType: "resultShare",
  });

  if (mailTemplateRes) {
    let mBody = mailTemplateRes.mailBody;
    let mSub = mailTemplateRes.mailSubject;
    let mailSubMapObj = {
      COMPANY_NAME: inputData.companyName,
      CANDIDATE_FULLNAME: inputData.fullName,
    };
    let mapObj = {
      PAGE_LINK: page_link,
      CANDIDATE_FIRSTNAME: inputData.firstName,
      CANDIDATE_FULLNAME: inputData.fullName,
      ASSESSMENT_NAME: inputData.testName,
      ASSESSMENT_CATEGORY: inputData.testCategory,
      COMPANY_NAME: inputData.companyName,
    };

    let re = new RegExp(Object.keys(mapObj).join("|"), "gi");
    mBody = mBody.replace(re, function (matched) {
      return mapObj[matched];
    });

    let repl = new RegExp(Object.keys(mailSubMapObj).join("|"), "gi");
    mSub = mSub.replace(repl, function (matched) {
      return mailSubMapObj[matched];
    });

    let mailObj = {
      mailFrom: process.env.SMTP_MAIL_USER,
      mailTo: inputData.email,
      mailSubject: mSub,
      mailContent: mBody,
      mStatus: 15,
    };
    mailList.push(mailObj);
  }

  await mailRequestSchema
    .insertMany(mailList)
    .then((mailData) => {
      res.send({
        message: "Mail sent successfully",
        mailData: mailData,
      });
    })
    .catch((err) => {
      res.send({
        message: "Mail not sent successfully",
        error: err,
      });
    });
};
