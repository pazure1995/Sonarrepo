import moment from "moment";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { categoryData } from "../../constants/constants";

function TestFilter(props) {
  const [createdOnEnabled, setCreatedOnEnabled] = useState(false);
  const [createdOnType, setCreatedOnType] = useState("");
  const [createdOnDate, setCreatedOnDate] = useState(["", ""]);
  const [categoriesEnabled, setCategoriesEnabled] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchSkillValue, setSearchSkillValue] = useState("");
  const [searchSkill, setSearchSkill] = useState([]);
  const [searchCategoryValue, setSearchCategoryValue] = useState("");
  const [searchCategory, setSearchCategory] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [searchRoleValue, setSearchRoleValue] = useState("");
  const [searchRole, setSearchRole] = useState([]);

  useEffect(() => {
    setSelectedCategories([...props.filterInfo.testCategory]);
    setCreatedOnType(props.filterInfo.selectedDateType);
    setCreatedOnDate([...props.filterInfo.selectedDate]);
    // eslint-disable-next-line
  }, []);

  const clearAll = () => {
    setSelectedCategories([]);
    setCreatedOnDate(["", ""]);
    setCreatedOnType("");
    setSearchRoleValue("");
    setSearchSkillValue("");
  };

  const categoryHandler = (checked, category) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter((t) => t !== category));
    }
  };

  const handleSearch = (e, parent) => {
    if (parent === "skills") {
      setSearchSkillValue(e.target.value);
      setSearchSkill(
        props?.skills?.filter((item) =>
          item.toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
    } else if (parent === "categories") {
      setSearchCategoryValue(e.target.value);
      setSearchCategory(
        categoryData
          .map((x) => x.SourceName)
          .filter((item) =>
            item.toLowerCase().includes(e.target.value.toLowerCase())
          )
      );
    } else {
      setSearchRoleValue(e.target.value);
      setSearchRole(
        props?.roles?.filter((item) =>
          item.toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
    }
  };

  const splitMatchedText = (str) => {
    let regExp;
    if (searchSkillValue) {
      regExp = new RegExp(searchSkillValue, "gi");
    } else {
      regExp = new RegExp(searchRoleValue, "gi");
    }
    return str.replace(regExp, (match) => `<a href=''>${match}</a>`);
  };

  const applyFilter = () => {
    let startDate = moment(new Date(createdOnDate[0])).format("MM/DD/YYYY");
    let endDate = moment(new Date(createdOnDate[1])).format("MM/DD/YYYY");
    if (
      (createdOnType === "after" && createdOnDate[0] === "") ||
      (createdOnType === "before" &&
        createdOnDate[1] === "" &&
        createdOnDate[0] === "")
    ) {
      toast.error(`Please select a valid date`);
    } else if (
      createdOnType === "between" &&
      (createdOnDate[0] === "" || createdOnDate[1] === "")
    ) {
      if (createdOnDate[0] === "" && createdOnDate[1] === "") {
        toast.error(`Please select valid 'From' and 'To' dates`);
      } else if (createdOnDate[0] === "") {
        toast.error(`Please select a valid 'From' date`);
      } else if (createdOnDate[1] === "") {
        toast.error(`Please select a valid 'To' date`);
      } else {
        toast.error(`Please select a valid date`);
      }
    } else if (
      new Date(startDate) > new Date() &&
      (createdOnType === "after" || createdOnType === "before")
    ) {
      toast.error(`'Date' cannot be future date`);
    } else if (new Date(startDate) > new Date()) {
      toast.error(`'From Date' cannot be future date`);
    } else if (new Date(endDate) > new Date()) {
      toast.error(`'To Date' cannot be future date`);
    } else if (new Date(startDate) > new Date(endDate)) {
      toast.error(`'From Date' should not be greater than 'To Date'`);
    } else {
      props.resetSort();
      const filterInfo = {
        skills: [...selectedSkills],
        testCategory: [...selectedCategories],
        selectedDateType: createdOnType,
        selectedDate: createdOnDate,
      };
      props.setFilterInfo(filterInfo);
      props.applyFilter(filterInfo);
    }
  };

  return (
    <>
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
              <h6>
                Filter /{" "}
                {(createdOnDate[0].length > 0 || createdOnDate[1].length > 0
                  ? 1
                  : 0) +
                  selectedSkills.length +
                  selectedCategories.length}
              </h6>
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
              onClick={() => setCategoriesEnabled(!categoriesEnabled)}
            >
              <i
                className={
                  categoriesEnabled
                    ? "fal fa-angle-down fa-fw"
                    : "fal fa-angle-up fa-fw"
                }
              />
              <span className="p-relative">
                <small>Assessment Category</small>
                {selectedCategories.length > 0 && (
                  <span className="jewel"></span>
                )}
              </span>
            </button>
            {categoriesEnabled &&
              (categoryData.length > 0 ? (
                <div className="mb-4 ml-4 pl-1 pt-1">
                  <input
                    type="text"
                    placeholder="Type to filter list"
                    className="form-control form-control-filter mt-2"
                    value={searchCategoryValue}
                    onChange={(e) => {
                      handleSearch(e, "categories");
                    }}
                  />

                  <div style={{ maxHeight: "350px", overflowY: "auto" }}>
                    {searchCategoryValue
                      ? searchCategory.map((i, index) => (
                          <div
                            key={index}
                            className="d-flex align-items-center m-1"
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
                                  checked={selectedCategories.includes(i)}
                                  onChange={(e) => {
                                    categoryHandler(e.target.checked, i);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        ))
                      : categoryData?.map((i, index) => (
                          <div
                            key={index}
                            className="d-flex align-items-center m-1"
                          >
                            <div>
                              <span>{i.SourceName}</span>
                            </div>
                            <div className="ml-auto">
                              <div className="form-check form-switch">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  checked={selectedCategories.includes(i.value)}
                                  onChange={(e) =>
                                    categoryHandler(e.target.checked, i.value)
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
                        setSelectedCategories([]);
                        setSearchCategoryValue("");
                      }}
                    >
                      <small>Clear assessment category</small>
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
              onClick={() => setCreatedOnEnabled(!createdOnEnabled)}
            >
              <i
                className={
                  createdOnEnabled
                    ? "fal fa-angle-down fa-fw"
                    : "fal fa-angle-up fa-fw"
                }
              />
              <span className="p-relative">
                <small>Created on</small>
                {(createdOnType === "between"
                  ? createdOnDate[0] && createdOnDate[1]
                  : createdOnDate[0] || createdOnDate[1]) && (
                  <span className="jewel"></span>
                )}
              </span>
            </button>
            {createdOnEnabled && (
              <div>
                <div className="d-flex mt-2">
                  <select
                    onChange={(e) => {
                      setCreatedOnType(e.target.value);
                      setCreatedOnDate(["", ""]);
                    }}
                    className="form-select w-50 m-3"
                    value={createdOnType}
                  >
                    <option selected={!createdOnType}>Select Range</option>
                    <option value="after" selected={createdOnType === "after"}>
                      After
                    </option>
                    <option
                      value="before"
                      selected={createdOnType === "before"}
                    >
                      Before
                    </option>
                    <option
                      value="between"
                      selected={createdOnType === "between"}
                    >
                      Between
                    </option>
                  </select>
                  {createdOnType !== "" ? (
                    createdOnType === "after" || createdOnType === "before" ? (
                      <input
                        type="date"
                        onChange={(e) => {
                          let a = [...createdOnDate];
                          createdOnType === "before"
                            ? (a[1] = e.target.value)
                            : (a[0] = e.target.value);
                          setCreatedOnDate(a);
                        }}
                        style={{ maxHeight: "41px", margin: "14px 0px" }}
                        className="form-control date"
                        value={
                          createdOnType === "before"
                            ? createdOnDate[1]
                            : createdOnDate[0]
                        }
                        // max={maxDate}
                        required
                      />
                    ) : (
                      <>
                        <input
                          type="date"
                          style={{ maxHeight: "41px", margin: "14px 0px" }}
                          className="form-control date mr-2"
                          onChange={(e) => {
                            let a = [...createdOnDate];
                            a[0] = e.target.value;
                            setCreatedOnDate(a);
                            // setMinTo(e.target.value);
                          }}
                          value={createdOnDate[0]}
                          // max={maxFrom}
                        />
                        <input
                          type="date"
                          style={{ maxHeight: "41px", margin: "14px 0px" }}
                          className="form-control date"
                          onChange={(e) => {
                            let a = [...createdOnDate];
                            a[1] = e.target.value;
                            setCreatedOnDate(a);
                            // setMaxFrom(e.target.value);
                          }}
                          value={createdOnDate[1]}
                          // max={maxDate}
                          // min={minTo}
                        />
                      </>
                    )
                  ) : null}
                </div>
                <div className="d-flex justify-content-end py-2 px-1">
                  <button
                    className="btn btn-text"
                    onClick={() => {
                      setCreatedOnType("");
                      setCreatedOnDate(["", ""]);
                    }}
                  >
                    <span className="font-12">
                      <small>Clear created on</small>
                    </span>
                  </button>
                </div>
                <hr className="p-0" />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default TestFilter;
