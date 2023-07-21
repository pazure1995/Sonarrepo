import {
  GET_RESULT_DATA_BEGIN,
  GET_RESULT_DATA_SUCCESS,
  GET_RESULT_DATA_FAILURE,
} from "../../actions/result/result";

const initialState = {
  resultDataLoading: false,
  resultData: null,
};

const getResultDataReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_RESULT_DATA_BEGIN:
      return {
        ...state,
        resultDataLoading: true,
        resultData: null,
        total: 0,
      };

    case GET_RESULT_DATA_SUCCESS:
      return {
        ...state,
        resultData: payload.data,
        total: payload.count,
        resultDataLoading: false,
      };

    case GET_RESULT_DATA_FAILURE:
      return {
        ...state,
        resultData: null,
        resultDataLoading: false,
      };

    default:
      return state;
  }
};

export { getResultDataReducer };
