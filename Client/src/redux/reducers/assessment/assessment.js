import {
  GET_ASSESSMENT_DATA_BEGIN,
  GET_ASSESSMENT_DATA_SUCCESS,
  GET_ASSESSMENT_DATA_FAILED,
} from "../../actions/assessment/assessment.js";

const initialState = {
  AssessmentData: null,
  AssessmentDataCount: 0,
  AssessmentDataLoading: false,
  AssessmentDataError: null,
};

export const getAssessmentDataReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_ASSESSMENT_DATA_BEGIN:
      return {
        ...state,
        AssessmentDataError: null,
        AssessmentDataLoading: true,
      };

    case GET_ASSESSMENT_DATA_SUCCESS:
      return {
        ...state,
        AssessmentData: payload.data[0]?.data,
        AssessmentDataCount: payload.data[0]?.count[0]?.total,
        AssessmentDataLoading: false,
      };

    case GET_ASSESSMENT_DATA_FAILED:
      return {
        ...state,
        AssessmentDataError: payload.error,
        AssessmentDataLoading: false,
      };
    default:
      return state;
  }
};
