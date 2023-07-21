import React, { useEffect, useState } from "react";
import Vimeo from "@u-wave/react-vimeo";
import logo from "../../assets/images/High5Logo.png";
import { useLocation, useParams } from "react-router";
// import axios from "../../services/axios";
import { toast } from "react-toastify";
import moment from "moment";
// import Loader from "../../components/common/Loader";
import ResultInstruction from "./ResultInstruction";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import { post } from "../../services/ApiServices";
import { findResultByCandidateIdUrl } from "../../services/ServiceUrls";

const GeneralTestResult = (props) => {
  const [result, setResult] = useState({});
  const [showSummery, setShowSummary] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState({});
  let screenWidth2 = window.innerWidth < 1270 ? true : false;
  const [isBigScreen, setIsBigScreen] = useState(screenWidth2);
  const [showSidebar, setShowSidebar] = useState(false);
  const [date, setDate] = useState("");
  const [data, setData] = useState({});
  const [score, setScore] = useState(0.0);
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState(
    window.matchMedia("(max-width: 1223px)").matches
  );
  let screenWidth = window.innerWidth < 574 ? true : false;
  const [isSmallScreen, setIsSmallScreen] = useState(screenWidth);
  const params = useParams();
  const candidateId = props.candidateId || params.candidateId;

  const temp = [];
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const res = await post(findResultByCandidateIdUrl, {
          candidateId: candidateId,
        });

        if (
          res.data?.isReviewed === false &&
          res.data?.testAssign?.testCategory !== "MCQ"
        ) {
          // return toast.error("Result is under review!");
        }
        if (!res.data?.testAssign) {
          setLoading(false);
          return toast.error("Result not found!");
        }
        setData(res.data);
        setScore(scoring(res.data));
        setDate(dateFormat(res.data?.createdAt));
        setResult(res.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log({ error: err });
      }
    };
    init();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    data?.questions?.map((x, index) => {
      const tempQue = result.testAssign?.questions?.find(
        (y) => y._id === x.questionId
      );
      temp.push({ ...x, ...tempQue, selected: false, queNo: index + 1 });
      return temp;
    });
    setQuestions(temp);
    setShowSummary(true);
    setQuestion(temp[0]);
    // eslint-disable-next-line
  }, [data]);

  useEffect(() => {
    setLoading(true);
    if (question?.type === "OneWay") {
      setTimeout(() => setLoading(false), 3000);
    } else {
      setLoading(false);
    }
  }, [question]);

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

  const onClickQuestion = (que) => {
    setQuestions((state) => {
      const temp = [...state];
      temp.map((q) => {
        return q._id === que._id ? (q.selected = true) : (q.selected = false);
      });
      return temp;
    });
  };

  const onClickSummary = () => {
    data?.questions?.map((x, index) => {
      const tempQue = result.testAssign.questions.find(
        (y) => y._id === x.questionId
      );
      temp.push({ ...x, ...tempQue, selected: false, queNo: index + 1 });
      return temp;
    });
    setQuestions(temp);
    setShowSummary(true);
  };

  const dateFormat = (createdAt) => {
    return moment(createdAt).format("MM/DD/YYYY");
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

  return (
    <>
      {loading && <Loader />}
      {instruction ? (
        <>
          <ResultInstruction
            setInstruction={setInstruction}
            loading={loading}
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
              height: "90vh",
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
                      className="fa fa-user candidate-icon mr-2 "
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
                    {result?.testAssign?.testName.split("_")[0]}
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

                <div className="overflow-auto border-top mt-4 ">
                  <div
                    className="left-panel-item border-bottom"
                    style={{
                      cursor: "pointer",
                      backgroundColor: showSummery ? "#dcedff" : "",
                    }}
                    onClick={() => {
                      setShowSummary(true);
                      onClickSummary();
                    }}
                  >
                    <div className="p-3">
                      <div className="flex-grow-1">
                        <span className="bold">Summary </span>
                      </div>
                    </div>
                  </div>

                  {questions?.map((x, index) => (
                    <div
                      key={index}
                      className="left-panel-item border-bottom"
                      style={{
                        cursor: "pointer",
                        backgroundColor: x.selected ? "#dcedff" : "",
                      }}
                      onClick={() => {
                        setQuestion(x);
                        onClickQuestion(x);
                        setShowSummary(false);
                      }}
                    >
                      <div className="p-3">
                        <div className="flex-grow-1">
                          <span className="bold">{index + 1}: </span>
                          <span>{x.question}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div
              className="col-12 col-sm-7 col-lg-8 col-xl-9 p-0 shadow p-2 mb-5 bg-body overflow-auto"
              style={{
                height: "100%",
                backgroundColor: "red",
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
                        height: "100vh",
                        zIndex: 1000,
                        backgroundColor: "#fff",
                        width: "70%",
                      }}
                    >
                      <div
                        className="p-3 border-bottom"
                        onClick={() => setShowSidebar(false)}
                        style={{ cursor: "pointer", overflow: "auto" }}
                      >
                        <i
                          className="fa fa-times"
                          style={{ fontSize: 25, fontWeight: 400 }}
                          aria-hidden="true"
                        ></i>
                      </div>

                      <div className="overflow-auto" style={{}}>
                        <div
                          className="left-panel-item border-bottom"
                          style={{
                            cursor: "pointer",
                            backgroundColor: showSummery ? "#dcedff" : "",
                          }}
                          onClick={() => {
                            setShowSummary(true);
                            onClickSummary();
                            setShowSidebar(false);
                          }}
                        >
                          <div className="p-3">
                            <div className="flex-grow-1">
                              <span className="bold">Summary </span>
                            </div>
                          </div>
                        </div>
                        {questions?.map((x, index) => (
                          <div
                            key={index}
                            className="left-panel-item border-bottom"
                            style={{
                              cursor: "pointer",
                              backgroundColor: x.selected ? "#dcedff" : "",
                            }}
                            onClick={() => {
                              setQuestion(x);
                              onClickQuestion(x);
                              setShowSidebar(false);
                              setShowSummary(false);
                            }}
                          >
                            <div className="p-3">
                              <div className="flex-grow-1">
                                <span className="bold">{index + 1}</span>
                                <span className=""> {x.question}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="py-2 px-3 d-flex justify-content-between">
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
                        {result?.testAssign?.testName.split("_")[0]}
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

                    <div
                      style={{ height: 38 }}
                      className="border p-2 rounded-2"
                      onClick={() => setShowSidebar(true)}
                    >
                      <i
                        className="fa fa-list-ul bold px-2"
                        aria-hidden="true"
                      ></i>
                    </div>
                  </div>
                </>
              )}
              {!matches ? (
                <div className="card p-0 d-flex align-items-center justify-content-between flex-row overflow-hidden m-3">
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
                        style={{ width: 90 }}
                        className={`${
                          !isBigScreen ? "d-flex me-3" : "border-end pe-2 me-2"
                        } align-items-center`}
                      >
                        <i className="far fa-clock me-2 font-brandBlue" />
                        <div className="font-regular font-primary font-gray1">
                          {result?.testAssign?.details?.duration} mins
                        </div>
                      </span>
                      <span
                        className={`${
                          !isBigScreen ? "d-flex me-3" : "border-end pe-2 me-2"
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
                          !isBigScreen ? "d-flex me-3" : "border-end pe-2 me-2"
                        } align-items-center`}
                      >
                        <i className="fa fa-abacus me-2" />
                        <div
                          className="font-regular font-primary font-gray1"
                          style={{ width: 170 }}
                        >{`${result?.testAssign?.details?.passScore}% Passing Score`}</div>
                      </span>{" "}
                      {result?.testAssign?.testCategory === "OneWay" &&
                        result?.isReviewed && (
                          <span className="d-flex align-items-center me-3">
                            {result?.isRecommended ? (
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
                            <span
                              className="font-regular font-primary font-gray1"
                              style={{
                                width: result?.isRecommended ? 100 : 130,
                              }}
                            >
                              {result?.isRecommended
                                ? "Recommended"
                                : "Not Recommended"}
                            </span>
                          </span>
                        )}
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
                                  Number(result?.testAssign?.details?.passScore)
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
              )}

              {showSummery ? (
                <div className="p-4">
                  <div className="">
                    <h6 className="text-black">
                      {result?.testAssign?.testName.split("_")[0]}
                    </h6>
                    <span className="text-black">
                      Category:{" "}
                      <span
                        className={`text-black tag    
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
                    </span>
                  </div>
                  <hr />
                  {data.testAssign?.testCategory !== "MCQ" && (
                    <div className="d-flex gap-1">
                      <h6>Feedback: </h6>
                      <div className="">{data.feedback}</div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {question?.type === "MCQ" ? (
                    <div className="mt-3 m-3 p-3 card">
                      <div className="d-flex justify-content-start">
                        <h6>Question: {question.queNo} </h6>
                      </div>
                      <div className="" style={{ fontSize: 18 }}>
                        {question.question}
                      </div>
                      <div
                        className="col-sm-12 col-lg-6 col-md-12 mt-3"
                        style={{ maxWidth: 300 }}
                      >
                        <img width={"100%"} src={question.imageUrl} alt="" />
                      </div>
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
                          <h6>Correct Answer</h6>
                          <div
                            className="p-2 mb-3 col-12 rounded-2"
                            style={{ backgroundColor: "#f1f1f1" }} // green #40bf40
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
                  ) : question?.type === "Multiline" ? (
                    <div className="mt-3 m-3 p-3 card">
                      <div className="d-flex justify-content-between">
                        <h6>Question: {question?.queNo} </h6>
                        {data.questions.map(
                          (y) =>
                            question._id === y.questionId && (
                              <h6>Marks: {y?.marks}/10 </h6>
                            )
                        )}
                      </div>
                      <div className="" style={{ fontSize: 18 }}>
                        {question.question}
                      </div>
                      <div
                        className="col-sm-12 col-lg-6 col-md-12 mt-3"
                        style={{ maxWidth: 300 }}
                      >
                        <img width={"100%"} src={question.imageUrl} alt="" />
                      </div>
                      <hr />

                      <div className="d-flex gap-3">
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
                            <div className="d-flex flex-column justify-content-start w-50">
                              <h6>Answer:</h6>
                              <div className="">{question.multiLineAns}</div>
                            </div>
                            {question.feedback && (
                              <div className="d-flex gap-2 justify-content-start w-50">
                                <h6>Feedback: </h6>
                                <div className="">{question.feedback}</div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mt-3 m-3 p-3 overflow-auto">
                        <div className="d-flex justify-content-between">
                          <h6>Question: {question?.queNo} </h6>
                          {data.questions.map(
                            (y) =>
                              question._id === y.questionId && (
                                <h6>Marks: {y?.marks}/10 </h6>
                              )
                          )}
                        </div>
                        <div className="mt-3" style={{ fontSize: 18 }}>
                          {question?.question}
                        </div>
                        <div
                          className="col-sm-12 col-lg-6 col-md-12 mt-3"
                          style={{ maxWidth: 300 }}
                        >
                          <img width={"100%"} src={question?.imageUrl} alt="" />
                        </div>
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
                          <div className="d-flex">
                            <div className="w-50">
                              <h6>Response Video</h6>
                              <div className="col-sm-12 col-lg-6 col-md-12">
                                {question?.videoUrl && (
                                  <div style={{ width: 400 }}>
                                    <Vimeo
                                      className=""
                                      responsive={true}
                                      video={question?.videoUrl}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>

                            {question.feedback && (
                              <div className="d-flex gap-2 justify-content-start w-50">
                                <h6>Feedback: </h6>
                                <div> {question.feedback}</div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default GeneralTestResult;
