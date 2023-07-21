import {
  GET_LATEST_RESULTS_BEGIN,
  GET_LATEST_RESULTS_SUCCESS,
  GET_LATEST_RESULTS_FAILURE,
} from "../../actions/dashboard/latestResults";

const initialState = {
  resultDataLoading: false,
  resultData: null,
};

const getLatestResultsReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_LATEST_RESULTS_BEGIN:
      return {
        ...state,

        resultDataLoading: true,

        resultData: null,
      };

    case GET_LATEST_RESULTS_SUCCESS:
      return {
        ...state,

        resultData: payload,

        resultDataLoading: false,
      };

    case GET_LATEST_RESULTS_FAILURE:
      return {
        ...state,

        resultData: null,

        resultDataLoading: false,
      };

    default:
      return state;
  }
};

export { getLatestResultsReducer };
