import React, { useEffect, useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";

const QuestionFilter = (props) => {
  const [skillsEnabled, setSkillsEnabled] = useState(false);
  const [difficultiesEnabled, setDifficultiesEnabled] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState([]);
  const [searchSkillValue, setSearchSkillValue] = useState("");
  const [searchSkill, setSearchSkill] = useState([]);
  const [skills, setSkills] = useState(props.skills?.map((x) => x.skill));
  const [difficulties, setDifficulties] = useState([]);

  const difficultiesx = ["Simple", "Medium", "Advanced"];

  useEffect(() => {
    setDifficulties(difficultiesx);
  }, difficultiesx);

  const handleSearch = (e, parent) => {
    if (parent === "skills") {
      setSearchSkillValue(e.target.value);
      setSearchSkill(
        skills?.filter((item) =>
          item.toLowerCase().includes(e.target?.value?.toLowerCase())
        )
      );
    }
  };

  useEffect(() => {
    setSkills(props?.skills?.map((x) => x.skill));
  }, [props.skills]);

  const splitMatchedText = (str) => {
    let regExp;
    if (searchSkillValue) {
      regExp = new RegExp(searchSkillValue, "gi");
    }
    return str.replace(regExp, (match) => `<a href=''>${match}</a>`);
  };

  const skillHandler = (checked, skill) => {
    if (checked) {
      setSelectedSkills([...selectedSkills, skill]);
    } else {
      setSelectedSkills(selectedSkills.filter((t) => t !== skill));
    }
  };

  const difficultyHandler = (checked, difficulty) => {
    if (checked) {
      setSelectedDifficulties([...selectedDifficulties, difficulty]);
    } else {
      setSelectedDifficulties(
        selectedDifficulties.filter((t) => t !== difficulty)
      );
    }
  };

  return (
    <div className="col-6 d-flex gap-2 justify-content-end">
      <div className="col-6">
        <div
          className="mb-2 border rounded p-2"
          style={{ backgroundColor: "white" }}
        >
          <button
            type="button"
            className="btn btn-collapsible"
            onClick={() => setDifficultiesEnabled(!difficultiesEnabled)}
          >
            <i
              className={
                difficultiesEnabled
                  ? "fal fa-angle-down fa-fw"
                  : "fal fa-angle-up fa-fw"
              }
            />
            <span className="p-relative">
              <small>Difficulty</small>
              {selectedDifficulties.length > 0 && (
                <span className="jewel"></span>
              )}
            </span>
          </button>
          <OutsideClickHandler
            onOutsideClick={() => setDifficultiesEnabled(false)}
          >
            {difficultiesEnabled &&
              (difficulties?.length > 0 ? (
                <div
                  className="mb-2 pl-1 pt-1"
                  style={{ backgroundColor: "white" }}
                >
                  <div style={{ maxHeight: "250px", overflowY: "auto" }}>
                    {difficulties?.map((i, index) => (
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
                              checked={selectedDifficulties.includes(i)}
                              onChange={(e) =>
                                difficultyHandler(e.target.checked, i)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <hr className="p-0" />
                  <div className="d-flex justify-content-between mt-1 px-1">
                    <button
                      className="btn btn-text"
                      onClick={() => {
                        setDifficultiesEnabled(!difficultiesEnabled);
                        props.setCurrentPage(1);
                        props.setFilterInfo((state) => ({
                          ...state,
                          selectedDifficulties: [...selectedDifficulties],
                        }));
                      }}
                    >
                      <strong>Done</strong>
                    </button>
                    <button
                      className="btn btn-text"
                      onClick={() => {
                        setSelectedDifficulties([]);
                        setSearchSkillValue("");
                      }}
                    >
                      <small>Clear Difficulty</small>
                    </button>
                  </div>
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
          </OutsideClickHandler>
        </div>
      </div>

      <div className="col-6">
        <div
          className="mb-2 border rounded p-2"
          style={{ backgroundColor: "white" }}
        >
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
          <OutsideClickHandler onOutsideClick={() => setSkillsEnabled(false)}>
            {skillsEnabled &&
              (skills?.length > 0 ? (
                <div className="mb-2 pl-1 pt-1">
                  <input
                    type="text"
                    placeholder="Type to filter list"
                    className="form-control form-control-filter mt-2"
                    value={searchSkillValue}
                    onChange={(e) => handleSearch(e, "skills")}
                  />
                  <div style={{ maxHeight: "250px", overflowY: "auto" }}>
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
                  <hr className="p-0" />
                  <div className="d-flex justify-content-between mt-1 px-1">
                    <button
                      className="btn btn-text"
                      onClick={() => {
                        setSkillsEnabled(!skillsEnabled);
                        props.setCurrentPage(1);
                        props.setFilterInfo((state) => ({
                          ...state,
                          selectedSkills: [...selectedSkills],
                        }));
                      }}
                    >
                      <strong>Done</strong>
                    </button>
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
          </OutsideClickHandler>
        </div>
      </div>
    </div>
  );
};

export default QuestionFilter;
