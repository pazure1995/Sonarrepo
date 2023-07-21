import { toast } from "react-toastify";
import { post } from "../../../services/ApiServices";
import { latestResultsUrl } from "../../../services/ServiceUrls";

export const GET_LATEST_RESULTS_BEGIN = "GET_LATEST_RESULTS_BEGIN";

export const GET_LATEST_RESULTS_SUCCESS = "GET_LATEST_RESULTS_SUCCESS";

export const GET_LATEST_RESULTS_FAILURE = "GET_LATEST_RESULTS_FAILURE";

export const getLatestResults = (payloadObj) => async (dispatch) => {
  console.log(" api call success");
  try {
    dispatch({
      type: GET_LATEST_RESULTS_BEGIN,
    });

    const res = await post(latestResultsUrl, payloadObj);

    if (res.status === 200) {
      dispatch({
        type: GET_LATEST_RESULTS_SUCCESS,
        payload: res.data,
      });
    }
  } catch (error) {
    dispatch({
      type: GET_LATEST_RESULTS_FAILURE,

      payload: error.response.data,
    });

    toast.error(error.response.data.errMessage);
  }
};
