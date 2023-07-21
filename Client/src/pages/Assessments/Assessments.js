import React, { useEffect, useRef, useState } from "react";
import Sort from "../../components/sort/Sort";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getUserToken } from "../../services/AuthServices";
import { Link } from "react-router-dom";
import { getAssessmentData } from "../../redux/actions/assessment/assessment";
import TestListView from "./TestListView";
import Pagination from "react-pagination-js";
import "react-pagination-js/dist/styles.css";
import Loader from "../../components/loader/Loader";
import {
  assessmentSortObject,
  assessmentOrderList,
} from "../../pageData/pageData";
import OutsideClickHandler from "react-outside-click-handler";
import TestFilter from "../../components/Filters/TestFilter";

const Assessments = (props) => {
  const dispatch = useDispatch();
  const Token = getUserToken();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageData, setPageData] = useState(10);
  const [sortType, setSorttype] = useState([]);
  const [sortCount, setSortCount] = useState(0);
  const [applyCount, setApplyCount] = useState(0);
  const [sortArray, setSortArray] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState(false);
  const [showTestDetails, setShowTestDetails] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [sortParams, setSortParams] = useState({
    sortOrder: "",
    sortBy: "",
  });
  const [tabActive, setTabActive] = useState({
    user: Token.role === "admin" ? false : true,
    admin: Token.role === "admin" ? true : false,
    high5hire: false,
  });
  const [filterInfo, setFilterInfo] = useState({
    skills: [],
    testCategory: [],
    selectedDateType: "",
    selectedDate: ["", ""],
  });
  const [matches, setMatches] = useState(
    window.matchMedia("(max-width: 860px)").matches
  );

  useEffect(() => {
    window
      .matchMedia("(max-width: 860px)")
      .addEventListener("change", (e) => setMatches(e.matches));
    // eslint-disable-next-line
  }, []);

  const [AssessmentData, setAssessmentData] = useState([]);

  const { AssessmentDatax, AssessmentDataLoading, AssessmentDataCount } =
    useSelector(
      (state) => ({
        AssessmentDatax: state.getAssessmentDataReducer.AssessmentData,
        AssessmentDataLoading:
          state.getAssessmentDataReducer.AssessmentDataLoading,
        AssessmentDataCount: state.getAssessmentDataReducer.AssessmentDataCount,
      }),
      shallowEqual
    );

  useEffect(() => {
    if (Token?.role === "admin") setAssessmentData(AssessmentDatax);
    if (Token?.role !== "admin")
      setAssessmentData(
        AssessmentDatax?.map((x) => ({
          ...x,
          candidateDetails: x.candidateDetails?.filter(
            (y) => y.createdBy === Token.id
          ),
          results: x.results?.filter((y) => y.createdBy === Token.id),
        }))
      );
    // eslint-disable-next-line
  }, [AssessmentDatax]);

  useEffect(() => {
    getAllAssessmentData();
    AssessmentData && findActive(AssessmentData);
    // eslint-disable-next-line
  }, [
    tabActive.admin,
    tabActive.high5hire,
    tabActive.user,
    currentPage,
    searchParam,
    filterInfo,
    sortParams,
  ]);

  const findActive = (tests) => {
    var activeCategories = [];
    tests.forEach((element) => {
      !!element.createdBy && !activeCategories.includes(element.testCategory)
        ? (activeCategories = [...activeCategories, element.testCategory])
        : (activeCategories = [...activeCategories]);

      setCategories([...activeCategories]);
    });
  };

  const getAllAssessmentData = () => {
    dispatch(
      getAssessmentData({
        sortParams: sortParams,
        filterParams: filterInfo,
        limit: pageData,
        currentPage: currentPage,
        role: Token.role,
        createdBy: Token.id,
        selectedTab: tabActive.admin
          ? "public"
          : tabActive.user
          ? "user"
          : "high5hire",
        companyId: tabActive.user ? Token.companyId : "",
        searchParam: searchParam,
      })
    );
    setFilter(false);
  };

  const changeCurrentPage = (number) => {
    setCurrentPage(number);
  };

  useEffect(() => {
    changeCurrentPage(1);
  }, [pageData]);

  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(
      false,
      setSortCount,
      setSortArray,
      setSorttype,
      applyCount
    );

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

  const onSearchChange = (e) => {
    setSearchParam(e.target.value);
    setCurrentPage(1);
  };

  const applyFilter = (filterInfo) => {
    setFilterInfo(filterInfo);
    setCurrentPage(1);
  };

  const resetSort = () => {
    setSortCount(0);
    setApplyCount(0);
    setSortArray([]);
  };
  const applySort = (sortPar) => {
    setSortParams(sortPar);
    setCurrentPage(1);
    setIsComponentVisible(false);
  };

  const [count, setCount] = useState({
    current: 0,
    total: 0,
  });

  const pageCount = (
    data,
    totalCount,
    perPageLength,
    setCount,
    currentPage
  ) => {
    let n =
      data?.length < perPageLength
        ? (Number(currentPage) - 1) * perPageLength + Number(data?.length)
        : Number(currentPage) * Number(data?.length);
    if (n)
      setCount((state) => ({
        ...state,
        current: n,
      }));

    if (totalCount) {
      setCount((state) => ({
        ...state,
        total: totalCount,
      }));
    }
  };

  useEffect(() => {
    pageCount(
      AssessmentData,
      AssessmentDataCount,
      pageData,
      setCount,
      currentPage
    );
    // eslint-disable-next-line
  }, [currentPage, AssessmentData]);

  return (
    <>
      {AssessmentDataLoading && <Loader />}
      <div className="row justify-content-center">
        <div className="col-lg-12">
          <div className="card card-flat card-borderless p-4 p-2-600 mb-3">
            {props.viewFrom === "project" ? (
              <></>
            ) : (
              <>
                {matches && (
                  <div className="">
                    <input
                      type="text"
                      placeholder="Type to search"
                      onChange={(e) => onSearchChange(e)}
                      className="form-control form-control-filter"
                    />
                  </div>
                )}
                <div className="d-flex align-items-center justify-content-between">
                  <h6 className="mb-3 ">Assessments</h6>
                  <div className="d-flex">
                    {/* ssss */}

                    {(((Token?.role === "companyAdmin" ||
                      Token?.role === "member") &&
                      !tabActive.admin) ||
                      (Token?.role === "admin" && tabActive.admin)) && (
                      <Link to="/assessments/create" state={{ data: {} }}>
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
              </>
            )}
            <div
              className="d-flex-column d-block-1200 d-lg-flex flex-lg-row align-items-end mb-3 justify-content-between border-bottom-gray2"
              style={{
                marginTop: props.viewFrom === "project" ? -45 : "",
              }}
            >
              <div
                className="col-lg-2 col-md-2 col-sm-12 col-12"
                style={{
                  minWidth: 150,
                  margin: matches ? "30px 0px -20px 0px" : "",
                }}
              >
                <select
                  onChange={(e) => {
                    setPageData(
                      e.target.value === "all"
                        ? 999999999999999
                        : Number(e.target.value)
                    );
                  }}
                  className="form-select mb-2"
                >
                  <option value="10">10</option> <option value="25">25</option>{" "}
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
                          tabActive.admin
                            ? "nav-link pb-3 bg-transparent active"
                            : "nav-link pb-3 bg-transparent"
                        }
                        onClick={() => {
                          setTabActive({
                            admin: true,
                            user: false,
                            high5hire: false,
                          });
                          setShowTestDetails(false);
                          setCurrentPage(1);
                        }}
                      >
                        <span className="bold">Public</span>
                      </button>
                    </div>

                    <div className="nav-itemd-flex justify-content-center">
                      <button
                        type="button"
                        className={
                          tabActive.user
                            ? "nav-link pb-3 bg-transparent active"
                            : "nav-link pb-3 bg-transparent"
                        }
                        onClick={() => {
                          setTabActive({
                            admin: false,
                            user: true,
                            high5hire: false,
                          });
                          setShowTestDetails(false);
                          setCurrentPage(1);
                        }}
                      >
                        <span className="bold">User</span>
                      </button>
                    </div>

                    {/* {Token.role === "admin" && (
                      <div className="nav-itemd-flex justify-content-center">
                        <button
                          type="button"
                          className={
                            tabActive.high5hire
                              ? "nav-link pb-3 bg-transparent active"
                              : "nav-link pb-3 bg-transparent"
                          }
                          onClick={() => {
                            setTabActive({
                              admin: false,
                              user: false,
                              high5hire: true,
                            });
                            setShowTestDetails(false);
                            setCurrentPage(1);
                          }}
                        >
                          <span className="bold">High5hire</span>
                        </button>
                      </div>
                    )} */}
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
                    <>
                      {!matches && (
                        <div className="">
                          <input
                            type="text"
                            placeholder="Type to search"
                            onChange={(e) => onSearchChange(e)}
                            className="form-control form-control-filter"
                          />
                        </div>
                      )}
                    </>
                  )}
                  <div className="dropdown-sort dd-sort">
                    <button
                      type="button"
                      className="btn btn-sm w-auto btn-text-accent dd-sort"
                      onClick={() => setIsComponentVisible(!isComponentVisible)}
                    >
                      <i
                        aria-hidden="true"
                        className="fad fa-sort-down font-16 dd-sort mr-1"
                      ></i>
                      Sort / {sortParams.sortOrder?.length > 0 ? 1 : 0}
                    </button>
                    {
                      <div ref={ref}>
                        {isComponentVisible && (
                          <Sort
                            resetSort={resetSort}
                            sortData={AssessmentData}
                            orderArray={assessmentOrderList}
                            sortObjects={assessmentSortObject}
                            applySort={applySort}
                            setSortCount={setSortCount}
                            sortCount={sortCount}
                            setSortArray={setSortArray}
                            sortArray={sortArray}
                            sortType={sortType}
                            setSorttype={setSorttype}
                            setApplyCount={setApplyCount}
                            sortingFor={
                              "Sort by Assessment name, Assessment category and Number of questions"
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
                      onClick={() => setFilter(true)}
                      className="btn btn-sm btn-text-accent w-auto"
                    >
                      <i className="fas fa-filter mr-1"></i>
                      Filter /{" "}
                      {filterInfo?.skills.length +
                        filterInfo.testCategory.length +
                        (filterInfo.selectedDate[0].length > 0 ||
                        filterInfo.selectedDate[1].length > 0
                          ? 1
                          : 0)}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <TestListView
              testList={AssessmentData}
              Token={Token}
              showTestDetails={showTestDetails}
              setShowTestDetails={setShowTestDetails}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              getHighlightedText={getHighlightedText}
              totalCount={AssessmentDataCount}
              pageData={pageData}
              changeCurrentPage={changeCurrentPage}
              getData={getAllAssessmentData}
            />
          </div>
        </div>
      </div>
      {/* <div className="d-flex p-2 mt-2 align-items-center justify-content-between border-top"> */}
      {/* <div className="ml-auto mx-auto-370 d-flex align-items-center"> */}
      {AssessmentData && AssessmentDataCount > 0 && (
        <div className="d-flex justify-content-between mx-4">
          <p>{`Showing ${count.current} of ${count.total}`}</p>
          <Pagination
            currentPage={currentPage}
            totalSize={AssessmentDataCount}
            sizePerPage={pageData}
            firstPageText="⟨⟨"
            lastPageText="⟩⟩"
            showFirstLastPages={true}
            changeCurrentPage={changeCurrentPage}
            theme="border-bottom"
          />
        </div>
      )}
      {/* </div> */}
      {/* </div> */}

      {filter && (
        <OutsideClickHandler onOutsideClick={() => setFilter(false)}>
          <TestFilter
            resetSort={resetSort}
            data={AssessmentData}
            filterInfo={filterInfo}
            applyFilter={applyFilter}
            setFilterInfo={setFilterInfo}
            categories={categories}
          />
        </OutsideClickHandler>
      )}
    </>
  );
};

export default Assessments;

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
