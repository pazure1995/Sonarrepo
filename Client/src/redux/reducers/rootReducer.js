import { combineReducers } from "redux";
import { authReducer } from "../reducers/auth/auth";
import { getProfileDataReducer } from "./profile/profile";
import { getAllUsersReducer } from "./UserProfile/getAllUsersReducer";
import { getQuestionDataReducer } from "./questions/questions";
import { getSkillsDataReducer } from "./skills/skills";
import { getAssessmentDataReducer } from "./assessment/assessment";
import { getProjectAssessmentDataReducer } from "./projectAssessment/projectAssessment";
import { getProjectDataReducer } from "./project/project";
import { getLatestResultsReducer } from "./dashboard/latestResults";
import { getDashboardDataReducer } from "./dashboard/dashboardData";
import { getResultDataReducer } from "./result/result";
import { getSupportsDataReducer } from "./supports/supports";
import { getMailRequestDataReducer } from "./notificationCentre/notificationCentre";
import { getMailSubjectDataReducer } from "./notificationCentre/notificationSubject";

export default combineReducers({
  authReducer,
  getProfileDataReducer,
  getAllUsersReducer,
  getQuestionDataReducer,
  getSkillsDataReducer,
  getProjectDataReducer,
  getAssessmentDataReducer,
  getProjectAssessmentDataReducer,
  getLatestResultsReducer,
  getDashboardDataReducer,
  getResultDataReducer,
  getSupportsDataReducer,
  getMailRequestDataReducer,
  getMailSubjectDataReducer,
});
