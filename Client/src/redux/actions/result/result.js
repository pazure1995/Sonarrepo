import { toast } from "react-toastify";
import { post } from "../../../services/ApiServices";
import { findAllResultsUrl } from "../../../services/ServiceUrls";

export const GET_RESULT_DATA_BEGIN = "GET_RESULT_DATA_BEGIN";
export const GET_RESULT_DATA_SUCCESS = "GET_RESULT_DATA_SUCCESS";
export const GET_RESULT_DATA_FAILURE = "GET_RESULT_DATA_FAILURE";

export const getResultData = (payloadObj) => async (dispatch) => {
  try {
    dispatch({
      type: GET_RESULT_DATA_BEGIN,
    });
    console.log("api call success");
    const res = await post(findAllResultsUrl, payloadObj);
    if (res.status === 200) {
      dispatch({
        type: GET_RESULT_DATA_SUCCESS,
        payload: res,
      });
    }
  } catch (error) {
    dispatch({
      type: GET_RESULT_DATA_FAILURE,
      payload: error.response.data,
    });

    toast.error(error.response.data.errMessage);
  }
};
