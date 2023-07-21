import React, { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import SideNavBar from "../layout/SideNavBar";
import TopNavBar from "../layout/TopNavBar";
import CreateQuestion from "../../components/createQuestion/CreateQuestion";
import QuestionTable from "../../components/questionTable/QuestionTable";
import Sort from "../../components/sort/Sort";
import OutsideClickHandler from "react-outside-click-handler";
import QuestionFilter from "../../components/questionFilter/QuestionFilter";
import Loader from "../../components/loader/Loader";
import { getUserCompanyId, getUserRole } from "../../services/AuthServices";
import { getQuestionData } from "../../redux/actions/questions/questions";

const QuestionLibrary = () => {
  const [toggle, setToggle] = useState(false);
  const [ShowAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [TabActive, setTabActive] = useState(false);
  const [addQuestion, setAddQuestion] = useState(true);
  const [applyCount, setApplyCount] = useState(0);
  const [sortType, setSorttype] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState(false);
  const [sortArray, setSortArray] = useState([]);
  const [sortCount, setSortCount] = useState(0);
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(
      false,
      setSortCount,
      setSortArray,
      setSorttype,
      applyCount
    );
  const [filterInfo, setFilterInfo] = useState({
    selectedTypes: [],
    selectedSkills: [],
    selectedDifficulties: [],
  });
  const [countPerPage, setCountPerPage] = useState(10);
  const [fetchQueData, setFetchQueData] = useState(false);

  //redux
  const dispatch = useDispatch();
  const companyId = getUserCompanyId();
  const role = getUserRole();

  const { questionData, questionDataLoading, queCount } = useSelector(
    (state) => ({
      questionData: state.getQuestionDataReducer?.questionData?.data,
      questionDataLoading: state.getQuestionDataReducer?.questionDataLoading,
      queCount: state.getQuestionDataReducer?.questionData?.total,
    }),
    shallowEqual
  );

  useEffect(() => {
    let params = {
      deleted: false,
      companyId: TabActive ? "" : companyId,
      currentPage: currentPage,
      limit: countPerPage,
      role: TabActive ? "admin" : role,
    };

    params.sortParams = {
      sortOrder: sortArray[0]?.order,
      sortBy: sortArray[0]?.sortValue,
    };

    params.filterParams = {
      type: filterInfo.selectedTypes,
      skill: filterInfo.selectedSkills,
      difficulty: [],
    };

    console.log("params_______76", params);

    dispatch(getQuestionData(params));
    // eslint-disable-next-line
  }, [countPerPage, currentPage, fetchQueData, TabActive]);

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
      label: "Question",
      value: "question",
      icon: "fal fa-fw fa-question mr-2 dd-sort",
    },
    {
      id: 2,
      label: "Question Category",
      value: "type",
      icon: "fal fa-fw fa-sliders-h-square mr-2 dd-sort",
    },
    {
      id: 3,
      label: "Skill",
      value: "skill",
      icon: "fal fa-fw fa-briefcase mr-2 dd-sort",
    },
  ];

  const applySort = (close) => {
    setCurrentPage(1);
    setFetchQueData(!fetchQueData);
    resetFilter();
    close && setIsComponentVisible(false);
    setApplyCount(sortCount);
  };

  const applyFilter = (filterInfo) => {
    setCurrentPage(1);
    setFilterInfo(filterInfo);
    setFetchQueData(!fetchQueData);
    setFilter(false);
  };

  const openFilter = () => {
    setFilter(true);
  };

  const resetSort = () => {
    setSortCount(0);
    setApplyCount(0);
    setSortArray([]);
    // setSortOrder(new Array(3).fill().map((_) => "asc"));
  };

  const resetFilter = () => {
    setFilterInfo({
      selectedTypes: [],
      selectedSkills: [],
    });
  };

  const toggleDiv = (type) => {
    if (type === true) {
      setToggle(true);
    } else {
      setToggle(false);
    }
  };

  return (
    <>
      {questionDataLoading && <Loader />}
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
          <div className="section section-sm pt-0-768">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-12">
                  <div className="card card-flat card-borderless p-4 p-2-600 mb-3 ">
                    <div className="d-flex align-items-center justify-content-between ">
                      <h6 className="mb-3 ">Question Library</h6>
                      {(role === "admin" || !TabActive) && (
                        <button
                          type="button"
                          className="btn  btn-sm w-auto d-sm-block ml-3 mb-3"
                          onClick={() => setShowAddQuestionModal(true)}
                          data-toggle="modal"
                          data-target="#NewRequestModal"
                        >
                          <i className="fas fa-plus mr-2"></i>
                          <span className="">Create question</span>
                        </button>
                      )}
                    </div>

                    <div className="d-none d-block-768 mb-2"></div>
                    <hr className="mt-0 d-none d-block-1300 d-none-768" />
                    <div className="d-flex-column d-block-1200 d-lg-flex flex-lg-row align-items-end mb-3 justify-content-between border-bottom-gray2">
                      <div className="col-lg-2 col-md-2 col-sm-12 col-12">
                        <select
                          onChange={(e) => {
                            setCountPerPage(JSON.parse(e.target.value));
                          }}
                          className="form-select mb-2"
                        >
                          <option value={10}>10</option>{" "}
                          <option value={25}>25</option>{" "}
                          <option value={50}>50</option>{" "}
                          <option value={100}>100</option>{" "}
                          <option value={999999}>All</option>
                        </select>
                      </div>
                      <div className="d-flex align-items-center justify-content-center justify-content-lg-start">
                        {role === ("companyAdmin" || "member") && (
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
                                  setCurrentPage(1);
                                  resetFilter();
                                  resetSort();
                                }}
                              >
                                User
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="my-2 d-none d-block-1200"></div>
                      <div className="d-flex mb-2 align-items-center justify-content-center justify-content-even-400">
                        <div className="d-flex justify-content-end w-100 justify-content-even-400">
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
                                      "Sort by Question, Question Category and Skill"
                                    }
                                    setCurrentPage={setCurrentPage}
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
                              {filterInfo.selectedTypes?.length +
                                filterInfo.selectedSkills?.length}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <QuestionTable
                      TabActive={TabActive}
                      data={questionData}
                      editQuestionInQuesLib={true}
                      parent="QuestionLib"
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      queCount={queCount}
                      countPerPage={countPerPage}
                      setFetchQueData={setFetchQueData}
                      checkbox={true}
                    />
                  </div>
                  {filter && (
                    <OutsideClickHandler
                      onOutsideClick={() => setFilter(false)}
                    >
                      <QuestionFilter
                        resetSort={resetSort}
                        data={[]}
                        filterInfo={filterInfo}
                        applyFilter={applyFilter}
                        skills={[]}
                        setCurrentPage={setCurrentPage}
                      />
                    </OutsideClickHandler>
                  )}

                  {/* Modal for Creating and adding more questions */}
                  <Modal
                    show={ShowAddQuestionModal}
                    size="lg"
                    className="modal fade"
                    data-backdrop="static"
                    tabIndex={-1}
                    role="dialog"
                    aria-hidden="true"
                  >
                    <div className="modal-header" id="CreateQuestionModal">
                      <h6 className="modal-title" id="CreateQuestionModalLabel">
                        Create a question
                      </h6>
                      <button
                        type="button"
                        className="close"
                        data-dismiss="modal"
                        aria-label="Close"
                        onClick={() => setShowAddQuestionModal(false)}
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <Modal.Body>
                      <CreateQuestion
                        setShowAddQuestionModal={setShowAddQuestionModal}
                        parent="QuestionLib"
                        setAddQuestion={setAddQuestion}
                        addQuestion={addQuestion}
                        setFetchQueData={setFetchQueData}
                      />
                    </Modal.Body>
                  </Modal>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </>
  );
};

export default QuestionLibrary;

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
