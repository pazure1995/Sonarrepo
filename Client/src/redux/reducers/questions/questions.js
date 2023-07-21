import {
  GET_QUESTION_DATA_BEGIN,
  GET_QUESTION_DATA_SUCCESS,
  GET_QUESTION_DATA_FAILURE,
} from "../../actions/questions/questions";

const initialState = {
  questionDataLoading: false,
  questionData: null,
};

const getQuestionDataReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_QUESTION_DATA_BEGIN:
      return {
        ...state,
        questionDataLoading: true,
        questionData: null,
      };

    case GET_QUESTION_DATA_SUCCESS:
      return {
        ...state,
        questionData: payload,
        questionDataLoading: false,
      };

    case GET_QUESTION_DATA_FAILURE:
      return {
        ...state,
        questionData: null,
        questionDataLoading: false,
      };

    default:
      return state;
  }
};

export { getQuestionDataReducer };
