import React, { useEffect, useState } from "react";
import Vimeo from "@u-wave/react-vimeo";
import logo from "../../assets/images/High5Logo.png";
import { useLocation, useParams } from "react-router";
import { toast } from "react-toastify";
import moment from "moment";
import Loader from "../../components/loader/Loader";
import { useNavigate } from "react-router-dom";
import ReviewInstruction from "./ReviewInstruction";
import ReviewDone from "./ReviewDone";
import { post } from "../../services/ApiServices";
import {
  findResultByCandidateIdUrl,
  updateCandidateUrl,
  updateResultByCandidateIdUrl,
  vettingDetailsUpdateStatus,
} from "../../services/ServiceUrls";

const Review = () => {
  const [result, setResult] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [newResult, setNewResult] = useState({});
  const [reviewComplete, setReviewComplete] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState({});
  const [marks, setMarks] = useState(
    Object.keys(newResult).length > 0
      ? newResult?.questions[currentQuestionIndex]?.marks
      : 0
  );
  const [optionalFeedback, setOptionalFeedback] = useState(
    Object.keys(newResult).length > 0
      ? newResult?.questions[currentQuestionIndex]?.feedback
      : ""
  );
  const [feedbackPresent, setFeedbackPresent] = useState(false);
  const [finalFeedback, setFinalFeedback] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [date, setDate] = useState("");
  const [data, setData] = useState({});
  const [score, setScore] = useState(0.0);
  const [recommend, setRecommend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedbackSelected, setFeedbackSelected] = useState(false);
  const [alredyReviewed, setAlredyReviewed] = useState(false);
  const [matches, setMatches] = useState(
    window.matchMedia("(max-width: 1223px)").matches
  );
  let screenWidth = window.innerWidth < 574 ? true : false;
  let screenWidth2 = window.innerWidth < 1270 ? true : false;
  const [isBigScreen, setIsBigScreen] = useState(screenWidth2);
  const [isSmallScreen, setIsSmallScreen] = useState(screenWidth);
  const params = useParams();
  const candidateId = params.candidateId;
  const temp = [];
  const navigate = useNavigate();
  const location = useLocation();

  const handleSetMarks = (index) => {
    let marks =
      Object.keys(newResult).length > 0
        ? newResult?.questions[index]?.marks !== undefined
          ? newResult?.questions[index]?.marks
          : 0
        : 0;
    setMarks(marks);
  };
  const handleSetOptionalFeedback = (index) => {
    let feedback =
      Object.keys(newResult).length > 0
        ? newResult?.questions[index]?.feedback !== undefined
          ? newResult?.questions[index]?.feedback
          : ""
        : "";
    setOptionalFeedback(feedback);
  };

  useEffect(() => {
    feedbackSelected &&
      setReviewComplete(
        newResult.questions.filter((x) => x?.marks?.lenght === 0).length === 0
      );
    // eslint-disable-next-line
  }, [feedbackSelected]);

  useEffect(() => {
    const init = async () => {
      await post(findResultByCandidateIdUrl, {
        candidateId: candidateId,
      })
        .then((res) => {
          setData(res.data);
          setFeedbackPresent(res.data.isReviewed);
          setDate(dateFormat(res.data.createdAt));
          setQuestions(res.data?.testAssign?.questions);
          setQuestion(res.data?.testAssign?.questions[0]);
          setResult(res.data);
          const tempQuestions = res.data.questions.map((x) => {
            if (x.type === "MCQ") {
              if (x.isCorrectAnswer === true) return { ...x, marks: 10 };
              else return { ...x, marks: 0 };
            } else return x;
          });

          setNewResult({ ...res.data, questions: tempQuestions });
          setScore(scoring({ ...res.data, questions: tempQuestions }));
          // setVideoQ(res.data?.questions[0]);
          // if (res.data?.testAssign?.questions[0].type !== "OneWay")
          setTimeout(() => setLoading(false), 3000);
        })
        .catch((err) => {
          console.log(err);
          setTimeout(() => setLoading(false), 3000);
        });
    };
    init();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    data?.questions?.map((x, index) => {
      const tempQue = result.testAssign?.questions.find(
        (y) => y?._id === x.questionId
      );
      index === 0
        ? temp.push({
            ...x,
            ...tempQue,
            selected: feedbackSelected ? false : true,
            queNo: index + 1,
          })
        : temp.push({ ...x, ...tempQue, selected: false, queNo: index + 1 });
      return temp;
    });
    setQuestions(temp);
    setQuestion(temp[0]);
    // eslint-disable-next-line
  }, [data]);

  const scoring = (candid) => {
    let score = 0;
    let maximumScore = 0;

    for (let i = 0; i < candid?.questions?.length; i++) {
      let m =
        candid?.questions[i]?.marks !== undefined
          ? candid?.questions[i]?.marks
          : 0;
      score = score + Number(m);
      maximumScore = maximumScore + 10;
    }
    var percent = (Number(score) * 100) / Number(maximumScore);
    return percent?.toFixed(2);
  };

  const onClickQuestion = (que) => {
    if (que.type === "OneWay") {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
    setFeedbackSelected(false);
    setQuestions((state) => {
      const temp = [...state];
      temp.map((q) => {
        q._id === que._id ? (q.selected = true) : (q.selected = false);
        return que === "feedback" && setFeedbackSelected(true);
      });
      return temp;
    });
  };

  const dateFormat = (createdAt) => {
    return moment(createdAt).format("MM/DD/YYYY");
  };

  const saveReview = () => {
    const tempResult = newResult;
    tempResult.questions[currentQuestionIndex].marks = marks;
    tempResult.questions[currentQuestionIndex].feedback = optionalFeedback;
    let score = scoring(tempResult);
    setScore(score);
    setRecommend(score >= result?.testAssign?.details?.passScore);
    setNewResult(tempResult);
  };

  useEffect(() => {
    window
      .matchMedia("(max-width: 575px)")
      .addEventListener("change", (e) => setIsSmallScreen(e.matches));
    window
      .matchMedia("(max-width: 1270px)")
      .addEventListener("change", (e) => setIsBigScreen(e.matches));
    window
      .matchMedia("(max-width: 1223px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);

  const [instruction, setInstruction] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (finalFeedback === "")
      return toast.error("Please provide overall feedback");
    setLoading(true);
    let tempResult = newResult;
    delete tempResult._id;
    tempResult.isRecommended = recommend;
    tempResult.isReviewed = true;
    tempResult.feedback = finalFeedback;
    tempResult.testStatus = "completed";

    try {
      await post(updateResultByCandidateIdUrl, {
        candidateId: candidateId,
        data: tempResult,
      });
      await post(updateCandidateUrl, {
        candidateId: candidateId,
        testStatus: "completed",
      });

      //do this for Oneway and General. No need of sending notification to reviewer for MCQ

      /*if (candidate.createdFrom === "High5hire") {
        let obj = {
          data: tempResult,
          uniqueCode: candidate.uniqueCode,
          testStatus:
            candidate?.testAssign?.testCategory === "MCQ"
              ? "completed"
              : "underReview",
        };
        await post(vettingDetailsUpdateStatus, obj);
      }*/

      setFeedbackPresent(true);
      setLoading(false);
    } catch (err) {
      console.log("err", err);
      setLoading(false);
    }

    // const
    // .then((res) => {
    //   if (res.data.isReviewed) {
    //     toast.error("The review has already been completed");
    //     setFeedbackPresent(true);
    //     setAlredyReviewed(true);
    //     post(updateCandidateUrl, {
    //       candidateId: candidateId,
    //       testStatus: "completed",
    //     });
    //     return;
    //   }
    //   setLoading(false);
    //   setFeedbackPresent(true);
    // })
    // .catch((err) => {
    //   console.log(err);
    //   setLoading(false);
    // });
  };

  return feedbackPresent ? (
    <ReviewDone alredyReviewed={alredyReviewed} />
  ) : (
    <>
      {loading && <Loader />}
      {instruction ? (
        <>
          <ReviewInstruction
            setLoading={setLoading}
            setInstruction={setInstruction}
          />
        </>
      ) : (
        <>
          <div
            className="d-flex p-2 shadow p-3 border-bottom justify-content-between align-items-center"
            style={{ backgroundColor: "", height: "10vh", minHeight: 65 }}
          >
            <img src={logo} alt="logo" width={60} />
            {location?.state?.backBtn === true ? (
              <div className="mr-3" role="button" onClick={() => navigate(-1)}>
                <i className="fas fa-chevron-double-left"></i> Back
              </div>
            ) : (
              <></>
            )}
          </div>
          <div
            className="d-flex no-gutters position-relative"
            style={{
              height: "80vh",
              backgroundColor: "",
            }}
          >
            <div
              className="col-5 col-lg-4 col-xl-3 d-none d-sm-inline overflow-auto"
              style={{ height: "100%", backgroundColor: "" }}
            >
              <div className="footer-padding">
                <div className="ps-3 pt-3 ">
                  <h5 className="text-black">
                    <i
                      className="fa fa-user candidate-icon mr-2"
                      style={{ fontSize: 18 }}
                      aria-hidden="true"
                    ></i>
                    {result?.candidateInfo?.firstName}{" "}
                    {result?.candidateInfo?.lastName}
                  </h5>
                  <span className="tag">
                    <span>
                      <i
                        className="fa fa-file-text-o mr-2"
                        aria-hidden="true"
                      ></i>{" "}
                    </span>
                    {result?.testAssign?.testName}
                  </span>
                  <span
                    className={`ml-2 tag
                       ${
                         result?.testAssign?.testCategory === "MCQ"
                           ? "tag-red1"
                           : result?.testAssign?.testCategory === "General"
                           ? "tag-orange1"
                           : "tag-blue1"
                       }
                   `}
                  >
                    {result?.testAssign?.testCategory === "MCQ"
                      ? "MCQ"
                      : result?.testAssign?.testCategory === "OneWay"
                      ? "OneWay"
                      : result?.testAssign?.testCategory === "Multiline"
                      ? " Multiline"
                      : result?.testAssign?.testCategory === "General"
                      ? "General"
                      : ""}
                  </span>
                </div>
                <hr />

                <div className="overflow-auto">
                  {questions?.map((x, index) => (
                    <div
                      key={index}
                      className="left-panel-item border-bottom"
                      style={{
                        cursor: "pointer",
                        backgroundColor: x.selected ? "#dcedff" : "",
                      }}
                      onClick={() => {
                        // order of these function calls is important
                        saveReview();
                        setCurrentQuestionIndex(index);
                        handleSetMarks(index);
                        handleSetOptionalFeedback(index);
                        setQuestion(x);
                        onClickQuestion(x);
                      }}
                    >
                      <div className="p-3">
                        <div className="flex-grow-1">
                          <span className="bold">
                            {index + 1}:
                            {newResult.questions[index].marks !== undefined && (
                              <i
                                style={{ color: "green", float: "right" }}
                                className="fa fa-check-circle me-2"
                              />
                            )}
                          </span>{" "}
                          <span className="pr-3">{x.question}</span>
                        </div>
                      </div>
                    </div>
                  ))}{" "}
                  <div
                    className="left-panel-item border-bottom"
                    style={{
                      cursor: "pointer",
                      backgroundColor: feedbackSelected ? "#dcedff" : "",
                    }}
                    onClick={() => {
                      saveReview();
                      onClickQuestion("feedback");
                    }}
                  >
                    <div className="p-3">
                      <div className="flex-grow-1">
                        <h6 className="">Feedback</h6>
                        <div className="pr-3">
                          <div className=" text-truncate">Overall feedback</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col-12 col-sm-7 col-lg-8 col-xl-9 p-0 card p-2 mb-5 bg-body"
              style={{
                height: "100%",
                backgroundColor: "blue",
                overflow: "auto",
                zIndex: 1,
              }}
            >
              {isSmallScreen && (
                <>
                  {showSidebar && (
                    <div
                      className="shadow"
                      style={{
                        position: "absolute",
                        right: 0,
                        top: 0,
                        bottom: 0,
                        zIndex: 1000,
                        backgroundColor: "#fff",
                        width: "70%",
                        height: "100vh",
                      }}
                    >
                      <div
                        className="p-3 border-bottom"
                        onClick={() => setShowSidebar(false)}
                        style={{ cursor: "pointer" }}
                      >
                        <i
                          className="fa fa-times"
                          style={{ fontSize: 25, fontWeight: 400 }}
                          aria-hidden="true"
                        ></i>
                      </div>

                      <div className="overflow-auto mt-2">
                        {questions?.map((x, index) => (
                          <div
                            key={index}
                            className="left-panel-item border-bottom"
                            style={{
                              cursor: "pointer",
                              backgroundColor: x.selected ? "#dcedff" : "",
                            }}
                            onClick={() => {
                              saveReview();
                              setCurrentQuestionIndex(index);
                              handleSetMarks(index);
                              handleSetOptionalFeedback(index);
                              setQuestion(x);
                              onClickQuestion(x);
                              setShowSidebar(false);
                            }}
                          >
                            <div className="p-3">
                              <div className="flex-grow-1">
                                <span className="bold">
                                  {index + 1}:
                                  {newResult.questions[index].marks !==
                                    undefined && (
                                    <i
                                      style={{ color: "green", float: "right" }}
                                      className="fa fa-check-circle me-2"
                                    />
                                  )}
                                </span>{" "}
                                <span className="pr-3">{x.question}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                        <div
                          className="left-panel-item border-bottom"
                          style={{
                            cursor: "pointer",
                            backgroundColor: feedbackSelected ? "#dcedff" : "",
                          }}
                          onClick={() => {
                            saveReview();
                            onClickQuestion("feedback");
                            setShowSidebar(false);
                          }}
                        >
                          <div className="p-3">
                            <div className="flex-grow-1">
                              <h6 className="">Feedback</h6>
                              <div className="pr-3">
                                <div className=" text-truncate">
                                  Overall feedback
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="py-2 px-3 d-flex justify-content-between">
                    <div className="flex-fill">
                      <div className="pl-2">
                        <h5 className="text-black">
                          <i
                            className="fa fa-user candidate-icon mr-2"
                            style={{ fontSize: 18 }}
                            aria-hidden="true"
                          ></i>
                          {result?.candidateInfo?.firstName}{" "}
                          {result?.candidateInfo?.lastName}
                        </h5>
                        <span className="tag">
                          <span>
                            <i
                              className="fa fa-file-text-o mr-2"
                              aria-hidden="true"
                            ></i>{" "}
                          </span>
                          {result?.testAssign?.testName}
                        </span>
                        <span
                          className={`ml-2 tag
                           ${
                             result?.testAssign?.testCategory === "MCQ"
                               ? "tag-red1"
                               : result?.testAssign?.testCategory === "General"
                               ? "tag-orange1"
                               : "tag-blue1"
                           }
                        `}
                        >
                          {result?.testAssign?.testCategory === "MCQ"
                            ? "MCQ"
                            : result?.testAssign?.testCategory === "OneWay"
                            ? "OneWay"
                            : result?.testAssign?.testCategory === "Multiline"
                            ? " Multiline"
                            : result?.testAssign?.testCategory === "General"
                            ? "General"
                            : ""}
                        </span>
                      </div>
                    </div>

                    <div
                      style={{ height: 38 }}
                      className="border p-2 rounded-2"
                      onClick={() => setShowSidebar(true)}
                    >
                      <i className="fa fa-list-ul" aria-hidden="true"></i>
                    </div>
                  </div>
                </>
              )}
              {feedbackSelected ? (
                !matches ? (
                  <div className="card py-4 d-flex align-items-center justify-content-between flex-row overflow-hidden m-3">
                    <div className="card-body ">
                      <div className="d-flex align-items-center">
                        <span
                          className={`${
                            !isBigScreen
                              ? "d-flex me-3 ms-2"
                              : "border-end pe-2 me-2"
                          } align-items-center`}
                        >
                          <i className="far fa-hourglass me-2" />
                          <div className="font-regular font-primary font-gray1">
                            {date}
                          </div>
                        </span>
                        <span
                          className={`${
                            !isBigScreen
                              ? "d-flex me-3"
                              : "border-end pe-2 me-2"
                          } align-items-center`}
                        >
                          <i className="far fa-clock me-2 font-brandBlue" />
                          <div className="font-regular font-primary font-gray1">
                            {result?.testAssign?.details?.duration} mins
                          </div>
                        </span>
                        <span
                          className={`${
                            !isBigScreen
                              ? "d-flex me-3"
                              : "border-end pe-2 me-2"
                          } align-items-center`}
                        >
                          <i className="far fa-question-circle me-2 font-brandBlue" />
                          <div
                            className="font-regular font-primary font-gray1"
                            style={{ width: 85 }}
                          >{`${result?.questions?.length} ${
                            result?.questions?.length === 1
                              ? "Question"
                              : "Questions"
                          }`}</div>
                        </span>{" "}
                        <span
                          className={`${
                            !isBigScreen
                              ? "d-flex me-3"
                              : "border-end pe-2 me-2"
                          } align-items-center`}
                        >
                          <i className="fa fa-abacus me-2" />
                          <div
                            className="font-regular font-primary font-gray1"
                            style={{ width: 170 }}
                          >{`${result?.testAssign?.details?.passScore}% Passing Score`}</div>
                        </span>
                        <span className="d-flex align-items-center me-3">
                          {Number(score) <
                          Number(result?.testAssign?.details?.passScore) ? (
                            <span
                              style={{ fontSize: 15 }}
                              className="font-regular font-primary font-coral"
                            >
                              Fail
                            </span>
                          ) : Number(score) >=
                            Number(result?.testAssign?.details?.passScore) ? (
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

                    <div className="d-flex align-items-center justify-content-end ">
                      <div
                        className={
                          Number(score) <
                          Number(result?.testAssign?.details?.passScore)
                            ? "w-200   text-center bg-coral font-white font-regular py-4 px-2"
                            : Number(score) >=
                              Number(result?.testAssign?.details?.passScore)
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
                  </div>
                ) : (
                  <div className="card col card-tag-bottom mb-4 card-lg card-candidates-grid p-relative m-3">
                    <div
                      // className=" d-flex justify-content-end px-3 pt-2 bg-coral rounded-top p-1 "
                      className={
                        Number(score) <
                        Number(result?.testAssign?.details?.passScore)
                          ? "text-center bg-coral font-white font-regular d-flex justify-content-end px-3 pt-2 rounded-top p-1"
                          : Number(score) >=
                            Number(result?.testAssign?.details?.passScore)
                          ? "text-center bg-green_primary font-white font-regular d-flex justify-content-end px-3 pt-2 rounded-top p-1"
                          : "text-center bg-green2 font-black font-regular d-flex justify-content-end px-3 pt-2 rounded-top p-1"
                      }
                    >
                      <span className="d-flex align-items-center">
                        {Number(score) <
                        Number(result?.testAssign?.details?.passScore) ? (
                          <span
                            style={{
                              fontSize: 15,
                              color: "#ffffff",
                              fontWeight: 600,
                            }}
                            className="font-regular font-primary"
                          >
                            Fail
                          </span>
                        ) : Number(score) >=
                          Number(result?.testAssign?.details?.passScore) ? (
                          <span
                            style={{
                              fontSize: 15,
                              color: "#ffffff",
                              fontWeight: 600,
                            }}
                            className="font-regular font-primary"
                          >
                            Pass
                          </span>
                        ) : (
                          <></>
                        )}
                      </span>
                    </div>{" "}
                    <div className="py-3 px-4">
                      <div className="d-flex mb-2 align-items-center">
                        <div>
                          <h6
                            className="mb-0"
                            style={{
                              color:
                                Number(score) <
                                Number(result?.testAssign?.details?.passScore)
                                  ? "#FF5F57"
                                  : Number(score) >=
                                    Number(
                                      result?.testAssign?.details?.passScore
                                    )
                                  ? "#3ab549"
                                  : "font-black",
                            }}
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
                          </h6>
                        </div>
                      </div>
                      <div className="designation-city-status font-regular font-primary font-gray1 mt-1">
                        <div className="mb-2">
                          <i
                            className="far fa-suitcase me-2 font-brandBlue"
                            aria-hidden="true"
                          ></i>
                          {result?.testAssign?.testCategory}
                        </div>
                        <div className="mb-2">
                          <i
                            className="far fa-hourglass me-2"
                            aria-hidden="true"
                          ></i>
                          {date}
                        </div>
                        <div className="mb-2">
                          <i
                            className="far fa-clock me-2 font-brandBlue"
                            aria-hidden="true"
                          ></i>
                          {result?.testAssign?.details?.duration} mins
                        </div>
                        <div className="mb-2">
                          <i
                            className="far fa-question-circle me-2 font-brandBlue"
                            aria-hidden="true"
                          ></i>
                          <span className="font-regular font-primary font-gray1">{`${
                            result?.questions?.length
                          } ${
                            result?.questions?.length === 1
                              ? "Question"
                              : "Questions"
                          }`}</span>
                        </div>
                        <div className="mb-2">
                          <span className="d-flex align-items-center me-3">
                            <i className="fa fa-abacus me-2" />
                            <span className="font-regular font-primary font-gray1">{`${result?.testAssign?.details?.passScore}% Passing Score`}</span>
                          </span>{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              ) : (
                <></>
              )}

              {!feedbackSelected &&
                (question?.type === "MCQ" ? (
                  <div className="mt-3 m-3 p-3">
                    <div className="d-flex gap-3">
                      <h6>Question: {question?.queNo} </h6>
                    </div>
                    <div className="mt-3" style={{ fontSize: 18 }}>
                      {question?.question}
                    </div>
                    {question?.imageUrl && (
                      <div
                        className="col-sm-12 col-lg-6 col-md-12 mt-3"
                        style={{ maxWidth: 300 }}
                      >
                        <img width={"100%"} src={question?.imageUrl} alt="" />
                      </div>
                    )}
                    <hr />

                    <div className={!matches ? "d-flex col" : "d-flex row"}>
                      <div className={!matches ? "col-6" : "col-12"}>
                        <div className="pr-4">
                          {!question.isAnswered ? (
                            <>
                              <h6> Remark </h6>
                              <div
                                className="p-2 mb-3 col-12 rounded-2"
                                style={{
                                  backgroundColor: "#dcedff",
                                  color: "#ff5f57",
                                }} // green #40bf40
                              >
                                This question is not attempted due to automatic
                                submission of the assessment.
                              </div>
                            </>
                          ) : (
                            <>
                              <h6>Correct Answer</h6>
                              <div
                                className="p-2 mb-3 col-12 rounded-2"
                                style={{ backgroundColor: "#dcedff" }} // green #40bf40
                              >
                                {question.answer[0]}
                              </div>
                            </>
                          )}

                          <h6>Options</h6>
                          {question?.options?.map((x, index) => (
                            <div className="" key={index}>
                              <div
                                className="p-2 mb-1 col-12 rounded-2"
                                style={{
                                  backgroundColor: !x.selected
                                    ? "#f1f1f1"
                                    : "#dcedff",
                                }}
                              >
                                <div className="d-flex justify-content-between w-100">
                                  <div>{x.option}</div>
                                  <div
                                    style={{
                                      color:
                                        // "#FF5F57"
                                        "",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {x.selected &&
                                      (x.option === question.answer[0] ? (
                                        <i
                                          className="fas fa-check-circle mt-1"
                                          style={{
                                            color: "green",
                                            fontSize: 20,
                                            marginRight: 3,
                                          }}
                                        ></i>
                                      ) : (
                                        <i
                                          className="fas fa-times-circle mt-1"
                                          style={{
                                            color: "red",
                                            fontSize: 20,
                                            marginRight: 3,
                                          }}
                                        ></i>
                                      ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div
                        className={
                          !matches ? "col-6 card p-4" : "col-12 card p-4 mt-3"
                        }
                        style={{
                          textAlign: "center",
                          justifyContent: "center",
                        }}
                      >
                        <h6>
                          There is no requirement to reevaluate or review this
                          query. Kindly proceed
                        </h6>
                      </div>
                    </div>
                  </div>
                ) : question?.type === "OneWay" ? (
                  <>
                    <div className="mt-3 m-3 p-3">
                      <div className="d-flex gap-3">
                        <h6>Question: {question?.queNo} </h6>
                      </div>
                      <div className="mt-3" style={{ fontSize: 18 }}>
                        {question?.question}
                      </div>
                      {question?.imageUrl && (
                        <div
                          className="col-sm-12 col-lg-6 col-md-12 mt-3"
                          style={{ maxWidth: 300 }}
                        >
                          <img width={"100%"} src={question?.imageUrl} alt="" />
                        </div>
                      )}
                      <hr />

                      {!question.isAnswered ? (
                        <>
                          <h6> Remark </h6>
                          <div
                            className="p-2 mb-3 col-12 rounded-2 card card-flat"
                            style={{
                              backgroundColor: "#dcedff",
                              color: "#ff5f57",
                            }} // green #40bf40
                          >
                            This question is not attempted due to automatic
                            submission of the assessment.
                          </div>
                        </>
                      ) : (
                        <>
                          <h6>Response Video</h6>
                          <div
                            className={!matches ? "d-flex col" : "d-flex row"}
                          >
                            <div className={!matches ? "col-6" : "col-12"}>
                              {question?.videoUrl && (
                                <div style={{ width: 400 }}>
                                  <Vimeo
                                    onReady={(e) => setLoading(false)}
                                    onLoaded={(e) => setLoading(false)}
                                    className=""
                                    video={question?.videoUrl}
                                    responsive={true}
                                    // height={400}
                                  />
                                </div>
                              )}
                            </div>
                            <div
                              className={
                                !matches
                                  ? "col-6 card p-4"
                                  : "col-12 card p-4 mt-3"
                              }
                            >
                              <span className="font-16">
                                How many marks would you like to give for this
                                question?{" "}
                              </span>{" "}
                              <div className=" d-flex row mt-3 form-floating px-4 gap-3 py-2">
                                <div className="form-floating">
                                  <input
                                    onChange={(e) => {
                                      e.target.value?.length > 2 ||
                                      e.target.value > 10
                                        ? (e.target.value = 0)
                                        : setMarks(
                                            e.target.value.replace(
                                              /[^0-9]/g,
                                              ""
                                            )
                                          );
                                    }}
                                    value={marks}
                                    step="1"
                                    className="form-control "
                                    type="number"
                                    min="0"
                                    max="10"
                                  />
                                  <label className="ml-2">
                                    Marks (Maximum value : 10)*
                                  </label>
                                </div>
                                <div className="form-floating font-14">
                                  <textarea
                                    type="text"
                                    className="form-control "
                                    name="question"
                                    aria-describedby="emailHelp"
                                    placeholder="Type your question."
                                    value={optionalFeedback}
                                    onChange={(e) => {
                                      setOptionalFeedback(e.target.value);
                                    }}
                                  />
                                  <label className="ml-2">
                                    Any comments you want to add?
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mt-3 m-3 p-3">
                      <div className="d-flex gap-4">
                        <h6>Question: {question?.queNo} </h6>
                      </div>
                      <div className="mt-3" style={{ fontSize: 18 }}>
                        {question?.question}
                      </div>
                      {question?.imageUrl && (
                        <div
                          className="col-sm-12 col-lg-6 col-md-12 mt-3"
                          style={{ maxWidth: 300 }}
                        >
                          <img width={"100%"} src={question?.imageUrl} alt="" />
                        </div>
                      )}
                      <hr />
                      {!question.isAnswered ? (
                        <>
                          <h6> Remark </h6>
                          <div
                            className="p-2 mb-3 col-12 rounded-2 card card-flat"
                            style={{
                              backgroundColor: "#dcedff",
                              color: "#ff5f57",
                            }} // green #40bf40
                          >
                            This question is not attempted due to automatic
                            submission of the assessment.
                          </div>
                        </>
                      ) : (
                        <>
                          <h6>Response </h6>
                          <div
                            className={!matches ? "d-flex col" : "d-flex row"}
                          >
                            <div className={!matches ? "col-6" : "col-12"}>
                              <div className="p-3">
                                <p>{question?.multiLineAns}</p>
                              </div>
                            </div>
                            <div
                              className={
                                !matches
                                  ? "col-6 card p-4"
                                  : "col-12 card p-4 mt-3"
                              }
                            >
                              <span className="font-16">
                                How many marks would you like to give for this
                                question?{" "}
                              </span>{" "}
                              <div className=" d-flex row mt-3 form-floating px-4 gap-3 py-2">
                                <div className="form-floating">
                                  <input
                                    onChange={(e) => {
                                      e.target.value === ""
                                        ? setMarks("0")
                                        : e.target.value > 0 &&
                                          e.target.value <= 10 &&
                                          setMarks(
                                            e.target.value.replace(/^0+/, "")
                                          );
                                    }}
                                    value={marks}
                                    step="1"
                                    className="form-control "
                                    type="number"
                                    min="0"
                                    max="10"
                                  />

                                  <label className="ml-2">
                                    Marks (Maximum value : 10)*
                                  </label>
                                </div>
                                <div className="form-floating font-14">
                                  <textarea
                                    type="text"
                                    className="form-control "
                                    name="question"
                                    aria-describedby="emailHelp"
                                    placeholder="Type your question."
                                    value={optionalFeedback}
                                    onChange={(e) => {
                                      setOptionalFeedback(e.target.value);
                                    }}
                                  />
                                  <label className="ml-2">
                                    Any comments you want to add?
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                ))}
              {feedbackSelected && (
                <>
                  <div className="mt-3 m-3 p-3">
                    {" "}
                    <div
                      style={{ textAlign: "center" }}
                      className="card card-flat bg-gray4 mb-3 p-3"
                    >
                      <div className="d-flex justify-content-center">
                        <h6>Would you recommend this candidate?</h6>
                      </div>
                      <div className="mt-3">
                        <div
                          style={{ margin: "0 auto" }}
                          className="d-flex justify-content-around w-25"
                        >
                          <button
                            onClick={() => {
                              setRecommend(true);
                            }}
                            disabled={recommend}
                            className={"btn btn-secondary btn-lg mx-2 my-2"}
                          >
                            {recommend ? (
                              <>
                                <i
                                  style={{ color: "green", fontSize: 25 }}
                                  className="fas fa-check-circle"
                                ></i>
                                <br />
                                <small>yes</small>
                              </>
                            ) : (
                              "Yes"
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setRecommend(false);
                            }}
                            disabled={!recommend}
                            className="btn btn-lg btn-secondary  mx-2 my-2"
                          >
                            {!recommend ? (
                              <>
                                <i
                                  style={{ color: "red", fontSize: 25 }}
                                  className="fas fa-times-circle"
                                ></i>{" "}
                                <br />
                                <small>No</small>
                              </>
                            ) : (
                              "No"
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                    <hr />
                    <div className="card card-flat bg-gray4 mb-5 p-3">
                      <h6>Overall Feedback</h6>
                      <hr />
                      <div className="d-flex flex-column ">
                        <div className="form-floating font-14">
                          <textarea
                            type="text"
                            className="form-control "
                            name="question"
                            aria-describedby="emailHelp"
                            placeholder="Type your question."
                            value={finalFeedback}
                            onChange={(e) => {
                              setFinalFeedback(e.target.value);
                            }}
                          />
                          <label className="font-14">{`How did ${newResult?.candidateInfo?.firstName} do?*`}</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div
            className="d-flex border-top shadow"
            style={{ backgroundColor: "white", height: "10vh", zIndex: 5 }}
          >
            {!matches && <div className="col-3 "></div>}
            <div className={!matches ? "col-9 py-2 px-4" : "col-12 py-2 px-4"}>
              <div className="d-flex px-3 justify-content-between">
                <button
                  className="btn"
                  disabled={currentQuestionIndex <= 0}
                  onClick={() => {
                    let index = feedbackSelected
                      ? questions.length - 1
                      : currentQuestionIndex - 1;
                    setLoading(true);
                    saveReview();
                    setCurrentQuestionIndex(index);
                    handleSetMarks(index);
                    handleSetOptionalFeedback(index);
                    setQuestion(questions[index]);
                    onClickQuestion(questions[index]);
                    setTimeout(() => setLoading(false), 2000);
                  }}
                >
                  Previous
                </button>

                {!feedbackSelected &&
                  currentQuestionIndex < questions.length - 1 && (
                    <button
                      className="btn"
                      disabled={
                        currentQuestionIndex + 1 >= questions.length
                          ? currentQuestionIndex + 1 >= questions.length
                          : marks.length === 0
                      }
                      onClick={() => {
                        setLoading(true);

                        let index = currentQuestionIndex + 1;
                        saveReview();
                        setCurrentQuestionIndex(index);
                        handleSetMarks(index);
                        handleSetOptionalFeedback(index);
                        setQuestion(questions[index]);
                        onClickQuestion(questions[index]);
                        setTimeout(() => setLoading(false), 2000);
                      }}
                    >
                      Next
                    </button>
                  )}

                {(currentQuestionIndex >= questions.length - 1 ||
                  feedbackSelected) && (
                  <button
                    className={feedbackSelected ? "btn btn-primary" : "btn "}
                    disabled={
                      feedbackSelected
                        ? reviewComplete && finalFeedback?.length < 1
                        : marks.length === 0
                    }
                    onClick={(e) => {
                      feedbackSelected && handleSubmit(e);
                      !feedbackSelected && saveReview();
                      !feedbackSelected && onClickQuestion("feedback");
                    }}
                  >
                    {feedbackSelected ? "Submit" : "Next"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Review;
