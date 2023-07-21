import {
  GET_MAIL_REQUEST_DATA_BEGIN,
  GET_MAIL_REQUEST_DATA_SUCCESS,
  GET_MAIL_REQUEST_DATA_FAILED,
} from "../../actions/notificationCentre/notificationCentre";

const initialState = {
  mailRequestData: null,
  mailRequestDataCount: 0,
  mailRequestDataLoading: false,
  mailRequestDataError: null,
};

export const getMailRequestDataReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_MAIL_REQUEST_DATA_BEGIN:
      return {
        ...state,
        mailRequestDataError: null,
        mailRequestDataLoading: true,
      };

    case GET_MAIL_REQUEST_DATA_SUCCESS:
      return {
        ...state,
        mailRequestData: payload.data?.data,
        mailRequestDataCount: payload.data?.total,
        mailRequestDataLoading: false,
      };

    case GET_MAIL_REQUEST_DATA_FAILED:
      return {
        ...state,
        mailRequestDataError: payload.error,
        mailRequestDataLoading: false,
      };
    default:
      return state;
  }
};
