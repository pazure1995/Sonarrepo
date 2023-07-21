const cron = require("node-cron");
const EmailService = require("./app/functions/scheduled/SendEmail");
const {
  reminderAssessment,
} = require("./app/functions/scheduled/ReminderEmail/reminderEmail");

cron.schedule("* * * * * ", () => {
  EmailService.SendEmail();
});

cron.schedule("* * * * * ", async () => {
  reminderAssessment();
  console.log("corn-reminder-cliked");
});

// "* * * * * *"
//  | | | | | |
//  | | | | | |
//  | | | | | day of week
//  | | | | month
//  | | | day of month
//  | | hour
//  | minute
//  second(optional)
