import { toast } from "react-toastify";
import { post } from "../../../services/ApiServices";
import { findAllQuestionsUrl } from "../../../services/ServiceUrls";

export const GET_QUESTION_DATA_BEGIN = "GET_QUESTION_DATA_BEGIN";
export const GET_QUESTION_DATA_SUCCESS = "GET_QUESTION_DATA_SUCCESS";
export const GET_QUESTION_DATA_FAILURE = "GET_QUESTION_DATA_FAILURE";

export const getQuestionData = (payloadObj) => async (dispatch) => {
  try {
    dispatch({
      type: GET_QUESTION_DATA_BEGIN,
    });
    console.log("api call success");
    const res = await post(findAllQuestionsUrl, payloadObj);
    if (res.status === 200) {
      dispatch({
        type: GET_QUESTION_DATA_SUCCESS,
        payload: res.data,
      });
    }
  } catch (error) {
    dispatch({
      type: GET_QUESTION_DATA_FAILURE,
      payload: error.response.data,
    });

    toast.error(error.response.data.errMessage);
  }
};
