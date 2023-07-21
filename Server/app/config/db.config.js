require("dotenv/config");

module.exports = {
  // url: `mongodb+srv://${process.env.DB_DEV_USER}:${process.env.DB_DEV_PASSWORD}@serverlessinstancevetti.jdtq5.mongodb.net/?retryWrites=true&w=majority`,
  // url: `mongodb+srv://${process.env.DB_QA_USER}:${process.env.DB_QA_PASSWORD}@vetting-qa.ud7gc.mongodb.net/?retryWrites=true&w=majority`,
  //url: `mongodb+srv://${process.env.DB_UAT_USER}:${process.env.DB_UAT_PASSWORD}@vet-uat.yiqau.mongodb.net/?retryWrites=true&w=majority`,
  // url: `mongodb+srv://${process.env.DB_PROD_USER}:${process.env.DB_PROD_PASSWORD}@cluster0.02iun.mongodb.net/?retryWrites=true&w=majority`,
  url: `mongodb+srv://${process.env.DB_DEV_USER}:${process.env.DB_DEV_PASSWORD}@serverlessinstancevetti.jdtq5.mongodb.net/vetDevDB`,
  //url: `mongodb+srv://${process.env.DB_QA_USER}:${process.env.DB_QA_PASSWORD}@vetting-qa.ud7gc.mongodb.net/vetQaDB`,
};
