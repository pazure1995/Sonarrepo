import { toast } from "react-toastify";
import { post } from "../../../services/ApiServices";
import { dashboardDataUrl } from "../../../services/ServiceUrls";

export const GET_DASHBOARD_DATA_BEGIN = "GET_DASHBOARD_DATA_BEGIN";

export const GET_DASHBOARD_DATA_SUCCESS = "GET_DASHBOARD_DATA_SUCCESS";

export const GET_DASHBOARD_DATA_FAILURE = "GET_DASHBOARD_DATA_FAILURE";

export const getDashboardData = (payloadObj) => async (dispatch) => {
  console.log(" api call success");
  try {
    dispatch({
      type: GET_DASHBOARD_DATA_BEGIN,
    });

    const res = await post(dashboardDataUrl, payloadObj);
    if (res.status === 200) {
      dispatch({
        type: GET_DASHBOARD_DATA_SUCCESS,
        payload: res.data,
      });
    }
  } catch (error) {
    dispatch({
      type: GET_DASHBOARD_DATA_FAILURE,

      payload: error.response.data,
    });

    toast.error(error.response.data.errMessage);
  }
};
