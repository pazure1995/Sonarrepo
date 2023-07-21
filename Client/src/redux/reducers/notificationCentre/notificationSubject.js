import {
  GET_MAIL_SUBJECT_DATA_BEGIN,
  GET_MAIL_SUBJECT_DATA_SUCCESS,
  GET_MAIL_SUBJECT_DATA_FAILED,
} from "../../actions/notificationCentre/notificationSubject";

const initialState = {
  mailSubjectData: null,
  mailSubjectDataLoading: false,
  mailSubjectDataError: null,
};

export const getMailSubjectDataReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_MAIL_SUBJECT_DATA_BEGIN:
      return {
        ...state,
        mailSubjectDataError: null,
        mailSubjectDataLoading: true,
      };

    case GET_MAIL_SUBJECT_DATA_SUCCESS:
      return {
        ...state,
        mailSubjectData: payload.data,
        mailSubjectDataLoading: false,
      };

    case GET_MAIL_SUBJECT_DATA_FAILED:
      return {
        ...state,
        mailSubjectDataError: payload.error,
        mailSubjectDataLoading: false,
      };
    default:
      return state;
  }
};
