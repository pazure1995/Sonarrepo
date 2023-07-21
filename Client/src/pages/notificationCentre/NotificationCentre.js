import React, { useEffect, useRef, useState } from "react";
import SideNavBar from "../layout/SideNavBar";
import TopNavBar from "../layout/TopNavBar";
import Modal from "react-bootstrap/Modal";
import OutsideClickHandler from "react-outside-click-handler";
import Sort from "../../components/sort/Sort";
import Pagination from "react-pagination-js";
import "react-pagination-js/dist/styles.css";
import Loader from "../../components/loader/Loader";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getUserToken } from "../../services/AuthServices";
import NotificationTable from "./NotificationTable";
import NotificationFilter from "./NotificationFilter";
import { getNotificationData } from "../../redux/actions/notificationCentre/notificationCentre";

const NotificationCentre = () => {
  const dispatch = useDispatch();
  const [toggle, setToggle] = useState(false);
  const [pageData, setPageData] = useState(10);
  const [sortType, setSorttype] = useState([]);
  const [sortCount, setSortCount] = useState(0);
  const [applyCount, setApplyCount] = useState(0);
  const [filter, setFilter] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [sortArray, setSortArray] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openFullViewEmail, setOpenFullViewEmail] = useState(false);
  const [selectedMail, setSelectedMail] = useState({});
  const [searchParam, setSearchParam] = useState("");

  const Token = getUserToken();
  const [sortParams, setSortParams] = useState({
    sortOrder: "",
    sortBy: "",
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

  const [filterInfo, setFilterInfo] = useState({
    selectedStatus: [],
    selectedSubject: [],
    memberFromType: "",
    memberFrom: ["", ""],
  });

  const { mailRequestData, mailRequestDataLoading, mailRequestDataCount } =
    useSelector(
      (state) => ({
        mailRequestData: state.getMailRequestDataReducer?.mailRequestData,
        mailRequestDataLoading:
          state.getMailRequestDataReducer.mailRequestDataLoading,
        mailRequestDataCount:
          state.getMailRequestDataReducer.mailRequestDataCount,
      }),
      shallowEqual
    );

  useEffect(() => {
    getAllNotificationData();
    // eslint-disable-next-line
  }, [searchParam]);

  const getAllNotificationData = () => {
    dispatch(
      getNotificationData({
        id: Token.id,
        companyName: Token.companyName,
        sortParams: searchParam,
        limit: pageData,
        currentPage: currentPage,
        filterParams: filterInfo,
        searchParam: searchParam,
      })
    );
    setFilter(false);
  };

  useEffect(() => {
    changeCurrentPage(1);
    // eslint-disable-next-line
  }, [pageData]);

  useEffect(() => {
    let arr = [];
    mailRequestData?.forEach(
      (user) => !arr.includes(user.companyName) && arr.push(user.companyName)
    );
    setCompanies(arr);
  }, [mailRequestData]);

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
      label: "Email",
      value: "email",
      icon: "fal fa-fw fa-question mr-2 dd-sort",
    },
    {
      id: 2,
      label: "Subject",
      value: "subject",
      icon: "fal fa-fw fa-question mr-2 dd-sort",
    },
    {
      id: 3,
      label: "Status",
      value: "status",
      icon: "fal fa-fw fa-briefcase mr-2 dd-sort",
    },
  ];

  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(
      false,
      setSortCount,
      setSortArray,
      setSorttype,
      applyCount
    );

  const applyFilter = (filterInfo) => {
    setFilter(false);
    setCurrentPage(1);
    dispatch(
      getNotificationData({
        id: Token.id,
        companyName: Token.companyName,
        sortParams: sortParams,
        filterParams: filterInfo,
        limit: pageData,
        currentPage: currentPage,
        searchParam: searchParam,
      })
    );
  };

  const openFilter = () => {
    setFilter(true);
  };

  const resetFilter = () => {
    setFilterInfo({
      selectedStatus: [],
      selectedCompany: [],
      memberFromType: "",
      memberFrom: ["", ""],
    });
  };

  const applySort = (sortPar) => {
    setIsComponentVisible(false);
    setApplyCount(sortCount);
    setSortParams(sortPar);
    setCurrentPage(1);
    dispatch(
      getNotificationData({
        id: Token.id,
        companyName: Token.companyName,
        sortParams: sortPar,
        limit: pageData,
        currentPage: currentPage,
        filterParams: filterInfo,
        searchParam: searchParam,
      })
    );
  };

  const resetSort = () => {
    setSortCount(0);
    setApplyCount(0);
    setSortArray([]);
  };

  const toggleDiv = (type) => {
    if (type === true) {
      setToggle(true);
    } else {
      setToggle(false);
    }
  };

  const changeCurrentPage = (number) => {
    setCurrentPage(number);
    dispatch(
      getNotificationData({
        companyName: Token?.companyName,
        role: Token?.role,
        id: Token?.id,
        currentPage: number,
        limit: pageData,
        sortParams: sortParams,
        filterParams: filterInfo,
        searchParam: searchParam,
      })
    );
  };

  const [count, setCount] = useState({
    current: 0,
    total: 0,
  });

  const pageCount = () => {
    if (!mailRequestDataLoading) {
      let n =
        mailRequestData?.length < 10
          ? (Number(currentPage) - 1) * 10 + Number(mailRequestData?.length)
          : Number(currentPage) * Number(mailRequestData?.length);

      setCount((state) => ({
        ...state,
        current: n,
      }));

      setCount((state) => ({
        ...state,
        total: mailRequestDataCount,
      }));
    }
  };

  useEffect(() => {
    pageCount();
    // eslint-disable-next-line
  }, [currentPage, mailRequestData, mailRequestDataCount]);

  const onSearchChange = (e) => {
    setSearchParam(e.target.value);
    setCurrentPage(1);
  };

  return (
    <>
      {mailRequestDataLoading && <Loader />}
      <body
        className={
          toggle === true ? "layout1 layout1-closed close-menu" : "layout1"
        }
      >
        <div className="body-decorator body-decorator-top"></div>
        <div className="body-decorator body-decorator-bottom"></div>
        <SideNavBar />
        <TopNavBar handleToggle={toggleDiv} />

        <div id="Content">
          <div className="section section-sm pt-0-768">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-12">
                  <div className="card card-flat card-borderless  p-4 p-2-600 mb-3 ">
                    <div className="d-flex align-items-center justify-content-between ">
                      <h6 className="mr-3 mb-xl-4">Notification Center</h6>
                    </div>
                    <div className="d-none d-block-768 mb-2"></div>
                    <hr className="mt-0 d-none d-block-1300 d-none-768" />

                    <div className="d-flex-column d-block-1200 d-lg-flex flex-lg-row align-items-end mb-3 justify-content-between border-bottom-gray2">
                      <div className="col-lg-2 col-md-2 col-sm-12 col-12">
                        <select
                          onChange={(e) => {
                            setPageData(
                              e.target.value === "all"
                                ? 999999999999999
                                : e.target.value
                            );
                          }}
                          className="form-select mb-2"
                        >
                          1<option value="10">10</option>{" "}
                          <option value="25">25</option>{" "}
                          <option value="50">50</option>{" "}
                          <option value="100">100</option>{" "}
                          <option value="all">All</option>
                        </select>
                      </div>
                      <div className="d-flex align-items-center justify-content-center justify-content-lg-start">
                        {Token?.role === "user" && (
                          <div className="viewOptionButtons d-none d-xl-flex nav nav-tabs justify-content-between">
                            <div className="nav-itemd-flex justify-content-center"></div>
                          </div>
                        )}
                      </div>

                      <div className="my-2 d-none d-block-1200"></div>
                      <div className="d-flex mb-2 align-items-center justify-content-center justify-content-even-400">
                        <div className="d-flex justify-content-end w-100 justify-content-even-400">
                          <div>
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

                            <div ref={ref}>
                              {isComponentVisible && (
                                <Sort
                                  resetSort={resetSort}
                                  sortData={mailRequestData}
                                  orderArray={orderList}
                                  setSortParams={setSortParams}
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
                                    "Sort by Email, Subject and Status"
                                  }
                                />
                              )}
                            </div>
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
                              {filterInfo.selectedStatus?.length +
                                filterInfo.selectedSubject?.length +
                                (filterInfo.memberFrom[0] ||
                                filterInfo.memberFrom[1]
                                  ? 1
                                  : 0)}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {mailRequestData?.length > 0 ? (
                      <NotificationTable
                        emailData={mailRequestData}
                        setSelectedMail={setSelectedMail}
                        setOpenFullViewEmail={setOpenFullViewEmail}
                      />
                    ) : (
                      <div>
                        <div className="text-center p-3">
                          <div className="avatar avatar-lg">
                            <i className="fad fa-comment-slash"></i>
                          </div>
                          <div className="mt-3">No Email found</div>
                        </div>
                      </div>
                    )}

                    <div className="d-flex p-2 mt-2 align-items-center justify-content-between border-top">
                      <p>
                        {mailRequestData?.length > 0 &&
                          mailRequestDataCount > 0 &&
                          `Showing ${count.current} of ${count.total}`}
                      </p>

                      <div className="ml-auto mx-auto-370 d-flex align-items-center">
                        {mailRequestData?.length > 0 &&
                          mailRequestDataCount > 0 && (
                            <Pagination
                              currentPage={currentPage}
                              totalSize={mailRequestDataCount}
                              sizePerPage={pageData}
                              firstPageText="⟨⟨"
                              lastPageText="⟩⟩"
                              showFirstLastPages={true}
                              changeCurrentPage={changeCurrentPage}
                              theme="border-bottom"
                            />
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>

      {filter && (
        <OutsideClickHandler onOutsideClick={() => setFilter(false)}>
          <NotificationFilter
            userProfile={Token}
            setFilterInfo={setFilterInfo}
            data={mailRequestData}
            resetFilter={resetFilter}
            filterInfo={filterInfo}
            applyFilter={applyFilter}
            companyList={companies}
          />
        </OutsideClickHandler>
      )}

      <Modal
        show={openFullViewEmail}
        size="lg"
        className="modal fade"
        data-backdrop="static"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >
        <div className="modal-header" id="EditQuestionModal">
          <h6 className="modal-title" id="EditQuestionModalLabel">
            Email Request
          </h6>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            onClick={() => setOpenFullViewEmail(false)}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <Modal.Body>
          <div className="card-body p-4">
            <h6>Email : {selectedMail.mailTo}</h6>
            <h6>Subject : {selectedMail.mailSubject}</h6>

            <div
              className="mt-4"
              dangerouslySetInnerHTML={{
                __html: selectedMail.mailContent,
              }}
            ></div>
          </div>
          <div className="modal-footer mt-4 mb-0">
            <button
              type="button"
              className="btn btn-sm btn-secondary mr-2"
              data-dismiss="modal"
              onClick={(e) => {
                setOpenFullViewEmail(false);
              }}
            >
              Close
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default NotificationCentre;

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
