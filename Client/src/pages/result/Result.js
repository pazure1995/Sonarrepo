import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import SideNavBar from "../layout/SideNavBar";
import TopNavBar from "../layout/TopNavBar";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import OutsideClickHandler from "react-outside-click-handler";
import Completed from "./components/Completed";
import Expired from "./components/Expired";
import Invited from "./components/Invited";
import All from "./components/All";
import UnderReview from "./components/UnderReview";
import Loader from "../../components/loader/Loader";
import {
  getUserCompanyId,
  getUserId,
  getUserRole,
} from "../../services/AuthServices";
import { getResultData } from "../../redux/actions/result/result";
import { post } from "../../services/ApiServices";
import { findResultsCountUrl } from "../../services/ServiceUrls";
import Sort from "../../components/sort/Sort";
import ResultsFilter from "../../components/resultFilter/ResultFilter";
import "react-pagination-js/dist/styles.css";

const Results = () => {
  const [toggle, setToggle] = useState(false);
  const [tab, setTab] = useState("all");
  const [sortCount, setSortCount] = useState(0);
  const [applyCount, setApplyCount] = useState(0);
  const [filter, setFilter] = useState(false);
  const [sortType, setSorttype] = useState([]);
  const [sortArray, setSortArray] = useState([]);
  const [pageData, setPageData] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [fetchResult, setFetchResult] = useState(false);
  const [countOfResults, setCountOfResults] = useState({
    all: 0,
    invited: 0,
    expired: 0,
    underReview: 0,
    completed: 0,
  });
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
    createdOnDate: ["", ""],
    createdOnType: "",
  });

  const location = useLocation();
  const dataSize = 10;

  useEffect(() => {
    setTab(location.state?.tab || "all");
  }, [location.state?.tab]);

  //redux
  const dispatch = useDispatch();
  const companyId = getUserCompanyId();
  const userId = getUserId();
  const userRole = getUserRole();

  const { resultData, resultDataLoading } = useSelector(
    (state) => ({
      resultData: state.getResultDataReducer?.resultData,
      resultDataLoading: state.getResultDataReducer?.resultDataLoading,
    }),
    shallowEqual
  );

  const resultCounts = async () => {
    try {
      const res = await post(findResultsCountUrl, {
        companyId: companyId,
        createdBy: userId,
      });
      setCountOfResults(res.data);
    } catch (err) {
      console.log("err", err);
    }
  };

  useEffect(() => {
    let params = {
      selectedTab: tab,
      companyId: companyId,
      limit: 10,
      currentPage: currentPage,
      sortParams: {
        sortOrder: sortArray[0]?.order,
        sortBy: sortArray[0]?.sortValue,
      },
      filterParams: {
        assessmentCategory: filterInfo.selectedTypes,
        selectedDateType: filterInfo.createdOnType,
        selectedDate: filterInfo.createdOnDate,
      },
      createdBy: userId,
    };

    dispatch(getResultData(params));
    resultCounts();
    // eslint-disable-next-line
  }, [tab, fetchResult, pageData, currentPage]);

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
      label: "Candidate's name",
      value: "name",
      icon: "fal fa-fw fa-question mr-2 dd-sort",
    },
    {
      id: 2,
      label: "Invited on",
      value: "inviteOn",
      icon: "fal fa-fw fa-sliders-h-square mr-2 dd-sort",
    },
  ];

  useEffect(() => {
    setCurrentPage(1);
  }, [tab]);

  const toggleDiv = (type) => {
    if (type === true) {
      setToggle(true);
    } else {
      setToggle(false);
    }
  };
  const changePage = (page) => {
    setCurrentPage(page);
  };

  const scoring = (candData) => {
    let score = 0;
    let maximumScore = 0;
    if (candData?.testAssign?.testCategory === "MCQ")
      for (let i = 0; i < candData?.questions?.length; i++) {
        score = score + Number(candData?.questions[i]?.isCorrectAnswer);
      }
    else
      for (let i = 0; i < candData?.questions?.length; i++) {
        score = score + Number(candData?.questions[i]?.marks);
        maximumScore = maximumScore + 10;
      }

    var percent =
      candData?.testAssign?.testCategory === "MCQ"
        ? (Number(score) * 100) / candData?.questions?.length
        : (Number(score) * 100) / Number(maximumScore);

    return candData?.testAssign?.testCategory === "MCQ"
      ? percent?.toFixed(2)
      : (candData.testStatus = "completed"
          ? percent?.toFixed(2)
          : "Under Review");
  };

  const applySort = (close) => {
    resetFilter();
    close && setIsComponentVisible(false);
    setFetchResult(!fetchResult);
    setApplyCount(sortCount);
  };

  const applyFilter = (filterInfo) => {
    setFilterInfo({
      selectedTypes: [...filterInfo?.selectedTypes],
      createdOnDate: [...filterInfo?.createdOnDate],
      createdOnType: [...filterInfo?.createdOnType],
    });
    setFetchResult(!fetchResult);
    setFilter(false);
  };

  // const openFilter = () => {
  //   setFilter(true);
  // };

  const resetSort = () => {
    setSortCount(0);
    setApplyCount(0);
    setSortArray([]);
  };

  const resetFilter = () => {
    setFilterInfo({
      selectedTypes: [],
      createdOnDate: ["", ""],
    });
  };

  const handlePageData = (e) => {
    setPageData(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <>
      {resultDataLoading && <Loader />}
      <body
        className={toggle ? "layout1 layout1-closed close-menu" : "layout1"}
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
                      <h6 className="mb-3 ">Results</h6>
                    </div>

                    <div className="d-none d-block-768 mb-2"></div>
                    <hr className="mt-0 d-none d-block-1300 d-none-768" />
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
                      </div>{" "}
                      <div className="d-flex align-items-center justify-content-center justify-content-lg-start"></div>
                      <div className="d-flex align-items-center justify-content-center justify-content-lg-start">
                        <div className="viewOptionButtons  nav nav-tabs justify-content-between">
                          {/* ALL */}
                          <div className="nav-itemd-flex justify-content-center">
                            <button
                              type="button"
                              className={
                                tab === "all"
                                  ? "nav-link pb-3 bg-transparent active"
                                  : "nav-link pb-3 bg-transparent"
                              }
                              onClick={() => {
                                setTab("all");
                              }}
                            >
                              <span className="tag mb-1">
                                {countOfResults.all || 0}
                              </span>{" "}
                              <div>All</div>{" "}
                            </button>
                          </div>
                          {/* Invited */}
                          <div className="nav-itemd-flex justify-content-center">
                            <button
                              type="button"
                              className={
                                tab === "invited"
                                  ? "nav-link pb-3 bg-transparent active"
                                  : "nav-link pb-3 bg-transparent"
                              }
                              onClick={() => {
                                setTab("invited");
                              }}
                            >
                              <span className="tag mb-1">
                                {countOfResults.invited || 0}
                              </span>{" "}
                              <div>Invited</div>{" "}
                            </button>
                          </div>
                          {/* Under Review */}
                          <div className="nav-itemd-flex justify-content-center">
                            <button
                              type="button"
                              className={
                                tab === "underReview"
                                  ? "nav-link pb-3 bg-transparent active"
                                  : "nav-link pb-3 bg-transparent"
                              }
                              onClick={() => {
                                setTab("underReview");
                              }}
                            >
                              <span className="tag mb-1">
                                {countOfResults.underReview || 0}
                              </span>{" "}
                              <div>Under review</div>
                            </button>
                          </div>
                          {/* Completed */}
                          <div className="nav-itemd-flex justify-content-center">
                            <button
                              type="button"
                              className={
                                tab === "completed"
                                  ? "nav-link pb-3 bg-transparent active"
                                  : "nav-link pb-3 bg-transparent"
                              }
                              onClick={() => {
                                setTab("completed");
                              }}
                            >
                              <span className="tag mb-1">
                                {countOfResults.completed || 0}
                              </span>{" "}
                              <div>Completed</div>
                            </button>
                          </div>{" "}
                          {/* Expired */}
                          <div className="nav-itemd-flex justify-content-center">
                            <button
                              type="button"
                              className={
                                tab === "Expired"
                                  ? "nav-link pb-3 bg-transparent active"
                                  : "nav-link pb-3 bg-transparent"
                              }
                              onClick={() => {
                                setTab("expired");
                              }}
                            >
                              <span className="tag mb-1">
                                {countOfResults.expired || 0}
                              </span>{" "}
                              <div>Expired</div>{" "}
                            </button>
                          </div>
                        </div>
                        {/* )} */}
                      </div>
                      <div className="my-2 d-none d-block-1200"></div>
                      <div className="d-flex mb-2 align-items-center justify-content-center justify-content-even-400">
                        <div className="d-flex justify-content-end w-100 justify-content-even-400">
                          <div className="dropdown-sort dd-sort">
                            {/* <button
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
                              Sort /{" "}{applyCount}
                            </button> */}
                            <div style={{ width: 200 }}></div>
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
                                      "Sort by , Candidate name and Invited on"
                                    }
                                    setCurrentPage={setCurrentPage}
                                  />
                                )}
                              </div>
                            }
                          </div>
                          <div className="dropdown position-relative">
                            {/* <button
                              data-bs-toggle="tooltip"
                              data-bs-placement="left"
                              title="Filter"
                              type="button"
                              onClick={openFilter}
                              className="btn btn-sm btn-text-accent w-auto"
                            >
                              <i className="fas fa-filter mr-1"></i>
                              Filter /{" "}
                              {filterInfo.selectedTypes.length +
                                (filterInfo.createdOnDate[0] ? 1 : 0)}
                            </button> */}
                          </div>
                        </div>
                      </div>
                    </div>

                    {tab === "all" && resultData && (
                      <All
                        scoring={scoring}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        setPageData={setPageData}
                        resultData={resultData}
                        sizePerPage={pageData}
                        dataSize={dataSize}
                        theme="border-bottom"
                      />
                    )}
                    {tab === "completed" && resultData && (
                      <Completed
                        scoring={scoring}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        setPageData={setPageData}
                        resultData={resultData}
                        changePage={changePage}
                        countOfResults={countOfResults}
                      />
                    )}
                    {tab === "invited" && resultData && (
                      <Invited
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        setPageData={setPageData}
                        resultData={resultData}
                        changePage={changePage}
                        countOfResults={countOfResults}
                      />
                    )}
                    {tab === "underReview" && resultData && (
                      <UnderReview
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        setPageData={setPageData}
                        resultData={resultData}
                        changePage={changePage}
                        countOfResults={countOfResults}
                      />
                    )}
                    {tab === "expired" && resultData && (
                      <Expired
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        setPageData={setPageData}
                        resultData={resultData}
                        changePage={changePage}
                        countOfResults={countOfResults}
                      />
                    )}
                  </div>

                  {filter && (
                    <OutsideClickHandler
                      onOutsideClick={() => setFilter(false)}
                    >
                      <ResultsFilter
                        resetSort={resetSort}
                        setCurrentPage={setCurrentPage}
                        filterInfo={filterInfo}
                        applyFilter={applyFilter}
                      />
                    </OutsideClickHandler>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </>
  );
};

export default Results;

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
