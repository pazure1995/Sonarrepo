import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getSkillsData } from "../../redux/actions/skills/skills";
import Loader from "../loader/Loader";

function QuestionFilter(props) {
  const dispatch = useDispatch();
  const [skillsEnabled, setSkillsEnabled] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [searchSkillValue, setSearchSkillValue] = useState("");
  const [searchSkill, setSearchSkill] = useState([]);
  const [typeEnabled, setTypeEnabled] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [skills, setSkills] = useState([]);

  const queCategory = ["MCQ", "OneWay", "Multiline"];

  useEffect(() => {
    setSelectedTypes([...props.filterInfo?.selectedTypes]);
    setSelectedSkills([...props.filterInfo?.selectedSkills]);
    // eslint-disable-next-line
  }, []);

  //get skills
  const { skillsData, skillsDataLoading } = useSelector(
    (state) => ({
      skillsData: state.getSkillsDataReducer.skillsData,
      skillsDataLoading: state.getSkillsDataReducer?.skillsDataLoading,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (!skillsData) {
      dispatch(getSkillsData());
    }
    setSkills(skillsData?.map((x) => x.skill));
    // eslint-disable-next-line
  }, [skillsData]);

  const clearAll = () => {
    setSelectedTypes([]);
    setSelectedSkills([]);
    setSearchSkillValue("");
  };

  const skillHandler = (checked, skill) => {
    if (checked) {
      setSelectedSkills([...selectedSkills, skill]);
    } else {
      setSelectedSkills(selectedSkills.filter((t) => t !== skill));
    }
  };

  const handleSearch = (e, parent) => {
    if (parent === "skills") {
      setSearchSkillValue(e.target.value);
      setSearchSkill(
        skills?.filter((item) =>
          item.toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
    }
  };

  const splitMatchedText = (str) => {
    let regExp;
    if (searchSkillValue) {
      regExp = new RegExp(searchSkillValue, "gi");
    }
    return str.replace(regExp, (match) => `<a href=''>${match}</a>`);
  };

  const typeHandler = (checked, role) => {
    if (checked) {
      setSelectedTypes([...selectedTypes, role]);
    } else {
      setSelectedTypes(selectedTypes?.filter((t) => t !== role));
    }
  };

  const applyFilter = () => {
    const filterInfo = {
      selectedTypes: selectedTypes,
      selectedSkills: selectedSkills,
    };
    props.applyFilter(filterInfo);
  };

  return (
    <>
      {skillsDataLoading && <Loader />}
      <div className="view-panel show">
        <div className="view-panel-header view-panel-header-sm">
          <div className="p-relative">
            <div className="px-3 py-3 d-flex">
              <button
                onClick={applyFilter}
                type="button"
                className="btn btn-sm btn-primary"
              >
                <i className="fal fa-check mr-2 fa-fw"></i>Done
              </button>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <div className="px-3">
              <h6>Filter / {selectedTypes.length + selectedSkills.length}</h6>
            </div>
            <div className="px-3">
              <button type="button" className="btn btn-text">
                <span className="font-bold font-14" onClick={clearAll}>
                  Clear all
                </span>
              </button>
            </div>
          </div>
        </div>
        <div className="view-panel-body view-panel-body-sm">
          <div className="mb-2">
            <button
              type="button"
              className="btn btn-collapsible"
              onClick={() => setTypeEnabled(!typeEnabled)}
            >
              <i
                className={
                  typeEnabled
                    ? "fal fa-angle-down fa-fw"
                    : "fal fa-angle-up fa-fw"
                }
              />
              <span className="p-relative">
                <small>Question Category</small>
                {selectedTypes.length > 0 && <span className="jewel"></span>}
              </span>
            </button>
            {typeEnabled &&
              (queCategory.length > 0 ? (
                <div className="mb-4 ml-4 pl-1 pt-1">
                  {queCategory.map((i, index) => (
                    <div className="d-flex align-items-center m-1" key={index}>
                      <div>
                        <span>{i}</span>
                      </div>
                      <div className="ml-auto">
                        <div className="form-check form-switch">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={selectedTypes.includes(i)}
                            onChange={(e) => typeHandler(e.target.checked, i)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="d-flex justify-content-end mt-2 px-1">
                    <button
                      className="btn btn-text"
                      onClick={() => setSelectedTypes([])}
                    >
                      <small>Clear Question Category</small>
                    </button>
                  </div>
                  <hr className="p-0" />
                </div>
              ) : (
                <div>
                  <div className="text-center p-3">
                    <div className="avatar avatar-lg">
                      <i className="fad fa-users-slash"></i>
                    </div>
                    <div className="mt-2">No Records found</div>
                  </div>
                </div>
              ))}
          </div>
          <div className="mb-2">
            <button
              type="button"
              className="btn btn-collapsible"
              onClick={() => setSkillsEnabled(!skillsEnabled)}
            >
              <i
                className={
                  skillsEnabled
                    ? "fal fa-angle-down fa-fw"
                    : "fal fa-angle-up fa-fw"
                }
              />
              <span className="p-relative">
                <small>Skill</small>
                {selectedSkills.length > 0 && <span className="jewel"></span>}
              </span>
            </button>
            {skillsEnabled &&
              (skills?.length > 0 ? (
                <div className="mb-4 ml-4 pl-1 pt-1">
                  <input
                    type="text"
                    placeholder="Type to filter list"
                    className="form-control form-control-filter mt-2"
                    value={searchSkillValue}
                    onChange={(e) => handleSearch(e, "skills")}
                  />
                  <div style={{ maxHeight: "350px", overflowY: "auto" }}>
                    {searchSkillValue
                      ? searchSkill.map((i, index) => (
                          <div
                            className="d-flex align-items-center m-1"
                            key={index}
                          >
                            <div>
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: splitMatchedText(i),
                                }}
                              ></span>
                            </div>
                            <div className="ml-auto">
                              <div className="form-check form-switch">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  checked={selectedSkills.includes(i)}
                                  onChange={(e) =>
                                    skillHandler(e.target.checked, i)
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        ))
                      : skills?.map((i, index) => (
                          <div
                            className="d-flex align-items-center m-1"
                            key={index}
                          >
                            <div>
                              <span>{i}</span>
                            </div>
                            <div className="ml-auto">
                              <div className="form-check form-switch">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  checked={selectedSkills.includes(i)}
                                  onChange={(e) =>
                                    skillHandler(e.target.checked, i)
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                  </div>
                  <div className="d-flex justify-content-end mt-2 px-1">
                    <button
                      className="btn btn-text"
                      onClick={() => {
                        setSelectedSkills([]);
                        setSearchSkillValue("");
                      }}
                    >
                      <small>Clear skill</small>
                    </button>
                  </div>
                  <hr className="p-0" />
                </div>
              ) : (
                <div>
                  <div className="text-center p-3">
                    <div className="avatar avatar-lg">
                      <i className="fad fa-users-slash"></i>
                    </div>
                    <div className="mt-2">No Records found</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default QuestionFilter;
