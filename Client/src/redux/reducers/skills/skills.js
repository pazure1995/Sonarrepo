import {
  GET_SKILLS_DATA_BEGIN,
  GET_SKILLS_DATA_SUCCESS,
  GET_SKILLS_DATA_FAILURE,
} from "../../actions/skills/skills";

const initialState = {
  skillsDataLoading: false,
  skillsData: null,
};

const getSkillsDataReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_SKILLS_DATA_BEGIN:
      return {
        ...state,
        skillsDataLoading: true,
        skillsData: null,
      };

    case GET_SKILLS_DATA_SUCCESS:
      return {
        ...state,
        skillsData: payload,
        skillsDataLoading: false,
      };

    case GET_SKILLS_DATA_FAILURE:
      return {
        ...state,
        skillsData: null,
        skillsDataLoading: false,
      };

    default:
      return state;
  }
};

export { getSkillsDataReducer };
