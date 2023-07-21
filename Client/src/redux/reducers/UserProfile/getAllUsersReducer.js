import {
  GET_ALL_USERS_BEGIN,
  GET_ALL_USERS_SUCCESS,
  GET_ALL_USERS_FAILED,
} from "../../actions/UserProfile/getAllUsers";

const initialState = {
  userData: null,
  userDataCount: 0,
  userDataLoading: false,
  userDataError: null,
};

export const getAllUsersReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_ALL_USERS_BEGIN:
      return {
        ...state,
        userDataError: null,
        userDataLoading: true,
      };

    case GET_ALL_USERS_SUCCESS:
      return {
        ...state,
        userData: payload,
        userDataCount: payload.total,
        userDataLoading: false,
      };

    case GET_ALL_USERS_FAILED:
      return {
        ...state,
        userDataError: payload.error,
        userDataLoading: false,
      };
    default:
      return state;
  }
};
