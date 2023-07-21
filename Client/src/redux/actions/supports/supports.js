import { toast } from "react-toastify";
import { post, get } from "../../../services/ApiServices";
import { getAllSupportsUrl } from "../../../services/ServiceUrls";

export const GET_SUPPORT_DATA_BEGIN = "GET_SUPPORT_DATA_BEGIN";
export const GET_SUPPORT_DATA_SUCCESS = "GET_SUPPORT_DATA_SUCCESS";
export const GET_SUPPORT_DATA_FAILURE = "GET_SUPPORT_DATA_FAILURE";

export const getAllSupports = () => async (dispatch) => {
  try {
    dispatch({
      type: GET_SUPPORT_DATA_BEGIN,
    });
    console.log("api call success");
    const res = await get(getAllSupportsUrl);
    if (res.status === 200) {
      dispatch({
        type: GET_SUPPORT_DATA_SUCCESS,
        payload: res.data,
      });
    }
  } catch (error) {
    dispatch({
      type: GET_SUPPORT_DATA_FAILURE,
      payload: error.response.data,
    });

    toast.error(error.response.data.errMessage);
  }
};
