import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Sort from "../../../components/common/SortFilter/Sort";
import TestListView from "./TestListView";
import Loader from "../../../components/common/Loader";
import OutsideClickHandler from "react-outside-click-handler";
import TemplateFilter from "../../../components/common/SortFilter/TemplateFilter";

function TestList(props) {
  const userProfile = useSelector((state) => state.userProfile.userProfile);
  const companyId = useSelector(
    (state) => state.userProfile.userProfile.companyId
  );
  const [sortOrder, setSortOrder] = useState(
    new Array(3).fill().map((_) => "asc")
  );
  const [viewType, setViewType] = useState("list");
  const [filterData, setFilterData] = useState([]);
  const [sortCount, setSortCount] = useState(0);
  const [TabActive, setTabActive] = useState(
    userProfile.role === "admin" ? true : false
  );
  const [applyCount, setApplyCount] = useState(0);
  const [sortArray, setSortArray] = useState([]);
  const [testListData, setTestListData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [dataSize, setDataSize] = useState(10);
  const [results, setResults] = useState([]);
  const [skills, setSkills] = useState([]);
  const [roles, setRoles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [testsList, setTestsList] = useState([]);
  const [filter, setFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortType, setSorttype] = useState([]);
  const [showTestDetails, setShowTestDetails] = useState(false);
  const [matches, setMatches] = useState(
    window.matchMedia("(max-width: 860px)").matches
  );

  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(
      false,
      setSortCount,
      setSortArray,
      setSorttype,
      applyCount
    );
  const [filterInfo, setFilterInfo] = useState({
    selectedRoles: [],
    selectedSkills: [],
    selectedCategories: [],
    createdOnType: "",
    createdOnDate: ["", ""],
  });

  const orderList = [
    {
      value: "asc",
      label: "Ascending",
      icon: "fal fa-sort-amount-down mr-2 dd-sort",
    },
    {
      value: "desc",
      label: "Descending",
      icon: "fal fa-sort-amount-up mr-2 dd-sort",
    },
  ];
  const sortObject = [
    {
      id: 1,
      label: "Assessment name",
      value: "testName",
      icon: "fal fa-fw fa-signature mr-2 dd-sort",
    },
    {
      id: 2,
      label: "Skill",
      value: "skills[0]",
      icon: "fal fa-fw fa-briefcase mr-2 dd-sort",
    },
    {
      id: 2,
      label: "Difficulty",
      value: "difficulty",
      icon: "fal fa-fw fa-briefcase mr-2 dd-sort",
    },
    {
      id: 3,
      label: "Number of questions",
      value: "questions.length",
      icon: "fal fa-fw fa-list-ol mr-2 dd-sort",
    },
  ];

  const [workList, setWorkList] = useState(false);
  var id;

  // const onTabClick = (tab) => {
  //   setViewType(tab);
  // };

  const applySort = (sortedData, close) => {
    resetFilter();
    close && setIsComponentVisible(false);
    setFilterData(sortedData);
    setApplyCount(sortCount);
  };

  const applyFilter = (filteredData, filterInfo) => {
    setFilterInfo({
      selectedRoles: [...filterInfo.selectedRoles],
      selectedSkills: [...filterInfo.selectedSkills],
      selectedCategories: [...filterInfo.selectedCategories],
      createdOnType: filterInfo.createdOnType,
      createdOnDate: [...filterInfo.createdOnDate],
    });
    setFilterData(filteredData);
    setFilter(false);
  };

  const resetSort = () => {
    setSortCount(0);
    setApplyCount(0);
    setSortArray([]);
    setSortOrder(new Array(3).fill().map((_) => "asc"));
  };

  const resetFilter = () => {
    setFilterInfo({
      selectedRoles: [],
      selectedSkills: [],
      selectedCategories: [],
      createdOnType: "",
      createdOnDate: ["", ""],
    });
  };

  useEffect(() => {
    if (userProfile.role === "user") {
      getTests(true);
    } else {
      getTests(false);
    }
    window
      .matchMedia("(max-width: 860px)")
      .addEventListener("change", (e) => setMatches(e.matches));
    // eslint-disable-next-line
  }, []);

  const getTests = async (value) => {
    // value
    //   ? (headers = {
    //       token: userProfile.accessToken,
    //       id: userId,
    //     })
    //   : (headers = {
    //       token: userProfile.accessToken,
    //     });
    // axios
    //   .get("/candidate/all", {
    //     headers: { token: userProfile.accessToken },
    //   })
    //   .then((cand) => {
    //     axios
    //       .get(`/test/all`, {
    //         headers: { token: userProfile.accessToken },
    //       })
    //       .then((response) => {
    //         axios
    //           .get(`/result/all`, {
    //             headers: { token: userProfile.accessToken },
    //           })
    //           .then((resultData) => {
    //             const projectTest =
    //               props.viewFrom === "project"
    //                 ? response.data.filter((x) => x?.projects?.length > 0)
    //                 : response.data;
    //             const testTemp = projectTest?.map((test) => ({
    //               ...test,
    //               candidateCount: {
    //                 all:
    //                   cand?.data?.filter((c) => c.testAssign?._id === test?._id)
    //                     ?.length || 0,
    //                 completed:
    //                   resultData?.data?.filter(
    //                     (c) =>
    //                       c.testAssign?._id === test?._id &&
    //                       (c.testAssign.testCategory === "MCQ" || c.isReviewed)
    //                   )?.length || 0,
    //               },
    //             }));
    //             setTestsList(testTemp.reverse());
    //           });
    //         axios
    //           .get(`/result/all`, {
    //             headers: { token: userProfile.accessToken },
    //           })
    //           .then((response) => {
    //             setResults([...response.data]);
    //             setLoading(false);
    //           })
    //           .catch((error) => {
    //             console.log(error);
    //             setLoading(false);
    //           });
    //       })
    //       .catch((error) => {
    //         id = setInterval(timer, 3000);
    //       });
    //   })
    //   .catch((err) => console.log("error", err.message));
  };

  useEffect(() => {
    updateTests(testsList, results);
    // eslint-disable-next-line
  }, [testsList, results]);

  useEffect(() => {
    if (
      !sortCount &&
      !filterInfo.selectedRoles.length &&
      !filterInfo.selectedSkills.length &&
      !filterInfo.createdOnType
    ) {
      setFilterData(testListData);
    }
    // eslint-disable-next-line
  }, [testListData]);

  const timer = () => {
    clearInterval(id);
    setLoading(false);
  };

  const updateTests = (tests, results) => {
    const newTests = tests.map((test) => {
      const taken = results.filter(function (item) {
        return item?.testAssign?._id === test?._id;
      });
      const Test = { ...test, completed: taken };
      return Test;
    });
    setTestListData(newTests);
    findActive(newTests);
  };

  const findActive = (tests) => {
    var activeSkills = [];
    var activeRoles = [];
    var activeCategories = [];
    tests.forEach((element) => {
      const testSkills = element.skills;
      const uniqueSkills = testSkills.filter(
        (skill) => !!skill && !activeSkills.includes(skill)
      );

      activeSkills = [...activeSkills, ...uniqueSkills];

      !!element.role && !activeRoles.includes(element.role)
        ? (activeRoles = [...activeRoles, element.role])
        : (activeRoles = [...activeRoles]);

      !!element.createdBy && !activeCategories.includes(element.testCategory)
        ? (activeCategories = [...activeCategories, element.testCategory])
        : (activeCategories = [...activeCategories]);

      setSkills([...activeSkills]);
      setRoles([...activeRoles]);
      setCategories([...activeCategories]);
    });
  };

  const openFilter = () => {
    setFilter(true);
    setWorkList(false);
  };
  const handlePageData = (e) => {
    e.target.value !== "all"
      ? setDataSize(Number(e.target.value))
      : setDataSize(testsList.length);
    setCurrentPage(1);
  };

  const [searchValue, setSearchValue] = useState("");
  const onSearchChange = (e) => {
    setSearchValue(e);
    const tempSearchRes = testsList.filter((x) =>
      x.testName.toLowerCase().includes(e.toLowerCase())
    );
    setFilterData(tempSearchRes);
  };

  useEffect(() => {
    onSearchChange(props.searchValue);
    // eslint-disable-next-line
  }, [props.searchValue]);

  const getHighlightedText = (text, highlight) => {
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {parts.map((part, i) => (
          <span
            key={i}
            style={
              part?.toLowerCase() === highlight?.toLowerCase()
                ? { fontWeight: "bold", color: "#ff5f57" }
                : {}
            }
          >
            {part}
          </span>
        ))}
      </span>
    );
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="row justify-content-center">
          <div className="col-lg-12">
            <div className="card card-flat card-borderless p-4 p-2-600 mb-3">
              {props.viewFrom === "project" ? (
                <></>
              ) : (
                <>
                  {/* {matches && (
                    <div className="">
                      <input
                        type="text"
                        placeholder="Type to search"
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="form-control form-control-filter"
                      />
                    </div>
                  )} */}
                  <div className="d-flex align-items-center justify-content-between">
                    <h6 className="mb-3 ">Assessments</h6>
                    <div className="d-flex">
                      {/* ssss */}
                      {((userProfile?.role === "user" && !TabActive) ||
                        (userProfile?.role === "admin" && TabActive)) && (
                        <Link to="/assessment/create" state={{ data: {} }}>
                          <button
                            type="button"
                            className="btn btn-sm w-auto d-sm-block ml-3"
                          >
                            <i
                              aria-hidden="true"
                              className="fas fa-fw mr-2 fa-plus"
                            ></i>
                            Create Assessment
                          </button>
                        </Link>
                      )}
                    </div>
                  </div>
                  <div className="d-none d-block-768 mb-2"></div>
                  {/* <hr className="mt-0 d-none d-block-1300 d-none-768" /> */}
                </>
              )}
              <div
                className="d-flex-column d-block-1200 d-lg-flex flex-lg-row align-items-end mb-3 justify-content-between border-bottom-gray2"
                style={{ marginTop: props.viewFrom === "project" ? -45 : "" }}
              >
                {/* <div className="d-flex align-items-center justify-content-center justify-content-lg-start">
                  <div className="viewOptionButtons d-none d-xl-flex nav nav-tabs justify-content-between"></div>
                </div> */}
                <div
                  className="col-lg-2 col-md-2 col-sm-12 col-12"
                  style={{
                    minWidth: 150,
                    margin: matches ? "30px 0px -20px 0px" : "",
                  }}
                >
                  <select
                    onChange={(e) => {
                      handlePageData(e);
                    }}
                    className="form-select mb-2"
                  >
                    <option value="10">10</option>{" "}
                    <option value="25">25</option>{" "}
                    <option value="50">50</option>{" "}
                    <option value="100">100</option>{" "}
                    <option value="all">All</option>
                  </select>
                </div>
                {props.viewFrom === "project" ? (
                  <></>
                ) : (
                  <div className="d-flex align-items-center justify-content-center justify-content-lg-start">
                    <div className="viewOptionButtons  nav nav-tabs justify-content-between">
                      <div className="nav-itemd-flex justify-content-center">
                        <button
                          type="button"
                          className={
                            TabActive
                              ? "nav-link pb-3 bg-transparent active"
                              : "nav-link pb-3 bg-transparent"
                          }
                          onClick={() => {
                            setTabActive(true);
                            // setQuestionsList(adminQuestion);
                            setFilterData(testListData);
                            setShowTestDetails(false);
                            // findActive(adminQuestion);
                            setCurrentPage(1);
                            resetFilter();
                            resetSort();
                          }}
                        >
                          Public
                        </button>
                      </div>

                      <div className="nav-itemd-flex justify-content-center">
                        <button
                          type="button"
                          className={
                            !TabActive
                              ? "nav-link pb-3 bg-transparent active"
                              : "nav-link pb-3 bg-transparent"
                          }
                          onClick={() => {
                            setTabActive(false);
                            // setQuestionsList(userQuestion);
                            setFilterData(testListData);
                            setShowTestDetails(false);
                            // findActive(userQuestion);
                            setCurrentPage(1);
                            resetFilter();
                            resetSort();
                          }}
                        >
                          User
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                <div className="my-2 d-none d-block-1200"></div>
                <div className="d-flex mb-0 pt-4 pb-1 align-items-center justify-content-center justify-content-even-400">
                  <div className="d-flex justify-content-end w-100 justify-content-even-400">
                    {" "}
                    {props.viewFrom === "project" ? (
                      <></>
                    ) : (
                      <div className="">
                        <input
                          type="text"
                          placeholder="Type to search"
                          onChange={(e) => onSearchChange(e.target.value)}
                          className="form-control form-control-filter"
                        />
                      </div>
                    )}
                    <div className="dropdown-sort dd-sort">
                      <button
                        type="button"
                        className="btn btn-sm w-auto btn-text-accent dd-sort"
                        onClick={() => {
                          isComponentVisible
                            ? setIsComponentVisible(false)
                            : setIsComponentVisible(true);
                        }}
                      >
                        <i
                          aria-hidden="true"
                          className="fad fa-sort-down font-16 dd-sort mr-1"
                        ></i>
                        Sort / {applyCount}
                      </button>
                      {
                        <div ref={ref}>
                          {isComponentVisible && (
                            <Sort
                              sortData={testListData}
                              orderArray={orderList}
                              sortObjects={sortObject}
                              applySort={applySort}
                              setSortCount={setSortCount}
                              sortCount={sortCount}
                              setSortArray={setSortArray}
                              sortArray={sortArray}
                              sortType={sortType}
                              setSorttype={setSorttype}
                              setApplyCount={setApplyCount}
                              sortingFor={
                                "Sort by Assessment name, Skill, Difficulty and Number of Questions"
                              }
                            />
                          )}
                        </div>
                      }
                    </div>
                    <div className="dropdown position-relative">
                      <button
                        data-bs-toggle="tooltip"
                        data-bs-placement="left"
                        title="Filter"
                        type="button"
                        onClick={openFilter}
                        className="btn btn-sm btn-text-accent w-auto"
                      >
                        <i className="fas fa-filter mr-1"></i>
                        Filter /{" "}
                        {filterInfo.selectedRoles.length +
                          filterInfo.selectedSkills.length +
                          filterInfo.selectedCategories.length +
                          (filterInfo.createdOnDate[0] ? 1 : 0)}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {viewType === "list" && (
                <TestListView
                  testList={
                    TabActive
                      ? filterData.filter((x) => x?.createdBy?.role === "admin")
                      : userProfile.role === "admin"
                      ? filterData.filter((x) => x?.createdBy?.role === "user")
                      : filterData.filter(
                          (x) => x?.createdBy?.companyId === companyId
                        )
                  }
                  userProfile={userProfile}
                  dataSize={dataSize}
                  results={results}
                  showTestDetails={showTestDetails}
                  setShowTestDetails={setShowTestDetails}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  getHighlightedText={getHighlightedText}
                  searchValue={searchValue}
                />
              )}
            </div>
          </div>
        </div>
      )}
      {filter && (
        <OutsideClickHandler onOutsideClick={() => setFilter(false)}>
          <TemplateFilter
            resetSort={resetSort}
            data={testListData}
            filterInfo={filterInfo}
            applyFilter={applyFilter}
            skills={skills}
            categories={categories}
            // roles={roles}
          />
        </OutsideClickHandler>
      )}
    </>
  );
}

export default TestList;

function useComponentVisible(
  initialIsVisible,
  setSortCount,
  setSortArray,
  setSorttype,
  applyCount
) {
  const [isComponentVisible, setIsComponentVisible] =
    useState(initialIsVisible);
  const ref = useRef(null);
  const handleClickOutside = (event) => {
    if (
      ref.current &&
      !ref.current.contains(event.target) &&
      event.target.type !== "checkbox"
    ) {
      setIsComponentVisible(false);
      if (applyCount === 0) {
        setSortCount(0);
        setSortArray([]);
        setSorttype([]);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  return { ref, isComponentVisible, setIsComponentVisible };
}
