import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import OutsideClickHandler from "react-outside-click-handler";
import SideNavBar from "../layout/SideNavBar";
import TopNavBar from "../layout/TopNavBar";
import Modal from "react-bootstrap/Modal";
import moment from "moment";
import { toast } from "react-toastify";
import TestListView from "../Assessments/TestListView";
import Loader from "../../components/loader/Loader";
import Sort from "../../components/sort/Sort";
import { getUserCompanyId, getUserRole } from "../../services/AuthServices";
import { shallowEqual } from "react-redux";
import { getProjectAssessmentData } from "../../redux/actions/projectAssessment/projectAssessment";

const ProjectAssessment = (props) => {
  const dispatch = useDispatch();
  const companyId = getUserCompanyId();
  const role = getUserRole();
  const [sortOrder, setSortOrder] = useState(
    new Array(3).fill().map((_) => "asc")
  );
  const [viewType, setViewType] = useState("list");
  const [filterData, setFilterData] = useState([]);
  const [sortCount, setSortCount] = useState(0);
  const [applyCount, setApplyCount] = useState(0);
  const [sortArray, setSortArray] = useState([]);
  const [testListData, setTestListData] = useState([]);
  const [loading, setLoading] = useState(false);
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
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [showAssessmentAddModal, setShowAssessmentAddModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState({});
  const [assessments, setAssessments] = useState([]);
  const [update, setUpdate] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState({});
  const [testId, setTestId] = useState("");
  const [TabActive, setTabActive] = useState(role === "admin" ? true : false);

  const location = useLocation();
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
      label: "Number of Questions",
      value: "questions.length",
      icon: "fal fa-fw fa-list-ol mr-2 dd-sort",
    },
  ];

  const [workList, setWorkList] = useState(false);
  var id;

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
    getTests();
    // eslint-disable-next-line
  }, [location?.state?.projectId, update]);

  // findByProjectId

  useEffect(() => {
    let params = {
      projectId: location?.state?.projectId,
    };

    dispatch(getProjectAssessmentData(params));
    // eslint-disable-next-line
  }, [currentPage, filterInfo]);

  const getTests = async () => {
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
    //         setAssessments(
    //           response?.data.map((x) => ({
    //             ...x,
    //             selected: false,
    //           }))
    //         );
    //         axios
    //           .get(`/result/all`, {
    //             headers: { token: userProfile.accessToken },
    //           })
    //           .then((resultData) => {
    //             const temp = response?.data?.filter((x) =>
    //               x?.projects?.find(
    //                 (p) => p.projectId === location?.state?.projectId
    //               )
    //             );
    //             const testTemp = temp?.map((test) => ({
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
    //           })
    //           .catch((error) => {
    //             console.log(error);
    //           });
    //         setLoading(false);
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
    setLoading(false);
    clearInterval(id);
  };

  const updateTests = (tests, results) => {
    const newTests = tests?.map((test) => {
      const taken = results.filter(function (item) {
        return item?.testAssign?._id === test?._id ? true : false;
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

  const [toggle, setToggle] = useState(false);

  const toggleDiv = (type) => {
    if (type === true) {
      setToggle(true);
    } else {
      setToggle(false);
    }
  };

  const onClickAssessment = (test) => {
    setSelectedAssessment(test);
  };

  const createAssessment = async () => {
    const testBody = {
      ...selectedAssessment,
      projects: [
        ...selectedAssessment.projects,
        {
          projectName: location?.state?.projectName,
          projectId: location?.state?.projectId,
        },
      ],
      modifiedBy: {},
      deleted: false,
    };

    if (!selectedAssessment?.testName)
      return toast.error("Please select the Assessment");

    if (!location?.state?.projectName)
      return toast.error("Please select the Project");

    // setLoading(true);
    // await axios
    //   .put(
    //     `/test/${selectedAssessment._id}`,
    //     { ...testBody },
    //     {
    //       headers: { token: userProfile.accessToken },
    //     }
    //   )
    //   .then((res) => {
    //     toast.success("Assessment added successfully");
    //     setShowAssessmentModal(false);
    //     const projectBody = {
    //       ...location?.state?.project,
    //       tests: [
    //         ...location?.state?.project?.tests,
    //         {
    //           testName: selectedAssessment?.testName,
    //           testId: selectedAssessment?._id,
    //         },
    //       ],
    //     };
    //     axios
    //       .put(`project/${location?.state?.project?._id}`, projectBody, {
    //         headers: { token: userProfile.accessToken },
    //       })
    //       .then((res) => {
    //         setLoading(false);
    //         setUpdate(!update);
    //         // toast.success("updated project");
    //         setShowAssessmentModal(false);
    //         setShowAssessmentAddModal(false);
    //       })
    //       .catch((err) => {
    //         setLoading(false);
    //         toast.error("err", err.message);
    //         console.log(err.message);
    //       });
    //   })
    //   .catch((err) => {
    //     setLoading(false);
    //     console.log("err", err);
    //     toast.error("Error while adding");
    //     setShowAssessmentModal(false);
    //   });
  };

  const [searchValue, setSearchValue] = useState("");

  const onSearchChange = (e) => {
    setSearchValue(e);
    const tempSearchRes = testsList.filter((x) =>
      x.testName.toLowerCase().includes(e.toLowerCase())
    );
    setFilterData(tempSearchRes);
  };

  const getHighlightedText = (text, highlight) => {
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {parts?.map((part, i) => (
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
      <body
        className={
          toggle === true ? "layout1 layout1-closed close-menu" : "layout1"
        }
      >
        <div className="body-decorator body-decorator-top"></div>
        <div className="body-decorator body-decorator-bottom"></div>
        <SideNavBar />
        <TopNavBar heading="Dashboard" handleToggle={toggleDiv} />

        <div id="Content">
          <div id="AssessmentsApp" className="section section-sm  pt-0-768">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-12">
                  <div className="card card-flat card-borderless px-4 p-2-600 mb-3">
                    {loading ? (
                      <Loader />
                    ) : (
                      <div className="row justify-content-center">
                        <div className="col-lg-12">
                          <div className="card card-flat card-borderless px-4 p-2-600 mb-3">
                            {props.viewFrom === "project" ? (
                              <></>
                            ) : (
                              <>
                                <div className="d-flex align-items-center justify-content-between">
                                  <h6 className="mb-3 ">
                                    Assessments / {location?.state?.projectName}
                                  </h6>
                                  <div className="d-flex">
                                    <button
                                      type="button"
                                      className="btn btn-sm w-auto d-sm-block ml-3 mb-3"
                                      onClick={() => {
                                        setShowAssessmentModal(true);
                                      }}
                                    >
                                      <i
                                        aria-hidden="true"
                                        className="fas fa-fw mr-2 fa-plus"
                                      ></i>
                                      Create Assessment
                                    </button>
                                  </div>
                                </div>
                                <div className="d-none d-block-768 "></div>
                              </>
                            )}
                            <div className="d-flex-column d-block-1200 d-lg-flex flex-lg-row align-items-end mb-3 justify-content-between border-bottom-gray2">
                              <div className="col-lg-2 col-md-2 col-sm-12 col-12">
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
                              <div className="my-2 d-none d-block-1200"></div>
                              <div className="d-flex mb-0 pt-4 pb-1 align-items-center justify-content-center justify-content-even-400">
                                <div className="d-flex justify-content-end w-100 justify-content-even-400">
                                  {" "}
                                  <div>
                                    <input
                                      type="text"
                                      placeholder="Type to search"
                                      onChange={(e) =>
                                        onSearchChange(e.target.value)
                                      }
                                      className="form-control form-control-filter"
                                    />
                                  </div>
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
                                testList={filterData}
                                // userProfile={userProfile}
                                dataSize={dataSize}
                                results={results}
                                showTestDetails={showTestDetails}
                                setShowTestDetails={setShowTestDetails}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                projectTestList={true}
                                getHighlightedText={getHighlightedText}
                                searchValue={searchValue}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    {filter && (
                      <OutsideClickHandler
                        onOutsideClick={() => setFilter(false)}
                      >
                        {/* <TemplateFilter
                          resetSort={resetSort}
                          data={testListData}
                          filterInfo={filterInfo}
                          applyFilter={applyFilter}
                          skills={skills}
                          categories={categories}
                          // roles={roles}
                        /> */}
                      </OutsideClickHandler>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>

      <Modal
        show={showAssessmentModal}
        size="lg"
        className="modal fade"
        data-backdrop="static"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >
        <div className="modal-header" id="CreateQuestionModal">
          <div>
            <h6 className="" id="CreateQuestionModalLabel">
              Add Assessment
            </h6>
          </div>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            onClick={() => {
              setShowAssessmentModal(false);
              setSelectedProject({});
            }}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <Modal.Body>
          <div className="px-2 pb-2 modal-body">
            <div className="card card-flat bg-gray4 m-3">
              <div
                className="card-body p-4"
                type="button"
                onClick={() => {
                  setShowAssessmentAddModal(true);
                }}
              >
                <div className="d-flex align-item-center">
                  <div className="p-2">
                    <i
                      className="fas fa-file-alt fs-2 text mr-3"
                      style={{ color: "gray" }}
                    ></i>
                  </div>
                  <div className="" style={{ color: "#1b1a1a" }}>
                    <div className="fs-6 bold mb-1">Existing Assessment</div>
                    <div>Use an existing assessments.</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card card-flat bg-gray4 m-3">
              <Link to="/assessments/create" state={{ data: {} }}>
                <div className="card-body p-4" style={{ color: "#1b1a1a" }}>
                  <div className="d-flex">
                    <div className="p-2">
                      <i
                        className="fas fa-file fs-2 text mr-3"
                        style={{ color: "gray" }}
                      ></i>
                    </div>
                    <div>
                      <div className="fs-6 bold mb-1">
                        Create New Assessment
                      </div>
                      <div className="" style={{ fontWeight: 200 }}>
                        Create a new assessment from scratch.
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
          <div className="modal-footer mt-3 mb-0">
            <button
              className="btn btn-sm btn-secondary mr-2"
              onClick={() => {
                setShowAssessmentModal(false);
                setSelectedProject({});
              }}
            >
              Close
            </button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={showAssessmentAddModal}
        size="xl"
        className="modal fade"
        data-backdrop="static"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >
        <div className="modal-header" id="CreateQuestionModal">
          <div>
            <h6 className="" id="CreateQuestionModalLabel">
              Select Assessment
            </h6>
          </div>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            onClick={() => {
              setShowAssessmentModal(true);
              setShowAssessmentAddModal(false);
              setSelectedProject({});
            }}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <Modal.Body>
          <>
            <div className="px-2 pb-2 modal-body">
              <div className="card card-flat bg-gray4 m-3">
                <div className="card-body">
                  <div className="d-flex ">
                    <div className="form-floating col-6">
                      <input
                        type="text"
                        name=""
                        id=""
                        className="form-control"
                        defaultValue={location?.state?.projectName}
                        readOnly
                      />
                      <label>Project*</label>
                    </div>
                    {selectedProject && (
                      <div className="card mx-4 px-3 p-2 ">
                        <div className="border-bottom">
                          <strong>Owner:</strong>{" "}
                          {location?.state?.owner?.firstName}{" "}
                          {location?.state?.owner?.lastName}
                        </div>
                        <div>
                          <small>{location?.state?.description}</small>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-4 bold">Assessment*</div>
              <div className="viewOptionButtons  nav nav-tabs justify-content-center border-bottom mx-3">
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
                    }}
                  >
                    User
                  </button>
                </div>
              </div>
              <div className="card card-flat bg-gray4 m-3 ">
                <div className="card-body">
                  <div className="overflow-auto p-2" style={{ maxHeight: 500 }}>
                    {selectedAssessment?.testName?.length > 0 ? (
                      <div>
                        <a
                          href
                          className="card d-flex flex-row align-items-stretch justify-content-between mb-1 p-relative"
                        >
                          <div className="card-body d-flex align-items-center">
                            <div className="w-100 ml-2">
                              <div className="d-flex align-items-center mb-1">
                                <h6 className="mb-0 me-2">
                                  {selectedAssessment?.testName}
                                </h6>
                              </div>
                              <div className="font-regular font-primary font-gray1 text-truncate">
                                <div className="mt-1">
                                  <span className="me-1">
                                    <div className="tag tag-green3">
                                      <strong>
                                        {selectedAssessment?.testCategory}
                                      </strong>
                                    </div>
                                  </span>
                                </div>
                              </div>
                              <div
                                className="font-regular font-primary font-gray1 align-items-center mt-1"
                                style={{ overflowX: "auto" }}
                              >
                                <span className="mr-1">Skill:</span>
                                {selectedAssessment?.skills?.map(
                                  (item, index) =>
                                    (index < 2 ||
                                      selectedAssessment?._id === testId) && (
                                      <div
                                        key={index}
                                        className="tag tag-green2"
                                        style={{ margin: "2px" }}
                                      >
                                        <span>{item}</span>
                                      </div>
                                    )
                                )}
                                {selectedAssessment?._id !== testId ? (
                                  selectedAssessment?.skills?.length > 2 && (
                                    <div
                                      className="tag"
                                      onClick={() =>
                                        setTestId(selectedAssessment?._id)
                                      }
                                      style={{ margin: "2px" }}
                                    >
                                      +{selectedAssessment?.skills?.length - 2}{" "}
                                      more
                                    </div>
                                  )
                                ) : selectedAssessment?._id === testId ? (
                                  <div
                                    className="tag"
                                    onClick={() => setTestId(null)}
                                    style={{ margin: "2px" }}
                                  >
                                    Show less
                                  </div>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="card-body font-regular d-flex flex-column align-items-end justify-content-center">
                            <div className="pr-3">
                              <div className="mb-1">
                                {" "}
                                Questions:{" "}
                                {selectedAssessment.questions?.length}
                              </div>
                              <div>
                                <i
                                  aria-hidden="true"
                                  className="far fa-clock"
                                ></i>{" "}
                                {moment().diff(
                                  moment(selectedAssessment.updatedAt),
                                  "days"
                                )}{" "}
                                days ago
                              </div>
                            </div>
                          </div>
                        </a>
                        <hr />
                        <div
                          // className="card card-flat"
                          className="d-flex col-12 justify-content-center align-item-center"
                          onClick={() => {
                            setSelectedAssessment();
                          }}
                        >
                          <div
                            className="p-2 px-5 btn"
                            style={{ backgroundColor: "#" }}
                            type="button"
                          >
                            All Assessments
                          </div>
                        </div>
                      </div>
                    ) : (
                      assessments
                        ?.filter((x) =>
                          TabActive
                            ? x.createdBy.role === "admin"
                            : x.createdBy.id === "userProfile.id"
                        )
                        ?.map((x) => (
                          <a
                            key={x._id}
                            href
                            className="card d-flex flex-row align-items-stretch justify-content-between mb-1 p-relative"
                            onClick={() => {
                              onClickAssessment(x);
                            }}
                            style={{}}
                          >
                            <div className="card-body d-flex align-items-center">
                              <div className="w-100 ml-2">
                                <div className="d-flex align-items-center mb-1">
                                  <h6 className="mb-0 me-2">{x.testName}</h6>
                                </div>
                                <div className="font-regular font-primary font-gray1 text-truncate">
                                  <div className="mt-1">
                                    <span className="me-1">
                                      <div className="tag tag-green3">
                                        <strong>{x.testCategory}</strong>
                                      </div>
                                    </span>
                                  </div>
                                </div>
                                <div
                                  className="font-regular font-primary font-gray1 align-items-center mt-1"
                                  style={{ overflowX: "auto" }}
                                >
                                  <span className="mr-1">Skill:</span>
                                  {x?.skills?.map(
                                    (item, index) =>
                                      (index < 2 || x._id === testId) && (
                                        <div
                                          key={index}
                                          className="tag tag-green2"
                                          style={{ margin: "2px" }}
                                        >
                                          <span>{item}</span>
                                        </div>
                                      )
                                  )}
                                  {x._id !== testId ? (
                                    x.skills.length > 2 && (
                                      <div
                                        className="tag"
                                        onClick={() => setTestId(x._id)}
                                        style={{ margin: "2px" }}
                                      >
                                        +{x.skills.length - 2} more
                                      </div>
                                    )
                                  ) : x._id === testId ? (
                                    <div
                                      className="tag"
                                      onClick={() => setTestId(null)}
                                      style={{ margin: "2px" }}
                                    >
                                      Show less
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="card-body font-regular d-flex flex-column align-items-end justify-content-center">
                              <div className="pr-3">
                                <div className="mb-1">
                                  {" "}
                                  Questions: {x.questions?.length}
                                </div>
                                <div>
                                  Created on:
                                  {moment(x.createdAt).format("MM/DD/YYYY")}
                                </div>
                              </div>
                            </div>
                          </a>
                        ))
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className=" modal-footer text-right">
              <button
                className="btn btn-sm btn-secondary mr-2"
                onClick={() => {
                  setShowAssessmentModal(true);
                  setShowAssessmentAddModal(false);
                  setSelectedProject({});
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-sm btn-primary"
                onClick={(e) => createAssessment()}
              >
                Add Assessment
              </button>
            </div>
          </>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProjectAssessment;

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
