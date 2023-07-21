import {
  GET_SUPPORT_DATA_BEGIN,
  GET_SUPPORT_DATA_SUCCESS,
  GET_SUPPORT_DATA_FAILURE,
} from "../../actions/supports/supports";

const initialState = {
  supportDataLoading: false,
  supportData: null,
};

const getSupportsDataReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_SUPPORT_DATA_BEGIN:
      return {
        ...state,
        supportDataLoading: true,
        supportData: null,
      };

    case GET_SUPPORT_DATA_SUCCESS:
      return {
        ...state,
        supportData: payload,
        supportDataLoading: false,
      };

    case GET_SUPPORT_DATA_FAILURE:
      return {
        ...state,
        supportData: null,
        supportDataLoading: false,
      };

    default:
      return state;
  }
};

export { getSupportsDataReducer };
