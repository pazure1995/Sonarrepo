import { USER_PROFILE_DATA } from "../../actions/auth/auth";

const initialState = {
  userProfile: {},
};

export const authReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case USER_PROFILE_DATA:
      return {
        userProfile: payload,
      };

    default:
      return state;
  }
};
