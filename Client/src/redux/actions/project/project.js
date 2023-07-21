import { toast } from "react-toastify";
import { post } from "../../../services/ApiServices";
import { getAllProjectsByCompanyIdUrl } from "../../../services/ServiceUrls";

export const GET_PROJECT_DATA_BEGIN = "GET_PROJECT_DATA_BEGIN";
export const GET_PROJECT_DATA_SUCCESS = "GET_PROJECT_DATA_SUCCESS";
export const GET_PROJECT_DATA_FAILURE = "GET_PROJECT_DATA_FAILURE";

export const getAllProjects = (payloadObj) => async (dispatch) => {
  try {
    dispatch({
      type: GET_PROJECT_DATA_BEGIN,
    });
    console.log("api call success");
    const res = await post(getAllProjectsByCompanyIdUrl, payloadObj);
    if (res.status === 200) {
      dispatch({
        type: GET_PROJECT_DATA_SUCCESS,
        payload: res.data[0],
      });
    }
  } catch (error) {
    dispatch({
      type: GET_PROJECT_DATA_FAILURE,
      payload: error.response.data,
    });

    toast.error(error.response.data.errMessage);
  }
};
