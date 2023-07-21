import React, { useState, useEffect } from "react";
import moment from "moment";
import Modal from "react-bootstrap/Modal";
import Vimeo from "@u-wave/react-vimeo";
import { Link } from "react-router-dom";
const ResultCardMobile = (props) => {
  const [date, setDate] = useState("");
  const [score, setScore] = useState(0.0);
  const [questionNum, setQuestionNum] = useState(1);
  const [showResult, setShowResult] = useState(false);
  const [showQ, setShowQ] = useState(false);
  useEffect(() => {
    setDate(dateFormat(props?.result?.createdAt));
    // props?.parent === "test"
    // ?
    setScore(scoring(props?.result));
    // : setScore(props?.result?.score);
  }, [props?.result]);

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

    var percent =
      candid?.testAssign?.testCategory === "MCQ"
        ? (Number(score) * 100) / candid?.questions?.length
        : (Number(score) * 100) / Number(maximumScore);

    return candid?.testAssign?.testCategory === "MCQ"
      ? percent?.toFixed(2)
      : candid.isReviewed
      ? percent?.toFixed(2)
      : "Under Review";
  };
  const dateFormat = (createdAt) => {
    return moment(createdAt).format("MM/DD/YYYY");
  };

  const onClickCandidate = (e) => {
    e.preventDefault();
    // setShowResult(true);
  };

  return (
    <>
      <div key={props.key} className="col-12 d-flex">
        <Link
          to={
            props.result.isReviewed ||
            props.result.testAssign.testCategory === "MCQ"
              ? `/result/${props.result.candidateId}`
              : {}
          }
          state={{
            backBtn: true,
          }}
          // onClick={(e) => {
          //   onClickCandidate(e);
          // }}
          className="card col-12 card-tag-bottom mb-4 card-lg"
        >
          <div className="card-body pb-0">
            <div className="mb-1 mt-1">
              <span>
                <span>
                  Candidate's name:{" "}
                  <span style={{ fontWeight: 400 }} className="">
                    {props?.result?.candidateData?.candidateInfo?.firstName}{" "}
                    {props?.result?.candidateData?.candidateInfo?.lastName}
                  </span>
                </span>
              </span>
            </div>{" "}
            <div className="mb-1 mt-1">
              <span>
                <span>
                  Assessment name:{" "}
                  <span style={{ fontWeight: 400 }} className="">
                    {props?.result?.testAssign?.testName.split("_")[0]}
                  </span>
                </span>
              </span>
            </div>{" "}
            <div className="mb-1 mt-1">
              <span>
                <span>
                  Completed on:{" "}
                  <span style={{ fontWeight: 400 }} className="">
                    {date}
                  </span>
                </span>
              </span>
            </div>{" "}
            <div className="mb-1 mt-1"></div>
            <hr />
            <div className="mt-3">
              <div className="card-body text-muted font-regular d-flex flex-column align-items-start justify-content-start pl-0">
                <div className="mb-1">
                  <span>
                    Score :{" "}
                    <span>
                      <span className="font-bold d-inline-1024 d-none">
                        Result:{" "}
                      </span>
                      {!isNaN(score) &&
                        score <
                          Number(
                            props?.result?.testAssign?.details?.passScore
                          ) && (
                          <span className="tag tag-coral">{score + "%"}</span>
                        )}
                      {!isNaN(score) &&
                        score >=
                          Number(
                            props?.result?.testAssign?.details?.passScore
                          ) && (
                          <span className="tag tag-green3">{score + "%"}</span>
                        )}
                      {isNaN(score) && (
                        <span className="tag tag-green2">{score}</span>
                      )}
                    </span>
                  </span>{" "}
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>{" "}
      <Modal
        show={showResult}
        size="xl"
        className="modal fade"
        data-backdrop="static"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >
        <div className="modal-header" id="EditQuestionModal">
          <h6 className="modal-title ml-1" id="EditQuestionModalLabel">
            Result
          </h6>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            onClick={() => setShowResult(false)}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <Modal.Body>
          <>
            <div className="row">
              <div className="col">
                <a className="card p-0 d-flex align-items-center justify-content-between flex-row overflow-hidden m-3">
                  <div className="card-body">
                    <h6>{props?.result?.candidateName}</h6>
                    <div className="d-flex align-items-center">
                      <span className="d-flex align-items-center me-3">
                        <i className="far fa-suitcase me-2 font-brandBlue" />
                        <span className="font-regular font-primary font-gray1">
                          {props?.result?.testAssign?.testName.split("_")[0]}
                        </span>
                      </span>
                      <span className="d-flex align-items-center me-3">
                        <i className="far fa-hourglass me-2" />
                        <span className="font-regular font-primary font-gray1">
                          {date}
                        </span>
                      </span>
                      <span className="d-flex align-items-center me-3">
                        <i className="far fa-clock me-2 font-brandBlue" />
                        <span className="font-regular font-primary font-gray1">
                          {props?.result?.testAssign?.details?.duration} mins
                        </span>
                      </span>
                      <span className="d-flex align-items-center me-3">
                        <i className="far fa-question-circle me-2 font-brandBlue" />
                        <span className="font-regular font-primary font-gray1">{`${
                          props?.result?.questions?.length
                        } ${
                          props?.result?.questions?.length === 1
                            ? "Question"
                            : "Questions"
                        }`}</span>
                      </span>{" "}
                      <span className="d-flex align-items-center me-3">
                        <i className="fa fa-abacus me-2" />
                        <span className="font-regular font-primary font-gray1">{`${props?.result?.testAssign?.details?.passScore}% Passing Score`}</span>
                      </span>{" "}
                      {props?.result?.testAssign?.testCategory === "OneWay" &&
                        props?.result?.isReviewed && (
                          <span className="d-flex align-items-center me-3">
                            {props?.result?.isRecommended ? (
                              <i
                                style={{ color: "green" }}
                                className="fa fa-check-circle me-2"
                              />
                            ) : (
                              <i
                                style={{ color: "red" }}
                                className="fa fa-times-circle me-2"
                              />
                            )}
                            <span className="font-regular font-primary font-gray1">
                              {props?.result?.isRecommended
                                ? "Recommended"
                                : "Not Recommended"}
                            </span>
                          </span>
                        )}
                      <span className="d-flex align-items-center me-3">
                        {Number(score) <
                        Number(
                          props?.result?.testAssign?.details?.passScore
                        ) ? (
                          <span
                            style={{ fontSize: 15 }}
                            className="font-regular font-primary font-coral"
                          >
                            Fail
                          </span>
                        ) : Number(score) >=
                          Number(
                            props?.result?.testAssign?.details?.passScore
                          ) ? (
                          <span
                            style={{ fontSize: 15 }}
                            className="font-regular font-primary font-green"
                          >
                            Pass
                          </span>
                        ) : (
                          <></>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="d-flex align-items-center justify-content-end">
                    <div
                      className={
                        Number(score) <
                        Number(props?.result?.testAssign?.details?.passScore)
                          ? "w-200   text-center bg-coral font-white font-regular py-4 px-2"
                          : Number(score) >=
                            Number(
                              props?.result?.testAssign?.details?.passScore
                            )
                          ? "w-200   text-center bg-green_primary font-white font-regular py-4 px-2"
                          : "w-200   text-center bg-green2 font-black font-regular py-4 px-2"
                      }
                    >
                      <span className="font-16">
                        Score:{" "}
                        {score < 30.0 ? (
                          <span>{score + "%"}</span>
                        ) : score >= 30.0 && score < 60 ? (
                          <span>{score + "%"}</span>
                        ) : score >= 60.0 ? (
                          <span>{score + "%"}</span>
                        ) : (
                          <span>{score}</span>
                        )}
                      </span>
                    </div>
                  </div>
                </a>
              </div>
            </div>
            <hr></hr>
            <div className="card m-3">
              <div className="card-body">
                <table className="table table-sortable  table-hoverable mt-4">
                  <thead>
                    <tr>
                      <th className="no-hover pt-0">
                        <div className="d-flex align-items-center">
                          <h6>Question</h6>
                        </div>
                      </th>
                      <th
                        className=" no-hover pt-0 p-relative"
                        style={{ width: 110, textAlign: "left" }}
                      >
                        <div className="text-center">
                          <h6>Status</h6>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {props?.result?.questions.map((question, idx) => {
                      return (
                        <tr
                          style={{ height: 70 }}
                          onClick={() => {
                            props?.result?.testAssign?.testCategory ===
                              "OneWay" &&
                              props?.result?.isReviewed &&
                              setShowQ(true);
                            setQuestionNum(idx + 1);
                          }}
                        >
                          {/* <td>{idx + 1}</td> */}
                          <td>
                            {/* {questionsList?.length > 0
                                ? questionsList.find(
                                    (f) => f._id === question?.questionId
                                  )?.question
                                : null} */}
                            {
                              props?.result?.testAssign?.questions[idx]
                                ?.question
                            }
                          </td>
                          {/* <td>
                              <p>Click to watch response.</p>
                            </td> */}
                          {props?.result?.testAssign?.testCategory === "MCQ" ? (
                            <td className="text-center">
                              {question.isAnswered ? (
                                question.isCorrectAnswer ? (
                                  <i
                                    className="fas fa-check-circle"
                                    style={{ color: "green", fontSize: 20 }}
                                  ></i>
                                ) : (
                                  <i
                                    className="fas fa-times-circle"
                                    style={{ color: "red", fontSize: 20 }}
                                  ></i>
                                )
                              ) : (
                                "NA"
                              )}
                            </td>
                          ) : props?.result?.isReviewed ? (
                            <td className="text-center">
                              {question?.marks}/10
                            </td>
                          ) : (
                            <td className="text-center">Under review</td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>{" "}
            {props?.result?.testAssign?.testCategory === "OneWay" &&
              props?.result?.isReviewed &&
              props?.result?.feedback !== "" && (
                <>
                  <hr></hr>
                  <div className="card m-3">
                    <div className="card-body">
                      <table className="table table-sortable  table-hoverable mt-4">
                        <thead>
                          <tr>
                            <th className="no-hover pt-0">
                              <div className="d-flex align-items-center">
                                <h6> Feedback</h6>
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr style={{ height: 70 }}>
                            <td>{props?.result?.feedback}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
          </>
        </Modal.Body>
      </Modal>
      <Modal
        show={showQ}
        size="xl"
        className="modal fade"
        data-backdrop="static"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >
        <div className="modal-header" id="EditQuestionModal">
          <h6 className="modal-title ml-1" id="EditQuestionModalLabel">
            Result for Question {questionNum}
          </h6>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            onClick={() => setShowQ(false)}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <Modal.Body>
          <div className="col-lg-12 py-4 px-5">
            <div className="card card-flat card-borderless p-0 p-0-600 mb-3">
              {props?.result?.isReviewed && (
                <div className="d-flex justify-content-between h-100 p-5">
                  <div className="d-flex flex-column">
                    {" "}
                    <h6>
                      Question:{" "}
                      {
                        props?.result?.testAssign?.questions[questionNum - 1]
                          ?.question
                      }
                    </h6>{" "}
                    <h6>
                      result: {props?.result?.questions[questionNum - 1]?.marks}{" "}
                      / 10
                    </h6>{" "}
                  </div>

                  <div className=" d-flex  ">
                    <Vimeo
                      className=""
                      // style={{ margin: "0 auto" }}
                      video={
                        props?.result?.questions[questionNum - 1]?.videoUrl
                      }
                      height={400}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ResultCardMobile;
