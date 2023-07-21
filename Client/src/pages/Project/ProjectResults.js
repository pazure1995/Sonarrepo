import React, { useEffect, useRef, useState } from "react";
import SideNavBar from "../layout/SideNavBar";
import TopNavBar from "../layout/TopNavBar";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
// import Sort from "../../components/common/SortFilter/Sort";
import OutsideClickHandler from "react-outside-click-handler";
// import axios from "../../services/axios";
import Expired from "../Results/components/Expired";
import Invited from "../Results/components/Invited";
import moment from "moment";
import InviteMultipleCandidates from "../Tests/TestDetails/InviteMultipleCandidates";
import All from "../Results/components/All";
import UnderReview from "../Results/components/UnderReview";
import ResultsFilter from "../../components/common/SortFilter/ResultsFilter";
import Completed from "../Results/components/Completed";
import { useLocation } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import { AsYouType } from "libphonenumber-js";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import Loader from "../../components/loader/Loader";
import { expiryData } from "../../constants/constants";
import Sort from "../../components/sort/Sort";

const ProjectResults = (props) => {
  const userProfile = useSelector((state) => state.userProfile.userProfile);
  const { state } = useLocation();
  const [iLoader, setILoader] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tab, setTab] = useState("All");
  const [all, setAll] = useState([]);
  const [invited, setInvited] = useState([]);
  const [email, setEmail] = useState("");
  const [reviewerPresent, setReviewerPresent] = useState("false");
  const [reviewer, setReviewer] = useState({
    firstName: userProfile.firstName,
    lastName: userProfile.lastName,
    reviewerEmail: userProfile.email,
    instructions: "",
  });
  const [expiryRange, setExpiryRange] = useState(7);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [completed, setCompleted] = useState([]);
  const [expired, setExpired] = useState([]);
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState("");
  const [underReview, setUnderReview] = useState([]);
  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState("");
  const [invitedCandidates, setInvitedCandidates] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [skills, setSkills] = useState([]);
  const [skill, setSkill] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobId, setJobId] = useState("");
  const [clientName, setClientName] = useState("");
  const [sortOrder, setSortOrder] = useState(
    new Array(3).fill().map((_) => "asc")
  );
  const [sortCount, setSortCount] = useState(0);
  const [applyCount, setApplyCount] = useState(0);
  const [filter, setFilter] = useState(false);
  const [types, setTypes] = useState([]);
  const [isBulkUpload, setIsBulkUpload] = useState(false);
  const [docSelected, setDocSelected] = useState(false);
  const [excelSelected, setExcelSelected] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const [sortType, setSorttype] = useState([]);
  const [sortArray, setSortArray] = useState([]);
  const [pageData, setPageData] = useState(10);
  const [newRequestList, setnewRequestList] = useState([]);
  const [paginationGroup, setPaginationGroup] = useState([]);
  const [pageType, setPageType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [update, setUpdate] = useState(false);
  const [requestTitleArray, setRequestTitleArray] = useState([]);
  const [matches, setMatches] = useState(
    window.matchMedia("(max-width: 1200px)").matches
  );

  useEffect(() => {
    window
      .matchMedia("(max-width: 1200px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);
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
  });

  let pageSize = 8;
  let dataSize = pageData;

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
      value: "createdAt",
      icon: "fal fa-fw fa-sliders-h-square mr-2 dd-sort",
    },
  ];
  const validate = (email) => {
    // eslint-disable-next-line
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return email.match(mailformat) ? true : false;
  };

  const inviteCandidate = async (email, firstName, lastName, phoneNumber) => {
    const candidDetails = {
      email: email,
      jobId: jobId,
      jobTitle: jobTitle,
      tags: [...tags, jobTitle],
      skills: skills,
      clientName: clientName,
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      companyId: userProfile.companyId,
      expiryDays: expiryRange,
      testAssign: state?.testData,
      createdBy: {
        role: userProfile.role,
        id: userProfile.id,
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        companyId: userProfile.companyId,
      },
      reviewer: { ...reviewer },
      modifiedBy: {
        role: userProfile.role,
        id: userProfile.id,
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        companyId: userProfile.companyId,
      },
      deleted: false,
      testCompleted: false,
      testInvited: true,
    };

    // return axios
    //   .post(`/candidate/add`, candidDetails, {
    //     headers: { token: userProfile.accessToken },
    //   })
    //   .then((res) => {
    //     setUpdate(!update);
    //     toast.success(
    //       `Invitation sent successfully to ${res?.data?.data?.firstName} ${res?.data?.data?.lastName}`
    //     );
    //   });
  };

  const getCandidates = () => {
    // axios
    //   .get(`/candidate/all`, {
    //     headers: { token: userProfile.accessToken },
    //   })
    //   .then((response) => {
    //     setShowModal(false);
    //   })
    //   .catch((err) => console.log(err));
  };
  const handleAddButtonClick = () => {
    if (!validate(email)) {
      toast.error("Please Enter Valid Email");
    } else {
      const newItem = {
        email: email,
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phone,
        id: Math.random().toString(16).slice(2),
      };
      let result = selectedCandidates.filter((x) => x.email === newItem.email);
      if (email.length === 0 && firstName.length === 0)
        return toast.error(`First name and Email should not be empty.`);
      else if (email.length === 0 && lastName.length !== 0)
        return toast.error(`Last name should not be empty.`);
      else if (email.length === 0 && firstName.length !== 0)
        return toast.error(`Email should not be empty.`);
      else if (email.length !== 0 && firstName.length === 0)
        return toast.error(`Name should not be empty.`);
      else if (email.length !== 0 && !phoneValid)
        return toast.error(`Phone number should be valid.`);
      if (result.length > 0) return toast.success(`Email is added.`);

      const newItems = [...selectedCandidates, newItem];
      setSelectedCandidates(newItems);
      setEmail("");
      setPhone("");
      setFirstName("");
      setLastName("");
    }
  };
  const handleReviewerChange = (e) => {
    setReviewerPresent(e.target.value);
    if (e.target.value === "true") {
      setReviewer({
        firstName: "",
        lastName: "",
        reviewerEmail: "",
        instructions: "",
      });
    } else {
      setReviewer({
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        reviewerEmail: userProfile.email,
        instructions: "",
      });
    }
  };
  const onCandidateAddTypeClick = (type) => {
    if (type === "doc") {
      setDocSelected(true);
      setExcelSelected(false);
      // setManualSelected(false);
    }
    if (type === "excel") {
      setExcelSelected(true);
      setDocSelected(false);
      // setManualSelected(false);
    }
    if (type === "manual") {
      // setManualSelected(true);
      setExcelSelected(false);
      setDocSelected(false);
    }
    if (type === "") {
      // setManualSelected(false);
      setExcelSelected(false);
      setDocSelected(false);
    }
  };

  const inviteCandidateForTest = () => {
    if (jobTitle === "") return toast.error("Please enter Job title");
    if (!validate(reviewer?.reviewerEmail))
      return toast.error("Please enter a valid reviewer email");

    setILoader(true);
    setLoading(true);
    var invites = Promise.all([
      ...selectedCandidates.map((candidate) =>
        inviteCandidate(
          candidate.email,
          candidate.firstName,
          candidate.lastName,
          candidate.phoneNumber
        )
      ),
    ]);
    invites
      .then((response) => {
        var newInvitations = [];
        response.forEach((invite) => {
          // if (invite?.data?.status === true) {
          setILoader(false);
          setLoading(false);
          setSelectedCandidates([]);
          setFirstName("");
          setLastName("");
          setEmail("");
          setPhone("");
          setJobTitle("");
          setJobId("");
          setClientName("");
          setTags([]);
          setSkills([]);
          setExpiryRange(7);
          setShowModal(false);
          newInvitations = [...newInvitations, invite?.data?.data];
          // toast.success(
          //   `Invitation sent successfully to ${invite?.data?.data?.firstName} ${invite?.data?.data?.lastName}`
          // );
          // } else {
          // setILoader(false);
          // setLoading(false);
          // toast.error(`Invitation has already been sent`);
          // toast.error(`Failed to invite ${invite?.data?.data?.name}`);
          // }
        });
        setInvitedCandidates([...newInvitations, ...invitedCandidates]);
      })
      .catch((err) => console.log(err));
  };

  const [phoneValid, setPhoneValid] = useState(false);

  const _onChangePhone = (value, country) => {
    const asYouType = new AsYouType(country.countryCode.toUpperCase());
    asYouType.input(value.replace(country.dialCode, ""));
    const isValid = asYouType.isValid() === true ? true : false;
    setPhoneValid(isValid);
    setPhone(value.length > 1 ? `+${value}` : "");
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [tab]);

  const handleChangeTag = (tags) => {
    setTags(tags);
  };

  const handleChangeInputTag = (tag) => {
    setTag(tag);
  };
  const handleChangeSkill = (skills) => {
    setSkills(skills);
  };

  const handleChangeInputSkill = (skill) => {
    setSkill(skill);
  };

  useEffect(() => {
    setLoading(true);
    const init = async () => {
      // let allArr = [];
      // await axios
      //   .get(`/result/all`, {
      //     headers: { token: userProfile.accessToken },
      //   })
      //   .then((res) => {
      //     let resultData = state?.testData
      //       ? res.data.filter((x) => x.testAssign._id === state?.testData?._id)
      //       : res.data;
      //     let data = resultData
      //       .filter(
      //         (x) =>
      //           x?.createdBy?.companyId === companyId &&
      //           (x?.testAssign?.testCategory === "MCQ" ||
      //             x?.isReviewed === true)
      //       )
      //       .reverse();
      //     let underReview = resultData
      //       .filter(
      //         (x) =>
      //           x?.createdBy?.companyId === companyId &&
      //           x?.testAssign?.testCategory !== "MCQ" &&
      //           x?.isReviewed === false
      //       )
      //       .reverse();
      //     let allCompleted = data.map((x) => {
      //       return { ...x, name: x.candidateName, type: "completed" };
      //     });
      //     let allUnderReview = underReview.map((x) => {
      //       return { ...x, name: x.candidateName, type: "underReview" };
      //     });
      //     allArr = [...allCompleted, ...allUnderReview];
      //     setLoading(false);
      //   });
      // await axios
      //   .get(`/candidate/all`, {
      //     headers: { token: userProfile.accessToken },
      //   })
      //   .then((res) => {
      //     let resultData = state?.testData
      //       ? res.data.filter((x) => x.testAssign._id === state?.testData?._id)
      //       : res.data;
      //     let invited = resultData
      //       .filter((x) => {
      //         let m = moment(x.createdAt);
      //         let today = moment().startOf("day");
      //         let days = Math.round(moment.duration(today - m).asDays());
      //         if (
      //           x?.testCompleted === false &&
      //           days <= x.expiryDays &&
      //           x?.createdBy?.companyId === companyId
      //         ) {
      //           return x;
      //         }
      //       })
      //       .reverse();
      //     let expire = resultData
      //       .filter((x) => {
      //         let m = moment(x.createdAt);
      //         let today = moment().startOf("day");
      //         let days = Math.round(moment.duration(today - m).asDays());
      //         if (
      //           x?.testCompleted === false &&
      //           days > x.expiryDays &&
      //           x?.createdBy?.companyId === companyId
      //         )
      //           return x;
      //       })
      //       .reverse();
      //     let allExpire = expire.map((x) => {
      //       return { ...x, type: "expired" };
      //     });
      //     let allInvited = invited.map((x) => {
      //       return { ...x, type: "invited" };
      //     });
      //     allArr = [...allArr, ...allExpire, ...allInvited]
      //       .sort(function (a, b) {
      //         return new Date(a.createdAt) - new Date(b.createdAt);
      //       })
      //       .reverse();
      //     setAll(allArr);
      //     setLoading(false);
      //     setFilterData(allArr);
      //     findActive(allArr);
      //   });
    };
    init();
    // eslint-disable-next-line
  }, [update]);

  useEffect(() => {
    setInvited(filterData.filter((x) => x.type === "invited"));
    setExpired(filterData.filter((x) => x.type === "expired"));
    setCompleted(filterData.filter((x) => x.type === "completed"));
    setUnderReview(filterData.filter((x) => x.type === "underReview"));
  }, [filterData]);

  useEffect(() => {
    let data =
      tab === "All"
        ? filterData
        : tab === "Completed"
        ? completed
        : tab === "underReview"
        ? underReview
        : tab === "Invited"
        ? invited
        : expired;

    setnewRequestList(data);
    setRequestTitleArray(
      new Array(Math.ceil(data.length / dataSize)).fill().map((_, i) => i + 1)
    );
    setPaginationGroup(
      new Array(Math.ceil(data.length / dataSize))
        .fill()
        .map((_, i) => i + 1)
        .slice(0, pageSize)
    );
    // eslint-disable-next-line
  }, [filterData, pageData, tab]);

  useEffect(() => {
    if (pageType === "up") {
      if ((currentPage - 1) % pageSize === 0 && currentPage !== 1) {
        setPaginationGroup(
          requestTitleArray.slice(currentPage - 1, currentPage + (pageSize - 1))
        );
      }
    } else if (pageType === "down") {
      if (currentPage % pageSize === 0 && currentPage !== 1) {
        setPaginationGroup(
          requestTitleArray.slice(currentPage - pageSize, currentPage)
        );
      }
    }
    // eslint-disable-next-line
  }, [currentPage]);

  const changePage = (event) => {
    const pageNumber = Number(event.target.textContent);
    setCurrentPage(pageNumber);
  };
  const getPaginatedData = () => {
    const startIndex = currentPage * dataSize - dataSize;
    const endIndex = startIndex + +dataSize;
    return newRequestList.slice(startIndex, endIndex);
  };

  const companyId = userProfile.companyId;

  const toggleDiv = (type) => {
    if (type === true) {
      setToggle(true);
    } else {
      setToggle(false);
    }
  };

  const scoring = (candid) => {
    let score = 0;
    let maximumScore = 0;
    if (candid?.testAssign?.testCategory === "MCQ")
      for (let i = 0; i < candid?.questions?.length; i++) {
        score = score + Number(candid?.questions[i]?.isCorrectAnswer);
      }
    else
      for (let i = 0; i < candid?.questions?.length; i++) {
        score = score + Number(candid?.questions[i]?.marks);
        maximumScore = maximumScore + 10;
      }

    let percent =
      candid?.testAssign?.testCategory === "MCQ"
        ? (Number(score) * 100) / candid?.questions?.length
        : (Number(score) * 100) / Number(maximumScore);

    return candid?.testAssign?.testCategory === "MCQ"
      ? percent?.toFixed(2)
      : candid.isReviewed
      ? percent?.toFixed(2)
      : "Under Review";
  };

  useEffect(() => {
    if (!sortCount && !filterInfo.selectedTypes.length) {
      setFilterData(all.sort());
    }
    // eslint-disable-next-line
  }, [all]);

  const findActive = (data) => {
    let activeTypes = [];
    data.forEach((element) => {
      !!element.testAssign.testCategory &&
      !activeTypes.includes(element.testAssign.testCategory)
        ? (activeTypes = [...activeTypes, element.testAssign.testCategory])
        : (activeTypes = [...activeTypes]);
      setTypes([...activeTypes]);
    });
  };

  const applySort = (sortedData, close) => {
    resetFilter();
    close && setIsComponentVisible(false);
    setFilterData(sortedData);
    setApplyCount(sortCount);
  };

  const applyFilter = (filteredData, filterInfo) => {
    setFilterInfo({
      selectedTypes: [...filterInfo.selectedTypes],
      createdOnDate: [...filterInfo.createdOnDate],
    });
    setFilterData(filteredData);
    setFilter(false);
  };

  const openFilter = () => {
    setFilter(true);
  };

  const resetSort = () => {
    setSortCount(0);
    setApplyCount(0);
    setSortArray([]);
    setSortOrder(new Array(3).fill().map((_) => "asc"));
  };

  const resetFilter = () => {
    setFilterInfo({
      selectedTypes: [],
      createdOnDate: ["", ""],
    });
  };
  const handlePageData = (e) => {
    e.target.value !== "all"
      ? setPageData(Number(e.target.value))
      : setPageData(filterData.length);
    setCurrentPage(1);
  };

  return (
    <>
      {loading && <Loader />}
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
                    <div className="d-flex align-items-center justify-content-between">
                      <h6 className="mt-2">Results</h6>
                      {userProfile.role === "user" && (
                        <div>
                          <button
                            className="btn btn btn-sm"
                            onClick={() => setShowModal(true)}
                          >
                            <i
                              className="fal fa-user-plus mr-2"
                              aria-hidden="true"
                            ></i>
                            Invite Candidate
                          </button>
                        </div>
                      )}
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
                          <div className="nav-itemd-flex justify-content-center">
                            <button
                              type="button"
                              className={
                                tab === "All"
                                  ? "nav-link pb-3 bg-transparent active"
                                  : "nav-link pb-3 bg-transparent"
                              }
                              onClick={() => {
                                setTab("All");
                              }}
                            >
                              <span className="tag mb-1">
                                {filterData.length}
                              </span>{" "}
                              <div>All</div>{" "}
                            </button>
                          </div>
                          <div className="nav-itemd-flex justify-content-center">
                            <button
                              type="button"
                              className={
                                tab === "Completed"
                                  ? "nav-link pb-3 bg-transparent active"
                                  : "nav-link pb-3 bg-transparent"
                              }
                              onClick={() => {
                                setTab("Completed");
                              }}
                            >
                              <span className="tag mb-1">
                                {completed.length}
                              </span>{" "}
                              <div>Completed</div>
                            </button>
                          </div>{" "}
                          <div className="nav-itemd-flex justify-content-center">
                            <button
                              type="button"
                              className={
                                tab === "UnderReview"
                                  ? "nav-link pb-3 bg-transparent active"
                                  : "nav-link pb-3 bg-transparent"
                              }
                              onClick={() => {
                                setTab("underReview");
                              }}
                            >
                              <span className="tag mb-1">
                                {underReview.length}
                              </span>{" "}
                              <div>Under review</div>
                            </button>
                          </div>
                          <div className="nav-itemd-flex justify-content-center">
                            <button
                              type="button"
                              className={
                                tab === "Invited"
                                  ? "nav-link pb-3 bg-transparent active"
                                  : "nav-link pb-3 bg-transparent"
                              }
                              onClick={() => {
                                setTab("Invited");
                              }}
                            >
                              <span className="tag mb-1">{invited.length}</span>{" "}
                              <div>Invited</div>{" "}
                            </button>
                          </div>
                          <div className="nav-itemd-flex justify-content-center">
                            <button
                              type="button"
                              className={
                                tab === "Expired"
                                  ? "nav-link pb-3 bg-transparent active"
                                  : "nav-link pb-3 bg-transparent"
                              }
                              onClick={() => {
                                setTab("Expired");
                              }}
                            >
                              <span className="tag mb-1">{expired.length}</span>{" "}
                              <div>Expired</div>{" "}
                            </button>
                          </div>
                        </div>
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
                                    sortData={all}
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
                                      "Sort by Candidate's name and Invited on."
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
                              {filterInfo.selectedTypes.length +
                                (filterInfo.createdOnDate[0] ? 1 : 0)}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {tab === "All" && (
                      <All
                        scoring={scoring}
                        data={filterData}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        setPageData={setPageData}
                        getPaginatedData={getPaginatedData}
                        all={all}
                      />
                    )}
                    {tab === "Completed" && (
                      <Completed
                        scoring={scoring}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        setPageData={setPageData}
                        getPaginatedData={getPaginatedData}
                        completed={completed}
                      />
                    )}
                    {tab === "Invited" && (
                      <Invited
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        setPageData={setPageData}
                        getPaginatedData={getPaginatedData}
                        invited={invited}
                      />
                    )}
                    {tab === "underReview" && (
                      <UnderReview
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        setPageData={setPageData}
                        getPaginatedData={getPaginatedData}
                        underReview={underReview}
                      />
                    )}
                    {tab === "Expired" && (
                      <Expired
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        setPageData={setPageData}
                        getPaginatedData={getPaginatedData}
                        expired={expired}
                      />
                    )}
                  </div>
                  <Modal show={showModal} size="lg" top>
                    <Modal.Header className="p-3">
                      <h6>Invite Candidate</h6>
                      <button
                        type="button"
                        data-dismiss="modal"
                        aria-label="Close"
                        onClick={() => {
                          setShowModal(false);
                          setPhone("");
                          setEmail("");
                          setFirstName("");
                          setJobTitle("");
                          setJobId("");
                          setClientName("");
                          setTags([]);
                          setSkills([]);
                          setLastName("");
                          setSelectedCandidates([]);
                          setIsBulkUpload(false);
                          onCandidateAddTypeClick("");
                          setExpiryRange(7);
                          setReviewerPresent("false");
                        }}
                        className="close p-0 bl-modal-close-btn"
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </Modal.Header>
                    <Modal.Body>
                      <div className="row">
                        <div
                          className="col-12 d-flex flex-column flex-lg-row"
                          style={{ padding: "25px 30px 30px 40px" }}
                        >
                          <button
                            onClick={() => {
                              onCandidateAddTypeClick("doc");
                              setIsBulkUpload(false);
                            }}
                            type="button"
                            className={
                              docSelected
                                ? "card card-flat p-0 mr-2 mb-2 mb-lg-0  selected"
                                : "card card-flat p-0 mr-2 mb-2 mb-lg-0"
                            }
                          >
                            <div className="card-body text-left text-left">
                              <div className="d-flex">
                                {docSelected ? (
                                  <>
                                    <div className="mr-3 font-green font-16">
                                      <i className="fad fa-check-circle"></i>
                                    </div>
                                  </>
                                ) : (
                                  <div className="mr-3 font-muted font-16">
                                    <i className="fad fa-circle"></i>
                                  </div>
                                )}
                                <div>
                                  <div>
                                    <strong className="font-blue_primary">
                                      Invite Candidate
                                    </strong>
                                  </div>
                                  <p className="mb-0">
                                    {" "}
                                    Invite candidate manually by entering the
                                    name and email
                                  </p>
                                  {/* <p className="mb-0"> {parsedData.email}</p> */}
                                </div>
                              </div>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              onCandidateAddTypeClick("excel");
                              setIsBulkUpload(true);
                            }}
                            className={
                              excelSelected
                                ? "card card-flat p-0 mr-2 mb-2 mb-lg-0  selected"
                                : "card card-flat p-0 mr-2 mb-2 mb-lg-0"
                            }
                          >
                            <div className="card-body text-left">
                              <div className="d-flex">
                                {excelSelected ? (
                                  <div className="mr-3 font-green font-16">
                                    <i className="fad fa-check-circle"></i>
                                  </div>
                                ) : (
                                  <div className="mr-3 font-muted font-16">
                                    <i className="fad fa-circle"></i>
                                  </div>
                                )}
                                <div>
                                  <div>
                                    <strong className="font-blue_primary">
                                      Bulk Upload With Excel
                                    </strong>
                                  </div>
                                  <p className="mb-0">
                                    Upload an excel template to invite multiple
                                    candidates at once
                                  </p>
                                </div>
                              </div>
                            </div>
                          </button>
                          {/* <button
                onClick={() => {
                  onCandidateAddTypeClick("manual");
                }}
                type="button"
                className={
                  manualSelected
                    ? "card card-flat p-0 mr-2 mb-2 mb-lg-0  selected"
                    : "card card-flat p-0 mr-2 mb-2 mb-lg-0"
                }
              >
                <div className="card-body text-left">
                  <div className="d-flex">
                    {manualSelected ? (
                      <div className="mr-3 font-green font-16">
                        <i className="fad fa-check-circle"></i>
                      </div>
                    ) : (
                      <div className="mr-3 font-muted font-16">
                        <i className="fad fa-circle"></i>
                      </div>
                    )}
                    <div>
                      <div>
                        <strong className="font-blue_primary">Manual Entry</strong>
                      </div>
                      <p className="mb-0">Single talent manual entry</p>
                    </div>
                  </div>
                </div>
              </button> */}
                        </div>
                      </div>

                      <div className="card-body">
                        {docSelected && (
                          <>
                            <div className="row ">
                              <div className="col-lg-12 d-flex ">
                                <div className="form-floating col-5">
                                  <h5
                                    className="ps-1"
                                    style={{ paddingTop: 25 }}
                                  >
                                    Job
                                  </h5>
                                </div>
                              </div>
                            </div>
                            <hr />
                            <div className="card p-2">
                              <div
                                className={
                                  !matches
                                    ? "d-flex  gap-2"
                                    : "d-flex  flex-column gap-2"
                                }
                              >
                                <div className={!matches ? "col-4" : "col-12"}>
                                  <div className="form-floating">
                                    <input
                                      type="text"
                                      placeholder="test"
                                      className="form-control"
                                      value={jobTitle}
                                      onChange={(e) => {
                                        const input =
                                          e.target.value
                                            .charAt(0)
                                            .toUpperCase()
                                            .replace(/^[ \t]+|[ \t]+$/gm, "") +
                                          e.target.value.slice(1);

                                        setJobTitle(input);
                                      }}
                                    />
                                    <label htmlFor="">Job Title*</label>
                                  </div>
                                </div>
                                <div className={!matches ? "col-4" : "col-12"}>
                                  <div className="form-floating">
                                    <input
                                      type="text"
                                      placeholder="test"
                                      className="form-control"
                                      value={jobId}
                                      onChange={(e) => {
                                        setJobId(
                                          e.target.value.replace(
                                            /^[ \t]+|[ \t]+$/gm,
                                            ""
                                          )
                                        );
                                      }}
                                    />
                                    <label htmlFor="">Job Id</label>
                                  </div>
                                </div>
                                <div
                                  className={!matches ? "col-4 pr-3" : "col-12"}
                                >
                                  <div className="form-floating">
                                    <input
                                      type="text"
                                      placeholder="test"
                                      className="form-control"
                                      value={clientName}
                                      onChange={(e) => {
                                        setClientName(
                                          e.target.value.replace(
                                            /^[ \t]+|[ \t]+$/gm,
                                            ""
                                          )
                                        );
                                      }}
                                    />
                                    <label htmlFor="">Client Name</label>
                                  </div>
                                </div>
                              </div>
                              <div className="d-flex flex-column mt-2">
                                <div className="col-12 form-floating">
                                  <TagsInput
                                    // renderInput={autocompleteRenderInput}
                                    value={skills}
                                    onChange={(e) => handleChangeSkill(e)}
                                    inputValue={skill}
                                    onChangeInput={(e) =>
                                      handleChangeInputSkill(e)
                                    }
                                    placeholder="Type a location and hit enter"
                                    inputProps={{
                                      placeholder: "Add a Skill",
                                    }}
                                  />
                                </div>

                                <div className="col-12 form-floating mt-2">
                                  <TagsInput
                                    // renderInput={autocompleteRenderInput}
                                    value={tags}
                                    onChange={(e) => handleChangeTag(e)}
                                    inputValue={tag}
                                    onChangeInput={(e) =>
                                      handleChangeInputTag(e)
                                    }
                                    placeholder="Type a location and hit enter"
                                    inputProps={{
                                      placeholder: "Add a Tag",
                                    }}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="row ">
                              <div className="col-lg-12 d-flex ">
                                <div className="form-floating col-5">
                                  <h5
                                    className="ps-1"
                                    style={{ paddingTop: 25 }}
                                  >
                                    Candidate
                                  </h5>
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        {docSelected && <hr />}

                        {selectedCandidates.length > 0 &&
                        isBulkUpload === false ? (
                          <div className=" mb-3 px-3">
                            <table className="table">
                              <thead>
                                <tr>
                                  <th scope="col">No.</th>
                                  <th scope="col">Name</th>
                                  <th scope="col">Email</th>
                                  <th scope="col">Phone</th>
                                  <th scope="col"></th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedCandidates.map((x, i) => (
                                  <tr key={i}>
                                    <td>
                                      <strong>{i + 1}</strong>
                                    </td>
                                    <td>
                                      {x.firstName} {x.lastName}{" "}
                                    </td>
                                    <td>{x.email}</td>
                                    <td>{x.phoneNumber}</td>
                                    <td
                                      style={{
                                        cursor: "pointer",
                                        width: "100px",
                                      }}
                                    >
                                      <button
                                        type="button"
                                        className="btn btn-text-accent"
                                        onClick={() => {
                                          let candidates =
                                            selectedCandidates.filter(
                                              (y) => y.email !== x.email
                                            );
                                          setSelectedCandidates(candidates);
                                        }}
                                      >
                                        <div className="d-flex ">
                                          <span>
                                            <i
                                              aria-hidden="true"
                                              className="fas fa-trash-alt fa-fw"
                                            ></i>
                                          </span>
                                        </div>
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : null}

                        {isBulkUpload && (
                          <InviteMultipleCandidates
                            setIsBulkUpload={setIsBulkUpload}
                            testDetails={props.testDetails}
                            getCandidates={getCandidates}
                            matches={matches}
                          />
                        )}
                        {docSelected && (
                          <>
                            <div className="card p-2">
                              <div className="">
                                <div className={!matches ? "d-flex" : ""}>
                                  <div
                                    className={
                                      !matches ? "col-6 mr-2" : "col-12 mb-2"
                                    }
                                  >
                                    <div className="form-floating">
                                      <input
                                        type="text"
                                        placeholder="test"
                                        className="form-control"
                                        value={firstName}
                                        onChange={(e) => {
                                          e.target.value =
                                            e.target.value.replace(
                                              /^[ \t]+|[ \t]+$/gm,
                                              ""
                                            );
                                          setFirstName(
                                            e.target.value
                                              .charAt(0)
                                              .replace(
                                                /^[ \t]+|[ \t]+$/gm,

                                                ""
                                              )
                                              .toUpperCase() +
                                              e.target.value.slice(1).replace(
                                                /^[ \t]+|[ \t]+$/gm,

                                                ""
                                              )
                                          );
                                        }}
                                      />
                                      <label htmlFor="">First name*</label>
                                    </div>
                                  </div>
                                  <div
                                    className={
                                      !matches ? "col-6 pr-2" : "col-12"
                                    }
                                  >
                                    <div className="form-floating">
                                      <input
                                        type="text"
                                        placeholder="test"
                                        className="form-control"
                                        value={lastName}
                                        onChange={(e) => {
                                          e.target.value =
                                            e.target.value.replace(
                                              /^[ \t]+|[ \t]+$/gm,
                                              ""
                                            );
                                          setLastName(
                                            e.target.value
                                              .charAt(0)
                                              .replace(
                                                /^[ \t]+|[ \t]+$/gm,

                                                ""
                                              )
                                              .toUpperCase() +
                                              e.target.value.slice(1).replace(
                                                /^[ \t]+|[ \t]+$/gm,

                                                ""
                                              )
                                          );
                                        }}
                                      />
                                      <label htmlFor="">Last name*</label>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className={
                                    !matches
                                      ? "d-flex gap-2 mt-2"
                                      : "d-flex flex-column gap-2 mt-2"
                                  }
                                >
                                  <div
                                    className={!matches ? "col-6" : "col-12   "}
                                  >
                                    <div className="form-floating ">
                                      <input
                                        type="text"
                                        placeholder="test"
                                        className="form-control "
                                        value={email}
                                        onChange={(e) => {
                                          e.target.value =
                                            e.target.value.trim();
                                          setEmail(e.target.value);
                                        }}
                                      />
                                      <label htmlFor="">Email*</label>
                                    </div>
                                  </div>
                                  <div
                                    className={!matches ? "col-6" : "col-12   "}
                                  >
                                    <div className="form-floating">
                                      <PhoneInput
                                        style={{
                                          zIndex: 99999,
                                        }}
                                        inputStyle={{
                                          height: "100%",
                                          width: "100%",
                                        }}
                                        // inputClass="form-control"
                                        containerClass="pr-2"
                                        containerStyle={{ height: "140px" }}
                                        value={phone}
                                        name="mobilePhone"
                                        country={"us"}
                                        onChange={(value, country) => {
                                          _onChangePhone(value, country);
                                        }}
                                        placeholder="Phone no./Mobile no."
                                      />
                                      <label htmlFor="">Phone</label>
                                    </div>
                                    {!phoneValid && phone.length > 1 && (
                                      <small className="validation">
                                        Invalid Phone
                                      </small>
                                    )}
                                  </div>
                                  {/* {!matches && (
                        <button
                          className="ml-2 btn btn-primary"
                          onClick={() => {
                            handleAddButtonClick();
                          }}
                          disabled={
                            firstName === "" || email === "" ? true : false
                          }
                        >
                          <i className="fas fa-check"></i>
                        </button>
                      )} */}
                                </div>
                              </div>
                              <div>
                                <button
                                  className=" mt-3 btn btn-sm btn-primary"
                                  onClick={() => {
                                    handleAddButtonClick();
                                  }}
                                  style={{ float: "right" }}
                                  disabled={
                                    firstName === "" ||
                                    lastName === "" ||
                                    email === ""
                                      ? true
                                      : false
                                  }
                                >
                                  <i className="fas fa-plus mr-2"></i> Add more
                                </button>
                              </div>{" "}
                            </div>
                            <div className="form-floating col-5">
                              <h5 className="ps-1" style={{ paddingTop: 25 }}>
                                Options
                              </h5>
                            </div>
                            <hr />
                            <div className="card p-2">
                              <div
                                className={
                                  !matches ? "d-flex" : "d-flex flex-column"
                                }
                              >
                                <div
                                  className={
                                    props?.testDetails?.data?.testCategory !==
                                    "MCQ"
                                      ? !matches
                                        ? "col-4"
                                        : "col-12 "
                                      : "col-12"
                                  }
                                >
                                  <div className="form-floating">
                                    <select
                                      className="font-14 form-select"
                                      id="category"
                                      value={expiryRange}
                                      onChange={(event) => {
                                        setExpiryRange(event.target.value);
                                      }}
                                      required
                                    >
                                      {expiryData.map((item, index) => (
                                        <option
                                          key={index}
                                          value={item.value}
                                          selected={
                                            item.value === 7 ? true : false
                                          }
                                        >
                                          {item.SourceName}
                                        </option>
                                      ))}
                                    </select>
                                    <label for="category">Expires In</label>
                                  </div>
                                </div>
                                {props?.testDetails?.data?.testCategory !==
                                  "MCQ" && (
                                  <div
                                    className={
                                      !matches ? "col-8 ps-2" : "col-12 mt-2"
                                    }
                                  >
                                    <div className="form-floating   ">
                                      <select
                                        className="font-14 form-select"
                                        id="category"
                                        value={reviewerPresent}
                                        onChange={(e) => {
                                          handleReviewerChange(e);
                                        }}
                                      >
                                        <option value={false}>
                                          I will be the reviewer.
                                        </option>
                                        <option value={true}>
                                          I suggest a colleague to review.
                                        </option>
                                      </select>
                                      <label for="category">Reviewer</label>
                                    </div>
                                  </div>
                                )}{" "}
                              </div>
                            </div>
                            {reviewerPresent === "true" && (
                              <>
                                <div className="form-floating col-5">
                                  <h5
                                    className="ps-1"
                                    style={{ paddingTop: 25 }}
                                  >
                                    Reviewer
                                  </h5>
                                </div>
                                <hr />{" "}
                                <div className="card p-2">
                                  <div
                                    className={
                                      !matches
                                        ? "d-flex justify-content-between "
                                        : "d-flex flex-column "
                                    }
                                  >
                                    <div
                                      className={
                                        !matches
                                          ? "form-floating w-50 mr-2"
                                          : "form-floating w-100 "
                                      }
                                    >
                                      <input
                                        type="text"
                                        placeholder="test"
                                        className="form-control"
                                        value={reviewer.firstName}
                                        onChange={(e) => {
                                          setReviewer({
                                            ...reviewer,
                                            firstName: e.target.value.replace(
                                              /^[ \t]+|[ \t]+$/gm,

                                              ""
                                            ),
                                          });
                                        }}
                                      />
                                      <label htmlFor="">First name*</label>
                                    </div>
                                    <div
                                      className={
                                        !matches
                                          ? "form-floating w-50 mr-2"
                                          : "form-floating w-100 mt-2"
                                      }
                                    >
                                      <input
                                        type="text"
                                        placeholder="test"
                                        className="form-control"
                                        value={reviewer.lastName}
                                        onChange={(e) => {
                                          setReviewer({
                                            ...reviewer,
                                            lastName: e.target.value.replace(
                                              /^[ \t]+|[ \t]+$/gm,

                                              ""
                                            ),
                                          });
                                        }}
                                      />
                                      <label htmlFor="">Last name*</label>
                                    </div>
                                    <div
                                      className={
                                        !matches
                                          ? "form-floating w-50"
                                          : "form-floating w-100 mt-2"
                                      }
                                    >
                                      <input
                                        type="text"
                                        placeholder="test"
                                        className="form-control"
                                        value={reviewer.reviewerEmail}
                                        onChange={(e) => {
                                          setReviewer({
                                            ...reviewer,
                                            reviewerEmail:
                                              e.target.value.replace(
                                                /^[ \t]+|[ \t]+$/gm,

                                                ""
                                              ),
                                          });
                                        }}
                                      />
                                      <label htmlFor="">Email*</label>
                                    </div>
                                  </div>
                                  <div className="form-floating mt-2">
                                    <textarea
                                      type="text"
                                      rows="3"
                                      placeholder="test"
                                      className="form-control"
                                      value={reviewer.instructions}
                                      onChange={(e) => {
                                        setReviewer({
                                          ...reviewer,
                                          instructions: e.target.value,
                                        });
                                      }}
                                    />
                                    <label htmlFor="">
                                      Instruction to reviewer
                                    </label>
                                  </div>
                                </div>
                              </>
                            )}
                            {/*  */}
                            <div className=" py-4 px-2 d-flex justify-content-end">
                              <button
                                onClick={() => {
                                  setShowModal(false);
                                  setPhone("");
                                  setEmail("");
                                  setFirstName("");
                                  setJobTitle("");
                                  setJobId("");
                                  setClientName("");
                                  setTags([]);
                                  setSkills([]);
                                  setLastName("");
                                  setSelectedCandidates([]);
                                  onCandidateAddTypeClick("");
                                  setExpiryRange(7);
                                  setReviewerPresent("false");
                                }}
                                type="button"
                                className="btn btn-secondary mr-2"
                              >
                                Close
                              </button>
                              <div>
                                <div className="d-flex">
                                  <div className="">
                                    <button
                                      type="button"
                                      onClick={inviteCandidateForTest}
                                      className="btn btn-primary"
                                      disabled={
                                        selectedCandidates.length > 0
                                          ? firstName !== "" || email !== ""
                                            ? true
                                            : reviewer.firstName !== "" &&
                                              reviewer.reviewerEmail !== "" &&
                                              reviewer.lastName !== ""
                                            ? false
                                            : true
                                          : true
                                      }
                                    >
                                      {iLoader ? (
                                        <>
                                          <i className="fa fa-spinner fa-spin mr-2"></i>{" "}
                                          Invite
                                        </>
                                      ) : (
                                        <>
                                          <i
                                            className="fal fa-user-plus mr-2"
                                            aria-hidden="true"
                                          ></i>
                                          Invite
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </Modal.Body>
                  </Modal>
                  {!!paginationGroup.length && (
                    <div className="d-flex p-2 mt-2 align-items-center justify-content-between border-top">
                      <div className="w-100-370 mb-point5-370">
                        Showing{" "}
                        {newRequestList.length >= pageData
                          ? pageData * currentPage <= newRequestList.length
                            ? pageData * currentPage
                            : newRequestList.length
                          : newRequestList.length}{" "}
                        of {newRequestList.length}
                      </div>
                      <div className="ml-auto mx-auto-370 d-flex align-items-center">
                        <button
                          onClick={() => {
                            setPageType("down");
                            setCurrentPage((page) => page - 1);
                          }}
                          type="button"
                          disabled={currentPage === 1 ? true : false}
                          className="btn btn-icon px-2"
                        >
                          <i className="fal fa-chevron-circle-left"></i>
                        </button>
                        {paginationGroup.map((item) => (
                          <button
                            type="button"
                            className={
                              currentPage === item
                                ? "btn btn-text px-2 bg-secondary text-white"
                                : "btn btn-text px-2"
                            }
                            onClick={changePage}
                          >
                            {item}
                          </button>
                        ))}
                        <button
                          onClick={() => {
                            setPageType("up");
                            setCurrentPage((page) => page + 1);
                          }}
                          type="button"
                          disabled={
                            currentPage === requestTitleArray.slice(-1)[0]
                              ? true
                              : false
                          }
                          className="btn btn-icon px-2"
                        >
                          <i className="fal fa-chevron-circle-right"></i>
                        </button>
                      </div>
                    </div>
                  )}
                  {filter && (
                    <OutsideClickHandler
                      onOutsideClick={() => setFilter(false)}
                    >
                      <ResultsFilter
                        resetSort={resetSort}
                        data={all}
                        setCurrentPage={setCurrentPage}
                        filterInfo={filterInfo}
                        applyFilter={applyFilter}
                        types={types}
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

export default ProjectResults;

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
