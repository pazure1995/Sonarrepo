import moment from "moment";
import React, { useEffect, useState } from "react";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import TestInfo from "./TestDetails/TestInfo";

const TestListView = (props) => {
  const [testDetails, setTestDetails] = useState({});
  const [testId, setTestId] = useState(null);

  const [matches, setMatches] = useState(
    window.matchMedia("(max-width: 1200px)").matches
  );

  useEffect(() => {
    window
      .matchMedia("(max-width: 1200px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);

  const navigation = (i, test) => {
    props.setShowTestDetails(true);
    setTestDetails({ id: i, data: test });
  };

  const handleModal = () => {
    props.setShowTestDetails(false);
  };

  return (
    <>
      {!matches ? (
        <div className="row d-block-force">
          <div className="col">
            {
              <>
                {props?.testList?.map((test, i) => {
                  const resultsCount = test?.results?.filter(
                    (t) => t.testStatus === "completed"
                  ).length;
                  const totalRes = test?.results?.length;
                  const invitesCount =
                    test?.candidateDetails?.filter(
                      (i) => i?.testStatus === "Invited" && i.createdFrom === ""
                    )?.length + totalRes;
                  return (
                    <a
                      key={i}
                      onClick={(e) => {
                        e.preventDefault();
                        navigation(i, { ...test });
                      }}
                      className="card d-flex flex-row align-items-stretch justify-content-between mb-1 p-relative"
                      href
                    >
                      <div className="card-body d-flex align-items-center overflow-auto">
                        <div className="w-100 ml-2">
                          <div className="d-flex align-items-center mb-1">
                            <h6 className="mb-0 me-2">
                              {props?.getHighlightedText(
                                test?.testName,
                                props?.searchValue
                              ) || test?.testName}{" "}
                            </h6>

                            <span
                              className={`tag ${
                                test?.testCategory === "MCQ"
                                  ? "tag-red1"
                                  : test.testCategory === "General"
                                  ? "tag-orange1"
                                  : "tag-blue1"
                              }`}
                            >
                              <span>{test?.testCategory}</span>
                            </span>
                          </div>

                          {test?.createdBy?.role === "admin" ? (
                            <></>
                          ) : (
                            test?.projects?.filter(
                              (x) =>
                                x.projectName?.length > 0 &&
                                x.projectId?.length > 0
                            ).length > 0 && (
                              <div className="font-regular font-primary font-gray1 text-truncate my-1">
                                <span className="mr-1">Project:</span>
                                {test?.projects
                                  ?.filter(
                                    (x) =>
                                      x.projectName?.length > 0 &&
                                      x.projectId?.length > 0
                                  )
                                  ?.map(
                                    (item, index) =>
                                      (index < 2 || test._id === testId) && (
                                        <div
                                          key={index}
                                          className="tag tag-green2"
                                          style={{ margin: "2px" }}
                                        >
                                          <span>{item.projectName}</span>
                                        </div>
                                      )
                                  )}
                                {test._id !== testId ? (
                                  test?.projects?.length > 2 && (
                                    <div
                                      className="tag"
                                      onClick={() => setTestId(test._id)}
                                      style={{ margin: "2px" }}
                                    >
                                      Show more
                                    </div>
                                  )
                                ) : test._id === testId ? (
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
                            )
                          )}
                        </div>
                      </div>
                      <div className="card-body text-muted font-regular d-flex flex-column align-items-end justify-content-center">
                        <div className="d-flex  align-items-center">
                          <div style={{ height: 70, width: 70 }}>
                            <CircularProgressbarWithChildren
                              value={
                                resultsCount === 0
                                  ? 0
                                  : (test?.results?.length * 100) /
                                    test?.candidateDetails?.length
                              }
                            >
                              <div>
                                <span className="fs-3 text">
                                  {resultsCount ? resultsCount : 0}
                                </span>
                                <span className="fs-6 text">
                                  <span>/</span>
                                  {invitesCount ? invitesCount : 0}
                                </span>
                              </div>
                            </CircularProgressbarWithChildren>
                          </div>
                        </div>
                        <div className="mb-1">
                          <span>
                            Number of questions: {test?.questionsLength}
                          </span>
                        </div>
                        <div className="mb-1">
                          <span className=" ">
                            Created on:{" "}
                            <span className="tag ">
                              {moment(test?.createdAt).format("M/D/YYYY")}
                            </span>
                          </span>
                        </div>{" "}
                        <div className="mb-1">
                          <span>
                            {" "}
                            Created by:{" "}
                            <span className="tag ">
                              {`${test?.userDetails?.firstName} ${test?.userDetails?.lastName}`}
                            </span>
                          </span>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </>
            }

            {!props?.testList?.length && (
              <div>
                <div className="text-center p-3">
                  <div className="avatar avatar-lg">
                    <i className="fad fa-comment-slash"></i>
                  </div>
                  <div className="mt-3">No Assessments Found </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="row">
            {props?.testList?.map((test, i) => {
              const resultsCount = test?.results?.filter(
                (t) => t.testStatus === "completed"
              ).length;
              const totalRes = test?.results?.length;
              const invitesCount =
                test?.candidateDetails?.filter(
                  (i) => i?.testStatus === "Invited"
                )?.length + totalRes;
              return (
                <div
                  key={i}
                  className="col-xl-4 col-lg-6 col-md-12 col-sm-12 d-flex"
                >
                  <a
                    href
                    className="card col card-tag-bottom mb-4 card-lg card-candidates-grid p-relative"
                  >
                    <div className="card-body pb-0">
                      <div
                        className="row"
                        onClick={(e) => {
                          e.preventDefault();
                          navigation(i, test);
                        }}
                      >
                        <div className="col-xl-8 col-lg-6 col-md-12 col-sm-12 mb-2">
                          <div className=" align-items-center mt-2 ">
                            <p className="mb-1 pb-1">
                              <span className="fs-6 text">
                                {props.getHighlightedText(
                                  test.testName,
                                  props.searchValue
                                )}{" "}
                              </span>
                            </p>
                            <span
                              className={`tag
                         ${
                           test.testCategory === "MCQ"
                             ? "tag-red1"
                             : test.testCategory === "General"
                             ? "tag-orange1"
                             : "tag-blue1"
                         }`}
                            >
                              {test?.testCategory}
                            </span>{" "}
                            <span
                              className={
                                test?.difficulty === "Simple"
                                  ? "tag tag-blue3 ml-2"
                                  : test?.difficulty === "Medium"
                                  ? "tag tag-green2 ml-2"
                                  : "tag tag-red1 ml-2"
                              }
                            >
                              {test?.difficulty}
                            </span>
                          </div>
                        </div>
                        <div className=" col-xl-4 col-lg-6 col-md-12 col-sm-12">
                          <div style={{ height: 70, width: 70 }}>
                            <CircularProgressbarWithChildren
                              value={
                                resultsCount === 0
                                  ? 0
                                  : (resultsCount * 100) / invitesCount
                              }
                            >
                              <div>
                                <span className="fs-3 text">
                                  {resultsCount ? resultsCount : 0}
                                </span>
                                <span className="fs-6 text">
                                  <span>/</span>
                                  {invitesCount ? invitesCount : 0}
                                </span>
                              </div>
                            </CircularProgressbarWithChildren>
                          </div>
                        </div>
                      </div>

                      {/* <div className="font-regular font-primary font-gray1 text-truncate my-1"></div> */}
                      <hr className="mb-0 pb-0" />
                      <div className="">
                        <div className="card-body text-muted font-regular d-flex flex-column align-items-start justify-content-start pl-0 pr-0">
                          {/* <div className="col-12 d-flex justify-content-center mb-3"></div>{" "} */}
                          <div className="mb-1">
                            {test?.createdBy?.role === "admin" ? (
                              <></>
                            ) : (
                              test?.projects?.length > 0 && (
                                <span className="text-muted font-regular font-primary font-gray1 text-truncate ">
                                  Project:{" "}
                                  {test?.projects?.map(
                                    (item, index) =>
                                      (index < 2 || test._id === testId) && (
                                        <div
                                          key={index}
                                          className="tag tag-green2"
                                          style={{ margin: "2px" }}
                                        >
                                          <span>{item.projectName}</span>
                                        </div>
                                      )
                                  )}
                                  {test._id !== testId ? (
                                    test?.projects?.length > 2 && (
                                      <div
                                        className="tag"
                                        onClick={() => setTestId(test._id)}
                                        style={{ margin: "2px" }}
                                      >
                                        +{test?.projects?.length - 2} more
                                      </div>
                                    )
                                  ) : test._id === testId ? (
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
                                </span>
                              )
                            )}
                          </div>
                          <div className="mb-1">
                            <span>
                              {" "}
                              Number of questions: {test?.questionsLength}
                            </span>
                          </div>{" "}
                          <div className=" justify-content-between font-small">
                            <div className=" ">
                              Created on:{" "}
                              <span className=" ">
                                {moment(test?.createdAt).format("MM/DD/YYYY")}
                              </span>
                            </div>
                            <div className="">
                              Created by:{" "}
                              <span className=" ">
                                {`${test?.userDetails?.firstName} ${test?.userDetails?.lastName}`}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
        </>
      )}
      {props.showTestDetails &&
        (props?.projectTestList ? (
          <></>
        ) : (
          <TestInfo
            testDetails={testDetails}
            handleSuccess={handleModal}
            setShowTestDetails={props.setShowTestDetails}
            getData={props.getData}
          />
        ))}
    </>
  );
};

export default TestListView;
