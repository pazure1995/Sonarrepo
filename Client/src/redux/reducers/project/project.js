import {
  GET_PROJECT_DATA_BEGIN,
  GET_PROJECT_DATA_SUCCESS,
  GET_PROJECT_DATA_FAILURE,
} from "../../actions/project/project";

const initialState = {
  projectDataLoading: false,
  projectData: null,
};

const getProjectDataReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_PROJECT_DATA_BEGIN:
      return {
        ...state,
        projectDataLoading: true,
        projectData: null,
      };

    case GET_PROJECT_DATA_SUCCESS:
      return {
        ...state,
        projectData: payload,
        projectDataLoading: false,
      };

    case GET_PROJECT_DATA_FAILURE:
      return {
        ...state,
        projectData: null,
        projectDataLoading: false,
      };

    default:
      return state;
  }
};

export { getProjectDataReducer };
