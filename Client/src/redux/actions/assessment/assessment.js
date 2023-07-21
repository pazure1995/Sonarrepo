import { post } from "../../../services/ApiServices";
import { fetchAllAssessmentsUrl } from "../../../services/ServiceUrls";

export const GET_ASSESSMENT_DATA_BEGIN = "GET_ASSESSMENT_DATA_BEGIN";
export const GET_ASSESSMENT_DATA_SUCCESS = "GET_ASSESSMENT_DATA_SUCCESS";
export const GET_ASSESSMENT_DATA_FAILED = "GET_ASSESSMENT_DATA_FAILED";

export const getAssessmentData = (data) => async (dispatch) => {
  try {
    dispatch({
      type: GET_ASSESSMENT_DATA_BEGIN,
    });
    const res = await post(fetchAllAssessmentsUrl, data);
    dispatch({
      type: GET_ASSESSMENT_DATA_SUCCESS,
      payload: res,
    });
  } catch (err) {
    dispatch({
      type: GET_ASSESSMENT_DATA_FAILED,
      payload: err,
    });
  }
};
