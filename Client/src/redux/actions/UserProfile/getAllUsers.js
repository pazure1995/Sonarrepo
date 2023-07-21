import { getAllUsersUrl } from "../../../services/ServiceUrls";
import { post } from "../../../services/ApiServices";

export const GET_ALL_USERS_BEGIN = "GET_ALL_USERS_BEGIN";
export const GET_ALL_USERS_SUCCESS = "GET_ALL_USERS_SUCCESS";
export const GET_ALL_USERS_FAILED = "GET_ALL_USERS_FAILED";

export const getAllUsers = (data) => async (dispatch) => {
  try {
    dispatch({
      type: GET_ALL_USERS_BEGIN,
    });

    const res = await post(getAllUsersUrl, data);

    dispatch({
      type: GET_ALL_USERS_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: GET_ALL_USERS_FAILED,
      payload: err,
    });
  }
};
