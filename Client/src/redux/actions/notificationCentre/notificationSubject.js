import { post } from "../../../services/ApiServices";
import { getAllMailSubjectsUrl } from "../../../services/ServiceUrls";

export const GET_MAIL_SUBJECT_DATA_BEGIN = "GET_MAIL_SUBJECT_DATA_BEGIN";
export const GET_MAIL_SUBJECT_DATA_SUCCESS = "GET_MAIL_SUBJECT_DATA_SUCCESS";
export const GET_MAIL_SUBJECT_DATA_FAILED = "GET_MAIL_SUBJECT_DATA_FAILED";

export const getMailSubjectData = (data) => async (dispatch) => {
  try {
    dispatch({
      type: GET_MAIL_SUBJECT_DATA_BEGIN,
    });
    const res = await post(getAllMailSubjectsUrl, data);
    dispatch({
      type: GET_MAIL_SUBJECT_DATA_SUCCESS,
      payload: res,
    });
  } catch (err) {
    dispatch({
      type: GET_MAIL_SUBJECT_DATA_FAILED,
      payload: err,
    });
  }
};
