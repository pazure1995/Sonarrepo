const candidateSchema = require("../../../apis/candidates/candidates.model");
const mailTemplateSchema = require("../../../apis/mailtemplates/mailtemplates.modal");
const assessmentSchema = require("../../../apis/assessments/assessments.model");
const mailRequestSchema = require("../../../apis/mailrequests/mailrequest.model");
const moment = require("moment");

exports.reminderAssessment = async (req) => {
  let assessmentReminderTemplate = await mailTemplateSchema.findOne({
    mailType: "reminderAssessmentInvite",
  });

  let query = {};
  // const origin = "http://localhost:3000";
  // const origin = "https://vetdev.high5hire.com";
  const origin = "https://vetqa.high5hire.app";
  //   const origin = 'https://vetdemo.high5hire.com';

  const page_link = `${origin}/candidate`;
  query["testStatus"] = "Invited";

  try {
    let response = await candidateSchema.find(query);

    let inputData = response.filter(
      (x) =>
        moment(moment(new Date())).diff(x.createdAt, "days") >= 1 &&
        x.testStatus === "Invited"
    );

    inputData.map(async (item) => {
      if (
        item.reminderEvents.first === false &&
        moment(moment(new Date())).diff(item.createdAt, "days") === 6
      ) {
        let payload = {
          "reminderEvents.first": true,
        };
        await mailSend(item);
        await candidateSchema.findByIdAndUpdate(item._id, payload);
      }
      if (
        item.reminderEvents.second === false &&
        moment(moment(new Date())).diff(item.createdAt, "days") === 5
      ) {
        let payload = {
          "reminderEvents.second": true,
        };
        await candidateSchema.findByIdAndUpdate(item._id, payload);
        await mailSend(item);
      }
      if (
        item.reminderEvents.final === false &&
        moment(moment(new Date())).diff(item.createdAt, "days") === 1
      ) {
        let payload = {
          "reminderEvents.final": true,
        };
        await candidateSchema.findByIdAndUpdate(item._id, payload);
        await mailSend(item);
      }
    });

    async function mailSend(item) {
      console.log("item____________64", item);
      let mBody = assessmentReminderTemplate?.mailBody;
      let mSub = assessmentReminderTemplate?.mailSubject || "";
      const testAssigned = await assessmentSchema.findById(item.testAssign);

      let mapObj = {
        REVIEWER_NAME: item.reviewer?.firstName,
        CANDIDATE_NAME: item.candidateInfo?.firstName,
        CANDIDATE_FULLNAME:
          item.candidateInfo.firstName + " " + item.candidateInfo?.lastName,
        ASSESSMENT_NAME: testAssigned.testName,
        ASSESSMENT_TYPE: testAssigned.testCategory,
        PAGE_LINK: page_link,
        COMPANY_NAME: item.companyInfo?.companyName,
        JOB_TITLE: item.jobTitle,
        UNIQUE_CODE: item.uniqueCode,
        TEST_NAME: testAssigned.testName,
        TEST_CATEGORY: testAssigned.testCategory,
        TEST_DURATION: testAssigned.details?.duration,
      };

      let re = new RegExp(Object.keys(mapObj).join("|"), "gi");
      mBody = mBody?.replace(re, function (matched) {
        return mapObj[matched];
      });
      mSub = mSub?.replace(re, function (matched) {
        return mapObj[matched];
      });

      let mailObj = {
        mailFrom: process.env.SMTP_RECRUITER_MAIL_USER,
        mailTo: item.candidateInfo.email,
        mailSubject: mSub.length > 0 ? mSub : "Assessment Reminder for Vetting",
        mailContent: mBody,
        mStatus: 15,
      };

      let mailReq = new mailRequestSchema(mailObj);
      mailReq.save().then((res) => {
        console.log("mail sent to candidate", res);
      });
    }
  } catch (err) {
    console.log("err____69", err);
  }
};
