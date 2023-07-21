import {
  GET_DASHBOARD_DATA_BEGIN,
  GET_DASHBOARD_DATA_SUCCESS,
  GET_DASHBOARD_DATA_FAILURE,
} from "../../actions/dashboard/dashboardData";

const initialState = {
  dashboardDataLoading: false,
  dashboardData: null,
};

const getDashboardDataReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_DASHBOARD_DATA_BEGIN:
      return {
        ...state,

        dashboardDataLoading: true,

        dashboardData: null,
      };

    case GET_DASHBOARD_DATA_SUCCESS:
      return {
        ...state,

        dashboardData: payload,

        dashboardDataLoading: false,
      };

    case GET_DASHBOARD_DATA_FAILURE:
      return {
        ...state,

        dashboardData: null,

        dashboardDataLoading: false,
      };

    default:
      return state;
  }
};

export { getDashboardDataReducer };
