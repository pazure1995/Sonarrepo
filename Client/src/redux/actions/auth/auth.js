export const USER_PROFILE_DATA = "USER_PROFILE_DATA";

export const authData = (data) => {
  return {
    type: USER_PROFILE_DATA,
    payload: data,
  };
};
