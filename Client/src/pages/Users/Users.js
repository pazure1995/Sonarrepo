import React, { useEffect, useRef, useState } from "react";
import SideNavBar from "../layout/SideNavBar";
import TopNavBar from "../layout/TopNavBar";
import Modal from "react-bootstrap/Modal";
import OutsideClickHandler from "react-outside-click-handler";
import Sort from "../../components/sort/Sort";
import Pagination from "react-pagination-js";
import "react-pagination-js/dist/styles.css";
import Loader from "../../components/loader/Loader";
import FormSubmitSuccess from "../../components/FormSubmitSuccess";
import AddUser from "../AddUser/AddUser";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getUserToken } from "../../services/AuthServices";
import { getAllUsers } from "../../redux/actions/UserProfile/getAllUsers";
import UsersTableView from "./UsersTableView";
import UserPreview from "./UserPreview";
import UserFilter from "../../components/Filters/UserFilter";
import { post } from "../../services/ApiServices";
import { updateUserStatusUrl, updateUserUrl } from "../../services/ServiceUrls";
import Dropzone from "react-dropzone";
import { toast } from "react-toastify";

const Users = () => {
  const dispatch = useDispatch();
  const Token = getUserToken();
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [pageData, setPageData] = useState(10);
  const [successShow, setSuccessShow] = useState(false);
  const [imgFile, setFile] = useState({});
  const [iLoader, setILoader] = useState(false);
  const [sortType, setSorttype] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [sortCount, setSortCount] = useState(0);
  const [applyCount, setApplyCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [filter, setFilter] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [sortArray, setSortArray] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [companyLogo, setCompanyLogo] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [prev, setPrev] = useState({
    show: false,
    selectedUser: {},
  });

  const [sortParams, setSortParams] = useState({
    sortOrder: "",
    sortBy: "",
  });

  const [filterInfo, setFilterInfo] = useState({
    selectedStatus: [],
    selectedCompany: [],
    memberFromType: "",
    memberFrom: ["", ""],
  });

  const { userData, userDataLoading, userDataCount } = useSelector(
    (state) => ({
      userData: state.getAllUsersReducer.userData?.data,
      userDataLoading: state.getAllUsersReducer.userDataLoading,
      userDataCount: state.getAllUsersReducer.userData?.total,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (!userData) {
      getAllUsers();
    }
  }, [userData]);

  const getAllUsersData = () => {
    dispatch(
      getAllUsers({
        id: Token.id,
        companyName: Token.companyName,
        limit: pageData,
        currentPage: currentPage,
        sortParams: sortParams,
        filterParams: filterInfo,
        searchParam: searchParam,
      })
    );
  };

  useEffect(() => {
    getAllUsersData();
    // eslint-disable-next-line
  }, [searchParam]);

  const [matches, setMatches] = useState(
    window.matchMedia("(max-width: 860px)").matches
  );

  useEffect(() => {
    window
      .matchMedia("(max-width: 860px)")
      .addEventListener("change", (e) => setMatches(e.matches));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    changeCurrentPage(1);
    // eslint-disable-next-line
  }, [pageData]);

  useEffect(() => {
    let arr = [];
    userData?.forEach(
      (user) => !arr.includes(user.companyName) && arr.push(user.companyName)
    );
    setCompanies(arr);
  }, [userData]);

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

  const sortObject =
    Token.role === "admin"
      ? [
          {
            id: 1,
            label: "Name",
            value: "firstName",
            icon: "fal fa-fw fa-question mr-2 dd-sort",
          },
          {
            id: 2,
            label: "Company",
            value: "companyName",
            icon: "fal fa-fw fa-sliders-h-square mr-2 dd-sort",
          },
          {
            id: 3,
            label: "Status",
            value: "uStatus",
            icon: "fal fa-fw fa-briefcase mr-2 dd-sort",
          },
        ]
      : [
          {
            id: 1,
            label: "Name",
            value: "name",
            icon: "fal fa-fw fa-question mr-2 dd-sort",
          },

          {
            id: 2,
            label: "Status",
            value: "deleted",
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

  const setPrevData = (boolean, data) => {
    setPrev({
      show: boolean,
      selectedUser: data,
    });
  };

  const applyFilter = (filterInfo) => {
    setFilter(false);
    setCurrentPage(1);
    dispatch(
      getAllUsers({
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

  const handleStatusConfirmation = (_user, e) => {
    e.preventDefault();
    setShowConfirmation(true);
    setUser(_user);
    setPrev({ ...prev, user: _user });
  };

  const handleEdit = (_user, e) => {
    e.preventDefault();
    setShowEditUser(true);
    _user.companyLogo && setCompanyLogo(true);
    setUser(_user);
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
      getAllUsers({
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

  const handleStatusChange = async () => {
    setILoader(true);
    setLoading(true);
    let payload = {
      userId: user._id,
      uStatus: user.uStatus === "Active" ? "Deactivated" : "Active",
      updatedByName: Token.firstName,
      updatedByEmail: Token.email,
      role: Token.role,
      userFirstName: user.firstName,
      userLastName: user.lastName,
      companyName: Token.companyName,
      userEmail: user.email,
    };
    post(updateUserStatusUrl, payload)
      .then((res) => {
        setILoader(false);
        setLoading(false);
        setShowConfirmation(false);
        setPrev({
          show: false,
          selectedUser: {},
        });
        setSuccessShow(true);
        getAllUsersData();
      })
      .catch((error) => {
        console.log(error);
        setILoader(false);
        setLoading(false);
        setShowConfirmation(false);
      });
  };

  const toggleDiv = (type) => {
    if (type === true) {
      setToggle(true);
    } else {
      setToggle(false);
    }
  };

  const handleEditUser = async () => {
    if (user?.firstName === "")
      return toast.error("First name can not be empty");
    if (user?.lastName === "") return toast.error("Last name can not be empty");
    setLoading(true);

    let payload = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      companyLogo:
        companyLogo && imgFile?.base64?.length > 10
          ? {
              fileName: imgFile.fileName.split(".")[0],
              base64: imgFile.base64,
              fileType: imgFile.fileType,
            }
          : "",
    };

    post(updateUserUrl, payload)
      .then((res) => {
        console.log(res);
        setLoading(false);
        setPrev({
          show: false,
          selectedUser: {},
        });
        setShowEditUser(false);
        getAllUsersData();
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const onUploadHandler = async (e) => {
    setCompanyLogo(true);
    const { name } = e[0];
    let type = name.split(".")[1];
    const reader = new FileReader();
    reader.readAsDataURL(e[0]);
    reader.onload = (event) => {
      setFile({
        fileName: name,
        base64: event.target.result,
        fileType: type,
      });
    };
  };

  const changeCurrentPage = (number) => {
    setCurrentPage(number);
    dispatch(
      getAllUsers({
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
    if (!userDataLoading) {
      let n =
        userData?.length < pageData
          ? (Number(currentPage) - 1) * pageData + Number(userData?.length)
          : Number(currentPage) * Number(userData?.length);

      setCount((state) => ({
        ...state,
        current: n,
      }));

      setCount((state) => ({
        ...state,
        total: userDataCount,
      }));
    }
  };

  useEffect(() => {
    pageCount();
    // eslint-disable-next-line
  }, [currentPage, userData, userDataCount]);

  const onSearchChange = (e) => {
    setSearchParam(e.target.value);
    setCurrentPage(1);
  };

  return (
    <>
      {(userDataLoading || loading) && <Loader />}
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
                      <h6 className="mr-3 mb-xl-4">
                        {" "}
                        {Token?.role === "companyAdmin"
                          ? "Members"
                          : "Users"}{" "}
                      </h6>
                      <div className="d-flex mb-3 pr-2 justify-content-end">
                        <button
                          className="btn btn-sm"
                          onClick={() => setShowAddUserModal(true)}
                        >
                          <i
                            className="fal fa-user-plus mr-2"
                            aria-hidden="true"
                          ></i>
                          {Token?.role === "admin"
                            ? "Invite user"
                            : "Invite member"}
                        </button>
                      </div>
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
                                  sortData={userData}
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
                                    Token.role === "admin"
                                      ? "Sort by Name, Company and Status"
                                      : "Sort by Name and Status"
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
                              {filterInfo.selectedStatus.length +
                                filterInfo.selectedCompany.length +
                                (filterInfo.memberFrom[0] ||
                                filterInfo.memberFrom[1]
                                  ? 1
                                  : 0)}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {userData?.length > 0 ? (
                      <UsersTableView
                        handleEdit={handleEdit}
                        handleStatusConfirmation={handleStatusConfirmation}
                        userData={userData}
                        setPrev={setPrev}
                        prev={prev}
                        setPrevData={setPrevData}
                      />
                    ) : (
                      <div>
                        <div className="text-center p-3">
                          <div className="avatar avatar-lg">
                            <i className="fad fa-comment-slash"></i>
                          </div>
                          <div className="mt-3">No users found</div>
                        </div>
                      </div>
                    )}

                    <div className="d-flex p-2 mt-2 align-items-center justify-content-between border-top">
                      <p>
                        {userData?.length > 0 &&
                          userDataCount > 0 &&
                          `Showing ${count.current} of ${count.total}`}
                      </p>

                      <div className="ml-auto mx-auto-370 d-flex align-items-center">
                        {userData?.length > 0 && userDataCount > 0 && (
                          <Pagination
                            currentPage={currentPage}
                            totalSize={userDataCount}
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

                  {/* Modal for Creating and adding more questions */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
      <Modal
        show={showConfirmation}
        onHide={showConfirmation === false}
        size="delete"
      >
        <div className="bl-modal-header">
          <button
            type="button"
            data-dismiss="modal"
            aria-label="Close"
            onClick={() => setShowConfirmation(false)}
            className="close p-0 bl-modal-close-btn"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <Modal.Body>
          <div className="bl-modal-body  text-center">
            <div className="avatar avatar-lg avatar-red2 mr-3">
              <i className="fas fa-exclamation-triangle fa-fw"></i>
            </div>
            <p className="text-center lead mt-3">
              Are you sure you want to{" "}
              {user?.uStatus === "Active" ? "deactivate" : "activate"} this{" "}
              {Token?.role === "admin" ? "user" : "member"} ?
            </p>
            <p className="lead">
              Name: {user?.firstName} {user?.lastName}
            </p>
            <div className="text-center my-4">
              <button
                type="button"
                className=" btn  btn-secondary px-3 mr-3"
                data-dismiss="modal"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={"btn btn-primary px-4"}
                onClick={handleStatusChange}
              >
                {iLoader ? (
                  <>
                    <i className="fa fa-spinner fa-spin"></i>
                  </>
                ) : user?.uStatus === "Active" ? (
                  "Deactivate"
                ) : (
                  "Activate"
                )}
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={showEditUser}
        size="lg"
        className="modal fade"
        data-backdrop="static"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >
        <div className="modal-header" id="EditQuestionModal">
          <h6 className="modal-title" id="EditQuestionModalLabel">
            {Token?.role === "admin" ? "Edit user" : "Edit member"}
          </h6>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            onClick={() => setShowEditUser(false)}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <Modal.Body>
          <div className="card-body p-4">
            <div className="container">
              <div className="row">
                <div className="col-lg-4">
                  <div className="form-floating">
                    <input
                      disabled={true}
                      placeholder="Enter role "
                      type="text"
                      className="form-control"
                      value={user?.companyName}
                    />
                    <div className="invalid-feedback"></div>
                    <label>Company name*</label>
                  </div>
                </div>
                <div className="col-lg-8">
                  <div className="form-floating">
                    <input
                      disabled={true}
                      placeholder="Enter email "
                      type="text"
                      className="form-control"
                      value={user?.email}
                    />
                    <label>Email id *</label>
                    <div className="invalid-feedback"></div>
                  </div>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-lg-6">
                  <div className="form-floating">
                    <input
                      placeholder="Enter first name"
                      type="text"
                      className="form-control"
                      onChange={(e) => {
                        let lname = e.target.value.replace(
                          /^[ \t]+|[ \t]+$/gm,
                          ""
                        );
                        lname =
                          lname
                            .charAt(0)
                            .toUpperCase()
                            .replace(/[^a-zA-Z\s]/, "") +
                          lname.slice(1).replace(/[^a-zA-Z\s]/, "");
                        setUser({ ...user, firstName: lname });
                      }}
                      value={user?.firstName}
                    />
                    <label>First name *</label>
                    <div className="invalid-feedback"></div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="form-floating">
                    <input
                      placeholder="Enter last name"
                      type="text"
                      className="form-control"
                      onChange={(e) => {
                        let lname = e.target.value.replace(
                          /^[ \t]+|[ \t]+$/gm,
                          ""
                        );
                        lname =
                          lname
                            .charAt(0)
                            .toUpperCase()
                            .replace(/[^a-zA-Z\s]/, "") +
                          lname.slice(1).replace(/[^a-zA-Z\s]/, "");
                        setUser({ ...user, lastName: lname });
                      }}
                      value={user?.lastName}
                    />
                    <label>Last name *</label>
                    <div className="invalid-feedback"></div>
                  </div>
                </div>
                {Token?.role === "admin" && (
                  <div>
                    <div className="border rounded-3 mb-3 p-2 mt-4">
                      {companyLogo ? (
                        <div className="mr-2 p-3">
                          <span>
                            <button
                              type="button"
                              onClick={() => {
                                setCompanyLogo(false);
                              }}
                              className="btn btn-icon"
                              title="Delete"
                            >
                              <i className="fa fa-trash mr-2"></i>
                            </button>
                            Logo Uploaded Successfully
                            <i
                              className="fas ml-1 fa-check-circle"
                              style={{
                                color: "green",
                                fontSize: 20,
                              }}
                            ></i>
                          </span>
                        </div>
                      ) : (
                        <div className="d-flex align-items-center">
                          <p className="m-0 mr-2">
                            Do you want to upload the Company logo?
                          </p>
                          <Dropzone
                            onDrop={(file) => onUploadHandler(file)}
                            multiple={false}
                          >
                            {({ getRootProps, getInputProps }) => (
                              <div {...getRootProps()} className="">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-secondary"
                                >
                                  <i className="far fa-cloud-upload mr-1 fa-fw"></i>
                                  Upload
                                </button>
                                <input
                                  type="file"
                                  {...getInputProps()}
                                  accept=".jpg, .png, .jpeg"
                                />
                              </div>
                            )}
                          </Dropzone>
                          <div className="ml-3">
                            <small>
                              Accepted file types: JPG, JPEG, PNG <br /> File
                              size: upto 2 MB
                            </small>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="modal-footer mt-4 mb-0">
            <button
              type="button"
              className="btn btn-secondary mr-2"
              data-dismiss="modal"
              onClick={(e) => {
                setShowEditUser(false);
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={(e) => {
                handleEditUser();
              }}
            >
              <span>Submit</span>
            </button>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={successShow} onHide={successShow}>
        <div className="modal-content">
          <div className="bl-modal-header"></div>
          <Modal.Body>
            <div>
              <FormSubmitSuccess
                successData={{
                  title:
                    user?.uStatus !== "Active"
                      ? `${
                          Token?.role === "admin" ? "User" : "Member"
                        } Activated!`
                      : `${
                          Token?.role === "admin" ? "User" : "Member"
                        } Deactivated!`,
                  subTitle:
                    user?.uStatus !== "Active"
                      ? `The selected ${
                          Token?.role === "admin" ? "user" : "member"
                        } has been activated.`
                      : `The selected ${
                          Token?.role === "admin" ? "user" : "member"
                        } has been deactivated.`,
                  htmlTag: `<div className="d-block w-100">
                      <span className="font-bold">${
                        Token?.role === "admin" ? "User" : "Member"
                      }</span><br/>
                     ${`${user?.firstName} ${user?.lastName}`}
                </div>`,
                }}
                closeModal={setSuccessShow}
              />
            </div>
          </Modal.Body>
        </div>
      </Modal>
      {showAddUserModal && (
        <div>
          {/* {userProfile?.role === "admin" ? (
            <AddUser
              setShowAddUserModal={setShowAddUserModal}
              showAddUserModal={setShowAddUserModal}
            />
          ) : (
            <AddMember
              setShowAddUserModal={setShowAddUserModal}
              showAddUserModal={setShowAddUserModal}
            />
          )} */}

          <AddUser
            setShowAddUserModal={setShowAddUserModal}
            getAllUsersData={getAllUsersData}
            showAddUserModal={setShowAddUserModal}
          />
        </div>
      )}
      {filter && (
        <OutsideClickHandler onOutsideClick={() => setFilter(false)}>
          <UserFilter
            userProfile={Token}
            setFilterInfo={setFilterInfo}
            data={userData}
            // resetSort={resetSort}
            resetFilter={resetFilter}
            filterInfo={filterInfo}
            applyFilter={applyFilter}
            companyList={companies}
          />
        </OutsideClickHandler>
      )}
      {prev.show && (
        <UserPreview
          handleStatusChange={handleStatusChange}
          showEditUser={showEditUser}
          setShowEditUser={setShowEditUser}
          users={userData}
          handleEdit={handleEdit}
          handleStatusConfirmation={handleStatusConfirmation}
          setPrev={setPrev}
          user={prev.selectedUser}
        />
      )}
    </>
  );
};

export default Users;

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
