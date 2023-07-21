import {
  GET_PROFILE_DATA_BEGIN,
  GET_PROFILE_DATA_SUCCESS,
  GET_PROFILE_DATA_FAILURE,
} from "../../actions/profile/profile";

const initialState = {
  profileDataLoading: false,
  profileData: null,
};

const getProfileDataReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_PROFILE_DATA_BEGIN:
      return {
        ...state,

        profileDataLoading: true,

        profileData: null,
      };

    case GET_PROFILE_DATA_SUCCESS:
      return {
        ...state,

        profileData: payload,

        profileDataLoading: false,
      };

    case GET_PROFILE_DATA_FAILURE:
      return {
        ...state,

        profileData: null,

        profileDataLoading: false,
      };

    default:
      return state;
  }
};

export { getProfileDataReducer };
