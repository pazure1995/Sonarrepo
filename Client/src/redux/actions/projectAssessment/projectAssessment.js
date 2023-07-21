import { post } from "../../../services/ApiServices";
import { findAssessmentByProjectIdUrl } from "../../../services/ServiceUrls";

export const GET_PROJECT_ASSESSMENT_DATA_BEGIN =
  "GET_PROJECT_ASSESSMENT_DATA_BEGIN";
export const GET_PROJECT_ASSESSMENT_DATA_SUCCESS =
  "GET_PROJECT_ASSESSMENT_DATA_SUCCESS";
export const GET_PROJECT_ASSESSMENT_DATA_FAILED =
  "GET_PROJECT_ASSESSMENT_DATA_FAILED";

export const getProjectAssessmentData = (data) => async (dispatch) => {
  try {
    dispatch({
      type: GET_PROJECT_ASSESSMENT_DATA_BEGIN,
    });
    const res = await post(findAssessmentByProjectIdUrl, data);
    dispatch({
      type: GET_PROJECT_ASSESSMENT_DATA_SUCCESS,
      payload: res,
    });
  } catch (err) {
    dispatch({
      type: GET_PROJECT_ASSESSMENT_DATA_FAILED,
      payload: err,
    });
  }
};
