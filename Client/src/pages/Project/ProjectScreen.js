import React, { useEffect, useRef } from "react";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Link, useNavigate } from "react-router-dom";
import { OverlayTrigger } from "react-bootstrap";
import Pagination from "react-pagination-js";
import moment from "moment";
import { toast } from "react-toastify";
import Avatar from "react-avatar";
import {
  getUserCompanyId,
  getUserId,
  getUserRole,
} from "../../services/AuthServices";
import { projectValidation } from "./validation/validation";
import { shallowEqual, useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  createProjectUrl,
  updateAssessmentUrl,
  updateProjectUrl,
} from "../../services/ServiceUrls";
import { getAllProjects } from "../../redux/actions/project/project";
import { post } from "../../services/ApiServices";
import { getAllUsersByCompanyIdUrl } from "../../services/ServiceUrls";
import { getAssessmentData } from "../../redux/actions/assessment/assessment";
import Loader from "../../components/loader/Loader";
import Assessments from "../Assessments/Assessments";

const ProjectScreen = () => {
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [showAssessmentAddModal, setShowAssessmentAddModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedAssessment, setSelectedAssessment] = useState({});
  const [loading, setLoading] = useState(false);
  const [testId, setTestId] = useState("");
  const [TabActive, setTabActive] = useState();
  const [selectedProject, setSelectedProject] = useState({});
  const [projectDetails, setProjectDetails] = useState({
    projectName: "",
    owner: {
      firstName: "",
      lastName: "",
      id: "",
    },
    tests: [],
    description: "",
  });
  const [projectView, setProjectView] = useState(true);
  const userId = getUserId();
  const [userData, setUserData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageAssesment, setCurrentPageAssessment] = useState(1);
  const [filterInfoAssess, setFilterInfoAssess] = useState({
    skills: [],
    testCategory: [],
    selectedDateType: "",
    selectedDate: ["", ""],
  });
  const [filterInfo, setFilterInfo] = useState("");
  const [fetchData, setFetchData] = useState({
    project: false,
    assessment: false,
  });

  const [sortParams, setSortParams] = useState({
    sortOrder: "",
    sortBy: "",
  });

  //redux
  const dispatch = useDispatch();
  const companyId = getUserCompanyId();
  const role = getUserRole();

  const { projectData, projectDataLoading, projectCount } = useSelector(
    (state) => ({
      projectData: state.getProjectDataReducer.projectData?.data,
      projectDataLoading: state.getProjectDataReducer?.projectDataLoading,
      projectCount: state.getProjectDataReducer?.projectData?.count[0]?.total,
    }),
    shallowEqual
  );

  useEffect(() => {
    let params = {
      deleted: false,
      companyId: companyId,
      currentPage: currentPage,
      limit: 8,
      role: role,
    };
    params.sortParams = {};
    params.filterParams = {
      owner: filterInfo,
    };
    dispatch(getAllProjects(params));
    // eslint-disable-next-line
  }, [currentPage, fetchData.project, filterInfo]);

  useEffect(() => {
    async function getUsers() {
      let params = {
        companyId: companyId || "ZJQ9RU",
      };
      let response = await post(getAllUsersByCompanyIdUrl, params);
      setUserData(response.data.filter((x) => x.uStatus === "Active"));
    }
    getUsers();
    // eslint-disable-next-line
  }, []);

  const { AssessmentData, AssessmentDataLoading, AssessmentDataCount } =
    useSelector(
      (state) => ({
        AssessmentData: state.getAssessmentDataReducer.AssessmentData,
        AssessmentDataLoading:
          state.getAssessmentDataReducer.AssessmentDataLoading,
        AssessmentDataCount: state.getAssessmentDataReducer.AssessmentDataCount,
      }),
      shallowEqual
    );

  useEffect(() => {
    dispatch(
      getAssessmentData({
        sortParams: sortParams,
        filterParams: filterInfoAssess,
        limit: 3,
        currentPage: currentPageAssesment,
        role: role,
        createdBy: userId,
        selectedTab: TabActive ? "public" : "user",
        companyId: TabActive ? "" : companyId,
        searchParam: "",
      })
    );
    // eslint-disable-next-line
  }, [TabActive, fetchData.assessment, currentPageAssesment]);

  const onSubmitProject = async (e) => {
    e.preventDefault();
    const body = {
      projectName: projectDetails.projectName,
      owner: {
        firstName: projectDetails?.owner?.firstName,
        lastName: projectDetails?.owner?.lastName,
        id: projectDetails?.owner?.id,
      },
      description: projectDetails.description,
      tests: projectDetails.tests,
      createdBy: userId,
      modifiedBy: userId,
    };

    const validationRes = projectValidation(body);
    if (validationRes.validationObj?.length > 0)
      return toast.error(validationRes?.validationObj[0]);

    setLoading(true);
    const res = await post(createProjectUrl, body);
    if (res.status === 200) {
      setLoading(false);
      setShowProjectModal(false);
      setProjectDetails({
        projectName: "",
        owner: {
          firstName: "",
          lastName: "",
          id: "",
        },
        tests: [],
        description: "",
      });
      toast.success("Project added successfully");
      setFetchData({ ...fetchData, project: !fetchData.project });
    }
  };

  const onChangeSelect = (e) => {
    if (e === "project") {
      setProjectView(true);
    }
    if (e === "assessment") {
      setProjectView(false);
    }
  };

  const onChangeProjectOwner = (e) => {
    if (e === "none") {
      setProjectDetails({
        ...projectDetails,
        owner: {
          firstName: "",
          lastName: "",
          id: "",
        },
      });
    }
    const selectedUser = userData.find((x) => x._id === e);
    setProjectDetails({
      ...projectDetails,
      owner: {
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        id: selectedUser._id,
      },
    });
  };

  const onChangeProject = (e) => {
    const tempProject = projectData.find((x) => x._id === e);

    setSelectedProject(tempProject);
  };

  const onClickAssessment = (test) => {
    setSelectedAssessment(test);
  };

  const createAssessment = async () => {
    if (!selectedProject?.projectName)
      return toast.error("Please select the Project");

    if (!selectedAssessment?.testName)
      return toast.error("Please select the Assessment");

    const resp = await selectedAssessment?.projects.filter(
      (x) => x.projectId === selectedProject._id
    );

    const respx = await selectedProject?.tests.filter(
      (x) => x.testId === selectedAssessment._id
    );

    if (resp?.length > 0)
      return toast.success(
        "Selected project and assessment are already connected!"
      );

    if (respx?.length > 0)
      return toast.success(
        "Selected project and assessment are already connected!"
      );

    const testBody = {
      assessmentId: selectedAssessment._id,
      projects: [
        {
          projectName: selectedProject?.projectName,
          projectId: selectedProject?._id,
        },
      ],
    };

    const projectBody = {
      projectId: selectedProject._id,
      tests: [
        {
          testName: selectedAssessment?.testName,
          testId: selectedAssessment?._id,
        },
      ],
    };

    try {
      setLoading(true);
      const resA = await post(updateAssessmentUrl, testBody);
      if (resA.status === 200) {
        setLoading(false);
        toast.success("Assessment added successfully");
        setShowAssessmentModal(true);
        setShowAssessmentAddModal(false);
        setShowAssessmentModal(false);
        setSelectedProject({});
        setSelectedAssessment({});
      }
      setLoading(true);

      const resP = await post(updateProjectUrl, projectBody);
      if (resP.status === 200) {
        setLoading(false);
        toast.success("Updated project");
        setFetchData({
          assessment: !fetchData.assessment,
          project: !fetchData.project,
        });
      }
    } catch (err) {
      setLoading(false);
      console.log("err", err);
      toast.error("Error while adding");
      setShowAssessmentModal(false);
    }
  };

  const onSearchChange = (e) => {
    setSearchValue(e);
    // const tempSearchRes = projectData.filter(
    //   (x) =>
    //     x.projectName.toLowerCase().includes(e.toLowerCase()) ||
    //     `${x.owner.firstName} ${x.owner.lastName}`
    //       .toLowerCase()
    //       .includes(e.toLowerCase())
    // );
    // setFliterProjects(tempSearchRes);
  };

  const getHighlightedText = (text, highlight) => {
    const parts = text?.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {parts?.map((part, i) => (
          <span
            key={i}
            style={
              part.toLowerCase() === highlight.toLowerCase()
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

  const changeCurrentPage = (n) => {
    setCurrentPage(n);
  };

  const [projectId, setProjectId] = useState("");

  const [count, setCount] = useState({
    current: 0,
    total: 0,
  });

  const [countA, setCountA] = useState({
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
    pageCount(projectData, projectCount, 8, setCount, currentPage);
    // eslint-disable-next-line
  }, [currentPage, projectData]);

  useEffect(() => {
    pageCount(
      AssessmentData,
      AssessmentDataCount,
      3,
      setCountA,
      currentPageAssesment
    );
    // eslint-disable-next-line
  }, [currentPageAssesment, AssessmentData]);

  return (
    <>
      {loading && <Loader />}
      {projectDataLoading && <Loader />}
      {AssessmentDataLoading && <Loader />}
      <div className="px-5 pt-5 p-2-600">
        <div className="d-flex justify-content-between align-item-center mb-3">
          <h6 className="mt-2">{projectView ? "Projects" : "Assessments"}</h6>
          <div style={{ fontSize: "17px", width: "120px" }}>
            <OverlayTrigger
              trigger="click"
              rootClose
              placement="bottom-end"
              overlay={
                <div
                  className="dropdown-menu dropdown-menu-right"
                  aria-labelledby="requestMoreMenu"
                >
                  <button
                    type="button"
                    className="dropdown-item "
                    onClick={() => {
                      setShowProjectModal(true);
                    }}
                  >
                    <i
                      className="fad fa-fw fa-users mr-2"
                      aria-hidden="true"
                    ></i>
                    Create project
                  </button>

                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => {
                      setShowAssessmentModal(true);
                    }}
                  >
                    <i
                      className="fad fa-fw fa-users mr-2"
                      aria-hidden="true"
                    ></i>
                    Add Assessment
                  </button>
                </div>
              }
            >
              <button type="button" className="btn btn-sm w-100 px-0">
                <i className="fas fa-plus fa-fw-dropdown  "></i>
                <span className="nav-text ml-2">New</span>
              </button>
            </OverlayTrigger>
          </div>
        </div>
        <div className="d-flex justify-content-end row">
          <div className="col-md-2" style={{ minWidth: 150 }}>
            <input
              type="text"
              placeholder="Type to search"
              onChange={(e) => onSearchChange(e.target.value)}
              className="form-control form-control-filter"
            />
          </div>
          <div className="col-md-2 mb-2" style={{ minWidth: 150 }}>
            <select
              className="font-14 form-select"
              name="salaryCurrency"
              onChange={(e) => setFilterInfo(e.target.value)}
            >
              <option value={""} selected>
                Select owner
              </option>
              {userData?.map((item, index) => (
                <option key={index} value={item._id}>
                  {item.firstName} {item.lastName}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2" style={{ minWidth: 200 }}>
            <select
              name=""
              id=""
              className="font-14 form-select col-3"
              onChange={(e) => onChangeSelect(e.target.value)}
            >
              <option value="project"> View by project </option>
              <option value="assessment"> View by assessment </option>
            </select>
          </div>
        </div>
      </div>

      {projectView ? (
        "loading" && false ? (
          <></>
        ) : (
          <div className="row d-flex-1200 px-4">
            <div className="px-3 mb-3 mt-3">
              <div className="border-top"></div>
            </div>

            {projectData?.map((x, i) => (
              <>
                <div
                  key={i}
                  className="col-xl-3 col-lg-6 col-md-6 col-sm-12 d-flex"
                >
                  <a
                    href
                    className="card col card-tag-bottom mb-4 card-lg card-candidates-grid p-relative"
                  >
                    <div className="card-body ">
                      <Link
                        to={"/project/assessments"}
                        state={{
                          projectId: x?._id,
                          projectName: x?.projectName,
                          owner: x?.owner,
                          description: x?.description,
                          project: x,
                        }}
                      >
                        <div className="d-flex align-items-center">
                          <Avatar
                            className="avatar mr-3"
                            name={
                              x?.owner?.firstName + " " + x?.owner?.lastName
                            }
                            round="50%"
                          />
                          <div className="fs-5 text mb-2">
                            {getHighlightedText(x?.projectName, searchValue)}
                          </div>
                        </div>
                      </Link>

                      <div className="font-regular font-primary font-gray1 mt-2">
                        <span className="mr-1">Owner:</span>
                        <span className="">
                          {getHighlightedText(
                            `${x?.owner?.firstName} ${x?.owner?.lastName}`,
                            searchValue
                          )}
                        </span>
                      </div>

                      {x.tests?.length > 0 && (
                        <div className=" fw-normal">
                          Assessments:
                          <span>
                            {x.tests?.map(
                              (z, index) =>
                                (index < 2 || x._id === projectId) && (
                                  <span
                                    key={index}
                                    className="tag tag-blue3 mr-1 mb-1"
                                  >
                                    {z.testName}
                                  </span>
                                )
                            )}
                          </span>
                          {x._id !== projectId ? (
                            x.tests?.length > 2 && (
                              <div
                                className="tag"
                                onClick={() => setProjectId(x._id)}
                              >
                                Show more
                              </div>
                            )
                          ) : x._id === projectId ? (
                            <div
                              className="tag"
                              onClick={() => setProjectId("")}
                            >
                              Show less
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      )}

                      <div className={x?.description.length <= 0 && "mb-5"}>
                        {x?.description.length > 0 && (
                          <div className="font-regular font-primary font-gray1 mb-5 col-12 text-truncate">
                            <span className="mr-1">Description:</span>
                            <span className="">{x?.description}</span>
                          </div>
                        )}
                      </div>

                      <div className="candidates-grid-request font-regular">
                        <div
                          className=" gap-2 p-2 border-top"
                          style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            justifyContent: "space-between",
                          }}
                        >
                          <div className="font-small ms-1">
                            Created on:{" "}
                            <span>
                              {moment(x.createdAt).format("MM/DD/YYYY")}
                            </span>
                          </div>
                          <div className="ms-1 font-small">
                            Created by:{" "}
                            <span>
                              {x.userDetails.firstName} {x.userDetails.lastName}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              </>
            ))}
            {projectData?.length > 0 && (
              <div className="d-flex justify-content-between">
                <p>{`Showing ${count.current} of ${count.total}`}</p>
                <Pagination
                  currentPage={currentPage}
                  totalSize={projectCount}
                  sizePerPage={8}
                  firstPageText="⟨⟨"
                  lastPageText="⟩⟩"
                  showFirstLastPages={true}
                  changeCurrentPage={changeCurrentPage}
                  theme="border-bottom"
                />
              </div>
            )}
          </div>
        )
      ) : (
        <Assessments viewFrom={"project"} />
      )}

      <Modal
        show={showProjectModal}
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
              Add project
            </h6>
          </div>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            onClick={() => {
              setShowProjectModal(false);
              setProjectDetails({
                projectName: "",
                owner: {
                  firstName: "",
                  lastName: "",
                  id: "",
                },
                tests: [],
                description: "",
              });
            }}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <Modal.Body>
          <>
            <div className=" pb-2 modal-body">
              <div className="d-flex  align-items-center">
                <label className="ml-auto mr-4 mb-2">
                  *Denotes mandatory field
                </label>
              </div>
              <div className="card mx-3 mb-3">
                <div className=" bg-gray4 m-3">
                  {/* <div className="card-body"> */}
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          name="projectName"
                          placeholder="Project name"
                          value={projectDetails.projectName}
                          onChange={(e) => {
                            e.target.value = e.target.value.replace(
                              /^[ \t]+|[ \t]+$/gm,
                              ""
                            );
                            setProjectDetails({
                              ...projectDetails,
                              projectName: e.target.value,
                            });
                          }}
                        />
                        <label>Project name*</label>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-floating pl-1">
                        <select
                          className="font-14 form-select"
                          name="salaryCurrency"
                          onChange={(e) => onChangeProjectOwner(e.target.value)}
                        >
                          <option value={"none"}>--select--</option>
                          {userData.map((x, i) => (
                            <option key={i} value={x._id}>
                              {x.firstName} {x.lastName}
                            </option>
                          ))}
                        </select>
                        <label>Project owner name*</label>
                      </div>
                    </div>
                  </div>
                  {/* </div> */}
                </div>
                <div className=" bg-gray4 mx-3 mb-3">
                  {/* <div className="card-body"> */}
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="form-floating">
                        <textarea
                          rows="3"
                          className="form-control"
                          name="description"
                          placeholder="Enter a owner name"
                          value={projectDetails.description}
                          onChange={(e) => {
                            setProjectDetails({
                              ...projectDetails,
                              description: e.target.value,
                            });
                          }}
                        ></textarea>

                        <label>Description</label>
                      </div>
                    </div>
                  </div>
                  {/* </div> */}
                </div>
              </div>

              <div className=" modal-footer text-right">
                <button
                  className="btn btn-sm btn-secondary mr-2"
                  onClick={() => {
                    setShowProjectModal(false);
                    setProjectDetails({
                      projectName: "",
                      owner: {
                        firstName: "",
                        lastName: "",
                        id: "",
                      },
                      tests: [],
                      description: "",
                    });
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={(e) => onSubmitProject(e)}
                >
                  Submit
                </button>
              </div>
            </div>
          </>
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
              setShowAssessmentModal(false);
              setShowAssessmentAddModal(false);
              setSelectedProject({});
              setSelectedAssessment({});
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
                      <select
                        className="font-14 form-select"
                        name="salaryCurrency"
                        onChange={(e) => onChangeProject(e.target.value)}
                        value={selectedProject?._id}
                      >
                        <option value="--select--">Select Project</option>
                        {projectData?.map((x, i) => (
                          <option
                            disabled={selectedAssessment?.projects?.find(
                              (p) => p.projectId === x._id
                            )}
                            key={i}
                            value={x._id}
                          >
                            <div className="">
                              <div>{x.projectName}</div>
                            </div>
                          </option>
                        ))}
                      </select>
                      <label>Project*</label>
                    </div>
                    {selectedProject?.owner?.firstName?.length > 1 && (
                      <div
                        className="shadow-sm rounded-2 ml-1 px-3 p-1 d-flex"
                        style={{ backgroundColor: "#fff", width: "100%" }}
                      >
                        <div className=" ">
                          <div className="mt-1">
                            <strong>Owner:</strong>{" "}
                            {selectedProject?.owner?.firstName}{" "}
                            {selectedProject?.owner?.lastName}
                          </div>
                          <div>
                            {selectedProject?.description?.length > 0 && (
                              <>
                                <strong>Description: </strong>
                                {selectedProject?.description}
                              </>
                            )}
                          </div>
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
                      setSelectedAssessment({});
                      setCurrentPageAssessment(1);
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
                      setSelectedAssessment({});
                      setCurrentPageAssessment(1);
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
                                {selectedAssessment?.skills?.filter(
                                  (x) => x.length > 0
                                )?.length > 0 && (
                                  <>
                                    <span className="mr-1">Skill:</span>
                                    {selectedAssessment?.skills?.map(
                                      (item, index) =>
                                        (index < 2 ||
                                          selectedAssessment?._id ===
                                            testId) && (
                                          <div
                                            key={index}
                                            className="tag tag-green2"
                                            style={{ margin: "2px" }}
                                          >
                                            <span>{item}</span>
                                          </div>
                                        )
                                    )}
                                  </>
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
                                Created on:
                                {moment(selectedAssessment.updatedAt).format(
                                  "MM/DD/YYYY"
                                )}
                              </div>
                            </div>
                          </div>
                        </a>
                        <hr />
                        <div
                          // className="card card-flat"
                          className="d-flex col-12 justify-content-center align-item-center"
                          onClick={() => {
                            setSelectedAssessment({});
                          }}
                        >
                          <div
                            className="p-2 px-5 btn"
                            style={{ backgroundColor: "#" }}
                            type="button"
                          >
                            {AssessmentData.length > 1
                              ? "All Assessments"
                              : "Assessment"}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        {AssessmentData?.map((x, i) => (
                          <a
                            key={i}
                            href
                            className={`card d-flex flex-row align-items-stretch justify-content-between mb-1 p-relative ${
                              selectedProject?.tests?.find(
                                (y) => y.testId === x._id
                              )
                                ? "btn-disabled"
                                : ""
                            }`}
                            onClick={() =>
                              selectedProject?.tests?.find(
                                (y) => y.testId === x._id
                              )
                                ? toast.error(
                                    "Assessment seems to exist already"
                                  )
                                : onClickAssessment(x)
                            }
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
                                  {x?.skills?.filter((x) => x.length > 0)
                                    ?.length > 0 && (
                                    <>
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
                                    </>
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
                        ))}
                        <div className="d-flex justify-content-between">
                          <p>{`Showing ${countA.current} of ${AssessmentDataCount}`}</p>
                          <Pagination
                            currentPage={currentPageAssesment}
                            totalSize={AssessmentDataCount}
                            sizePerPage={3}
                            firstPageText="⟨⟨"
                            lastPageText="⟩⟩"
                            showFirstLastPages={true}
                            changeCurrentPage={setCurrentPageAssessment}
                            theme="border-bottom"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className=" modal-footer text-right">
              <button
                className="btn btn-sm btn-secondary mr-2"
                onClick={() => {
                  setShowAssessmentModal(false);
                  setShowAssessmentAddModal(false);
                  setSelectedProject({});
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-sm btn-primary"
                onClick={(e) => createAssessment()}
                disabled={
                  selectedAssessment?.testName?.length > 0 &&
                  selectedProject?.projectName?.length > 0
                    ? false
                    : true
                }
              >
                Add Assessment
              </button>
            </div>
          </>
        </Modal.Body>
      </Modal>

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
    </>
  );
};

export default ProjectScreen;
