import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import TestEnd from "./TestEnd";
import Modal from "react-bootstrap/Modal";
import Footer from "./Footer";
import GeneralTestPractice from "./GeneralTestPractice";
import { generalTestData, mcqTestData, oneWayTestData } from "./mock";
import TimerHook from "./TimerHook";
import Loader from "../../components/loader/Loader";
import VideoPage from "../../components/VideoRecord/VideoPage";
import { post } from "../../services/ApiServices";
import {
  createResultUrl,
  storeVideoUrl,
  updateCandidateUrl,
  vettingDetailsUpdateStatus,
} from "../../services/ServiceUrls";

const GeneralTest = ({ testData }) => {
  const [question, setQuestion] = useState({});
  const [questions, setQuestions] = useState([]);
  const [questionsResData, setQuestionsResData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [practiseTest, setPractiseTest] = useState(false);
  const [video, setVideo] = useState("");
  const [exam, setExam] = useState(false);
  const [queResults, setQueResults] = useState([]);
  const [testEnd, setTestEnd] = useState(false);
  const [candidate, setCandidate] = useState({});
  const [loading, setLoading] = useState(false);
  const [resetTimer, setResetTimer] = useState(false);
  const [isOptionSelected, setIsOptionSelected] = useState(false);
  const [optionShuffle, setOptionShuffle] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [multilineText, setMultilineText] = useState("");
  const [options, setOptions] = useState([]);
  const [isFocuse, setIsFocuse] = useState(false);
  const [pauseTimer, setPauseTimer] = useState(false);
  const [isTestSubmited, setIsTestSubmited] = useState(false);
  const [resultSave, setResultSave] = useState(false);

  useEffect(() => {
    getData(testData);
    // eslint-disable-next-line
  }, [testData]);

  const getData = async (data) => {
    setCandidate(data);
    const questionsRes = await data?.testAssign?.questions?.map((que) => ({
      ...que,
      options: que?.options?.map((option) => ({ option, selected: false })),
    }));
    const initialResults = await questionsRes?.map((x) => {
      return {
        questionId: x?._id,
        type: x?.type,
        isAnswered: false,
        isCorrectAnswer: false,
        multiLineAns: "",
        videoUrl: "",
      };
    });

    setQueResults(initialResults);
    if (data?.testAssign?.details?.qRandom === true) {
      let rQuestions = shuffle(questionsRes);
      setQuestions(rQuestions);
      setQuestion(rQuestions[0]);
    } else {
      setQuestions(questionsRes);
      setQuestion(questionsRes[0]);
    }
  };

  const shuffle = (array) => {
    let currentIndex = array.length,
      randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    const multilineQue = [];
    const otherQue = [];
    array?.map((que) =>
      que.type === "Multiline" ? multilineQue.push(que) : otherQue.push(que)
    );
    return [...multilineQue, ...otherQue];
  };

  useEffect(() => {
    if (video.length !== 0) {
      onclickNext(video);
    }
    // eslint-disable-next-line
  }, [JSON.stringify(video)]);

  const setVideoCopy = (blob) => {
    setVideo(blob);
  };

  const onCLickOption = (option, question, clear) => {
    const isTrue = question?.answer[0] === option?.option ? true : false;
    setQuestion((state) => {
      const temp = { ...state };
      temp.options.map((opt) => {
        return opt.option === option?.option
          ? (opt.selected = true)
          : (opt.selected = false);
      });
      setQuestionsResData([...questionsResData, temp]);
      return temp;
    });
    const result = queResults?.map((x) => {
      if (x?.questionId === question?._id)
        return {
          questionId: question?._id,
          type: question?.type,
          isAnswered: true,
          isCorrectAnswer: isTrue,
        };
      return x;
    });
    setQueResults(result);
  };

  let isSaveVideo = false;

  const submitResult = (que) => {
    if (resultSave) return;

    let resp = {};

    if (question?.type === "Multiline") {
      resp = queResults.find((x) => x.questionId === question._id);
    }

    let taquestion = [];
    if (currentQuestionIndex + 1 === questions?.length)
      taquestion =
        que?.length > 0
          ? que
          : question?.type === "Multiline"
          ? [...questionsResData, { ...question, ...resp }]
          : questionsResData;
    else {
      queResults.map((x) =>
        questions.map(
          (y) => y._id === x.questionId && taquestion.push({ ...x, ...y })
        )
      );
    }

    let res = {
      candidateId: candidate?._id,
      questions: queResults,
      testAssign: { ...candidate?.testAssign, questions: taquestion },
      createdBy: candidate?.createdBy,
      deleted: false,
      candidateInfo: candidate.candidateInfo,
      companyInfo: candidate.companyInfo,
      reviewer: candidate.reviewer,
      isReviewed: false,
      testStatus:
        candidate?.testAssign?.testCategory === "MCQ"
          ? "completed"
          : "underReview",
    };
    submitResultOnDB(res);
  };

  const onclickNext = async (blob) => {
    if (resultSave) return;
    if (question?.type === "OneWay") {
      setLoading(false);
      setPauseTimer(true);
      const videoData = await fetch(blob).then((r) => r.blob());
      const videoFile = new File([videoData], "videos.mp4", {
        type: videoData?.type,
      });
      const formData = new FormData();
      formData.append("questionId", questions[currentQuestionIndex]?._id);
      formData.append("videos", videoFile);
      formData.append("candidateId", testData?._id);
      formData.append("testId", testData?.testAssign?._id);
      setTimeout(() => {}, 3000);
      setLoading(true);
      await post(storeVideoUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          let percent = Math.floor((loaded * 100) / total);
          console.log(
            `[PreviewVideo.js] Percent uploaded ${loaded}kb of ${total}kb | ${percent}%`
          );
        },
      })
        .then((response) => {
          const updatedData = {
            ...questions[currentQuestionIndex],
            questionId: questions[currentQuestionIndex]?._id,
            type: "OneWay",
            isCorrectAnswer: false,
            isAnswered: true,
            videoUrl: response.data.videoUrl,
          };
          setQuestionsResData([...questionsResData, updatedData]);
          const result = queResults?.map((x) => {
            if (x.questionId === questions[currentQuestionIndex]?._id)
              return {
                questionId: questions[currentQuestionIndex]?._id,
                type: "OneWay",
                isCorrectAnswer: false,
                isAnswered: true,
                videoUrl: response.data.videoUrl,
              };
            return x;
          });
          setQueResults(result);
          setLoading(false);
          setPauseTimer(false);
          toast.success("Response saved successfully!");
          if (currentQuestionIndex + 1 === questions?.length)
            return setTimeout(() => {
              submitResult([...questionsResData, updatedData]);
            }, 2000);
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setQuestion(questions[currentQuestionIndex + 1]);
          setIsOptionSelected(false);
          setOptionShuffle(true);
        })
        .catch((error) => {
          console.log(error, "error");
          toast.error(error.message);
          setLoading(false);
        });
    } else if (question?.type === "Multiline") {
      const temp = {
        ...question,
        questionId: question._id,
        isAnswered: true,
        isCorrectAnswer: false,
        multiLineAns: multilineText,
      };
      setQuestionsResData([...questionsResData, temp]);
      setLoading(false);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setQuestion(questions[currentQuestionIndex + 1]);
      setIsOptionSelected(false);
      setOptionShuffle(true);
    } else {
      setLoading(false);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setQuestion(questions[currentQuestionIndex + 1]);
      setIsOptionSelected(false);
      setOptionShuffle(true);
    }
  };

  const onChangeTextArea = (text, question) => {
    setMultilineText(text);
    const result = queResults?.map((x) => {
      if (x.questionId === question?._id)
        return {
          questionId: question._id,
          type: question?.type,
          isAnswered: true,
          isCorrectAnswer: false,
          multiLineAns: text,
        };
      return x;
    });
    setQueResults(result);
    setIsOptionSelected(true);
  };

  const submitResultOnDB = async (result) => {
    setLoading(true);
    setResultSave(true);
    try {
      await post(createResultUrl, result);
      await post(updateCandidateUrl, {
        candidateId: candidate?._id,
        testStatus:
          candidate?.testAssign?.testCategory === "MCQ"
            ? "completed"
            : "underReview",
      });

      if (candidate.createdFrom === "High5hire") {
        let obj = {
          data: result,
          uniqueCode: candidate.uniqueCode,
          testStatus:
            candidate?.testAssign?.testCategory === "MCQ"
              ? "completed"
              : "underReview",
        };

        await post(vettingDetailsUpdateStatus, obj);
      }

      setLoading(false);
      setTimeout(() => setShowConfirmation(true), 1000);
      toggleFullscreen();
    } catch (err) {
      setLoading(false);
      setShowConfirmation(true);
      console.log(err);
    }
  };

  const getTimerCount = (timeCount) => {
    if (timeCount === "00:05:00") {
      toast.warning("Last 5 minute to complete your assessment !!!");
    }
    if (timeCount === "00:00:01") {
      submitResult();
      toggleFullscreen();
      setResetTimer(!resetTimer);
      // setTestEnd(false);
    }
  };

  const optionShuffleFunc = (options) => {
    setOptions(options);
    setOptionShuffle(false);
  };

  const goFS = () => {
    toggleFullscreen();
    setResetTimer(!resetTimer);
  };

  const toggleFullscreen = (event) => {
    let element = document.body;
    if (event instanceof HTMLElement) element = event;
    var isFullscreen =
      document.webkitIsFullScreen || document.mozFullScreen || false;

    element.requestFullScreen =
      element.requestFullScreen ||
      element.webkitRequestFullScreen ||
      element.mozRequestFullScreen ||
      function () {
        return false;
      };

    document.cancelFullScreen =
      document.cancelFullScreen ||
      document.webkitCancelFullScreen ||
      document.mozCancelFullScreen ||
      function () {
        return false;
      };

    isFullscreen ? document.cancelFullScreen() : element.requestFullScreen();
  };

  useEffect(() => {
    window.addEventListener("blur", (event) => {
      if (
        candidate?.testAssign?.testCategory !== "Oneway" ||
        question.type !== "Oneway"
      ) {
        if (exam && !resultSave && !showConfirmation) {
          setShowConfirmation(true);
          setIsFocuse(true);
        }
      } else {
        if (exam && !resultSave && !showConfirmation) {
          setShowConfirmation(true);
          setIsFocuse(true);
        }
      }
    });
    // eslint-disable-next-line
  });

  const time = new Date();
  time.setSeconds(
    time.getSeconds() + Number(testData?.testAssign?.details?.duration) * 60
  ); // in minutes timer

  return (
    <>
      {loading && <Loader />}
      {testEnd ? (
        <TestEnd
          companyLogo={testData?.companyInfo?.companyLogo}
          companyName={testData?.companyInfo?.companyName}
          rejected={isFocuse}
          isTestSubmited={isTestSubmited}
        />
      ) : (
        <>
          {!exam ? (
            practiseTest ? (
              <GeneralTestPractice
                setPractiseTest={setPractiseTest}
                testData={
                  testData.testAssign.testCategory === "MCQ"
                    ? mcqTestData
                    : testData.testAssign.testCategory === "OneWay"
                    ? oneWayTestData
                    : generalTestData
                }
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <div
                  className="d-flex justify-content-between align-items-center p-3 col-12"
                  style={{
                    borderBottom: "3px solid #fe5d59",
                    height: 90,
                  }}
                >
                  <div></div>
                  <div className="d-flex mt-2 p-4">
                    {testData?.testAssign?.testCategory === "MCQ" ? (
                      <h5>MCQ Assessment Instruction</h5>
                    ) : testData?.testAssign?.testCategory === "OneWay" ? (
                      <h5>OneWay Assessment Instruction </h5>
                    ) : (
                      <h5>General Assessment Instruction</h5>
                    )}
                  </div>
                  <div></div>
                </div>

                {testData?.testAssign?.testCategory === "MCQ" ? (
                  <div className="col-md-8 mt-5 ">
                    <p>
                      The assessment will comprise of{" "}
                      <strong> Multiple Choice Questions </strong>
                      (MCQs). There will be a timer which will begin along with
                      the assessment (Prime timer for the test at top-right
                      corner). You will have only one take to attempt the
                      assessment. The other details related to the assessment
                      are mentioned below.
                    </p>
                    <ul>
                      <li className="d-flex">
                        <div>
                          <i
                            className="fa fa-circle mr-2"
                            style={{ fontSize: 10 }}
                            aria-hidden="true"
                          ></i>
                        </div>
                        <div>
                          The candidate needs to select the right option from
                          the multiple choices given with each question.
                        </div>
                      </li>
                      <li className="d-flex">
                        <div>
                          <i
                            className="fa fa-circle mr-2"
                            style={{ fontSize: 10 }}
                            aria-hidden="true"
                          ></i>
                        </div>
                        <div>
                          Each question has multiple (2 or more) options, and
                          the candidate has to select the correct option.
                        </div>
                      </li>
                      <li className="d-flex">
                        <div>
                          <i
                            className="fa fa-circle mr-2"
                            style={{ fontSize: 10 }}
                            aria-hidden="true"
                          ></i>
                        </div>
                        <div>
                          If the test is not submitted due to any
                          hardware/software/internet failure at candidate end,
                          then the result will not be processed and you will be
                          marked absent.
                        </div>
                      </li>
                      <li className="d-flex">
                        <div>
                          <i
                            className="fa fa-circle mr-2"
                            style={{ fontSize: 10 }}
                            aria-hidden="true"
                          ></i>
                        </div>
                        <div>
                          Please make sure you make the final submission only
                          after completing the assessment.
                        </div>
                      </li>
                      <li className="d-flex">
                        <div>
                          <i
                            className="fa fa-circle mr-2"
                            style={{ fontSize: 10 }}
                            aria-hidden="true"
                          ></i>
                        </div>
                        <div>
                          Once the final submission is done, you will not be
                          able to take up the assessment again.
                        </div>
                      </li>
                    </ul>
                    <div className="mt-4">
                      <h6>Warning</h6>
                      <ul>
                        <li>
                          During the assessment, interaction with other
                          applications, desktops or screen changes outside the
                          test window is strictly prohibited. Otherwise, your
                          test will get submitted automatically.
                        </li>
                        <li>
                          We recommend that you remain in the test window until
                          after you submit your test.
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : testData?.testAssign?.testCategory === "OneWay" ? (
                  <div className="col-md-8 mt-5 p-4">
                    <p>
                      This assessment will comprise of{" "}
                      <strong> OneWay Type Questions </strong> (1-way video).
                      You have only 1 take to attempt each question. Use the
                      re-takes appropriately if retake option is allowed and the
                      number of takes will be displayed on the question screen.
                      There will be a <strong> timer </strong> which will begin
                      after the test has started (Prime timer for the test at
                      top-right corner). For each question, there will be
                      allowable time to submit the response and will be
                      displayed below the recording screen after the test has
                      started. The recording will stop automatically after{" "}
                      <strong> Maximum time limit </strong> has reached.
                      Candidate can either submit the response or re-take the
                      response (if option is available). The other details
                      related to the assessment are mentioned below.
                    </p>
                    <ul>
                      <li className="d-flex">
                        <div>
                          <i
                            className="fa fa-circle mr-2"
                            style={{ fontSize: 10 }}
                            aria-hidden="true"
                          ></i>
                        </div>
                        <div>
                          Candidate needs to attempt each question to proceed to
                          the next question. Candidate cannot go back to the
                          previous question.
                        </div>
                      </li>
                      <li className="d-flex">
                        <div>
                          <i
                            className="fa fa-circle mr-2"
                            style={{ fontSize: 10 }}
                            aria-hidden="true"
                          ></i>
                        </div>
                        <div>
                          If the test is not submitted due to any
                          hardware/software/internet failure at candidate end,
                          then the result will not be processed, and you will be
                          marked absent.
                        </div>
                      </li>
                      <li className="d-flex">
                        <div>
                          <i
                            className="fa fa-circle mr-2"
                            style={{ fontSize: 10 }}
                            aria-hidden="true"
                          ></i>
                        </div>
                        <div>
                          Please make sure you make the final submission only
                          after completing the assessment.
                        </div>
                      </li>
                      <li className="d-flex">
                        <div>
                          <i
                            className="fa fa-circle mr-2"
                            style={{ fontSize: 10 }}
                            aria-hidden="true"
                          ></i>
                        </div>
                        <div>
                          Once the final submission is done, you will not be
                          able to take up the assessment again.
                        </div>
                      </li>
                    </ul>
                    <div className="mt-4">
                      <h6>Warning</h6>
                      <ul>
                        <li>
                          During the assessment, interaction with other
                          applications, desktops or screen changes outside the
                          test window is strictly prohibited. Otherwise, your
                          test will get submitted automatically.
                        </li>
                        <li>
                          We recommend that you remain in the test window until
                          after you submit your test.
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="col-md-8 mt-5 ">
                    <p>
                      This assessment will comprise of{" "}
                      <strong> All Type Questions: </strong>
                      MCQ, OneWay and Multiline. There will be a{" "}
                      <strong>timer</strong> which will begin along with the
                      assessment (Prime timer for the test at top-right corner).
                      You will have only <strong>one take </strong> to attempt
                      the assessment. The other details related to the
                      assessment are mentioned below.
                    </p>

                    <ul>
                      <li className="d-flex">
                        <div>
                          <i
                            className="fa fa-circle mr-2"
                            style={{ fontSize: 10 }}
                            aria-hidden="true"
                          ></i>
                        </div>
                        <div>
                          Candidate needs to attempt each question to proceed to
                          the next question.
                        </div>
                      </li>
                      <li className="d-flex">
                        <div>
                          <i
                            className="fa fa-circle mr-2"
                            style={{ fontSize: 10 }}
                            aria-hidden="true"
                          ></i>
                        </div>
                        <div>
                          Candidate cannot go back to the previous question.
                        </div>
                      </li>
                      <li className="d-flex">
                        <div>
                          <i
                            className="fa fa-circle mr-2"
                            style={{ fontSize: 10 }}
                            aria-hidden="true"
                          ></i>
                        </div>
                        <div>
                          If the test is not submitted due to any
                          hardware/software/internet failure at candidate end,
                          then the result will not be processed, and you will be
                          marked absent.
                        </div>
                      </li>
                      <li className="d-flex">
                        <div>
                          <i
                            className="fa fa-circle mr-2"
                            style={{ fontSize: 10 }}
                            aria-hidden="true"
                          ></i>
                        </div>
                        <div>
                          Once the final submission is done, you will not be
                          able to take up the assessment again.
                        </div>
                      </li>
                    </ul>

                    <strong>For MCQ Question</strong>
                    <p>
                      The candidate needs to select the right option from the
                      multiple choices given with each question. Each question
                      has multiple (2 or more) options, and the candidate has to
                      select the correct option.{" "}
                    </p>

                    <strong>For OneWay Question</strong>
                    <p>
                      For each question, there will be allowable time to submit
                      the response and will be displayed below the recording
                      screen after the test has started. The recording will stop
                      automatically after <strong>maximum time limit</strong>{" "}
                      has reached. Candidate can either submit the response or
                      re-take the response (if option is available).
                    </p>

                    <strong>For Multiline Question</strong>
                    <p>
                      Candidate needs to write the descriptive answer in the
                      text box.
                    </p>

                    <div className="mt-4">
                      <h6>Warning</h6>
                      <ul>
                        <li>
                          During the assessment, interaction with other
                          applications, desktops or screen changes outside the
                          test window is strictly prohibited. Otherwise, your
                          test will get submitted automatically.
                        </li>
                        <li>
                          We recommend that you remain in the test window until
                          after you submit your test.
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
                <hr />
                <div className="d-flex justify-content-end mb-5">
                  <button
                    className="btn btn-sm"
                    style={{ backgroundColor: "syan" }}
                    onClick={() => {
                      setExam(true);
                      goFS();
                    }}
                  >
                    Start Assessment
                  </button>
                  <button
                    className="btn btn-sm btn-secondary ml-4"
                    onClick={() => {
                      setPractiseTest(true);
                      goFS();
                    }}
                  >
                    Practice Assessment
                  </button>
                </div>
                <Footer />
              </div>
            )
          ) : (
            <div
              style={{
                weidth: "100vw",
                height: "100vh",
                backgroundColor: "#ffffff",
              }}
            >
              <div className="d-flex justify-content-between align-items-center p-3">
                <div className="d-flex  align-items-center"></div>
                <div className="d-flex mt-2">
                  <h5>
                    Assessment name:{" "}
                    {testData.testAssign?.testName?.split("_")[0]}{" "}
                  </h5>
                </div>
                <h4>
                  <span className="badge bg-dark">
                    <TimerHook
                      duration={testData?.testAssign?.details?.duration}
                      expiryTimestamp={time}
                      submitResult={submitResult}
                      toggleFullscreen={toggleFullscreen}
                      pauseTimer={pauseTimer}
                      resetTimer={resetTimer}
                      getTimerCount={getTimerCount}
                      setShowConfirmation={setShowConfirmation}
                    />
                  </span>
                </h4>
              </div>

              <div className="px-3">
                <strong className="mr-2">Warning:</strong>
                <span>
                  During the assessment, interaction with other applications,
                  desktops or screen changes outside the test window is strictly
                  prohibited. Otherwise, your test will get submitted
                  automatically.
                </span>
              </div>

              <div
                style={{
                  backgroundColor: "#fe5d59",
                  minHeight: "3px",
                  maxHeight: "3px",
                  padding: 0,
                  margin: 0,
                }}
              ></div>

              {question?.type === "OneWay" ? (
                <div
                  className="row border-top border-2"
                  style={{ height: "85vh" }}
                >
                  <VideoPage
                    duration={
                      candidate.testAssign.difficulty === "Simple"
                        ? 60
                        : candidate.testAssign.difficulty === "Medium"
                        ? 90
                        : 120
                    }
                    takes={questions[currentQuestionIndex]?.takes}
                    doNext={onclickNext}
                    setVideoCopy={setVideoCopy}
                    question={questions[currentQuestionIndex]}
                    currentQuestionIndex={currentQuestionIndex}
                    setCurrentQuestionIndex={setCurrentQuestionIndex}
                    questions={questions}
                    setShowConfirmation={setShowConfirmation}
                    isSaveVideo={isSaveVideo}
                    stopRecording={showConfirmation}
                    setIsTestSubmited={setIsTestSubmited}
                    setResultSave={setResultSave}
                  />
                </div>
              ) : (
                <div
                  className="row border-top border-2"
                  style={{ height: "80vh" }}
                >
                  <div
                    className="col-6 border-end border-3 pt-2"
                    style={{
                      height: "79vh",
                      overflow: "auto",
                      boxShadow: "inset 0px 0px 37px -4px #ebebeb",
                    }}
                  >
                    <div className="ml-3" style={{ margin: "auto 0" }}>
                      <h5 style={{ fontSize: 20 }}>
                        Question
                        <span
                          className="mx-1"
                          style={{
                            fontSize: 30,
                            fontWeight: 600,
                            color: "#fe5d59",
                          }}
                        >
                          {currentQuestionIndex + 1}
                        </span>
                        of {questions.length}
                      </h5>
                    </div>
                    <div
                      style={{
                        backgroundColor: "#f1f1f1",
                      }}
                      className="p-3 d-flex"
                    >
                      <i className="fad fa-hand-point-right my-1 mr-3 fa-lg"></i>
                      <span style={{ fontSize: 24, lineHeight: 1.4 }}>
                        {questions[currentQuestionIndex]?.question}
                      </span>
                    </div>
                    {question?.imageUrl && (
                      <div className="col-10 mt-2">
                        <img
                          src={question?.imageUrl}
                          alt="que_image"
                          width="100%"
                        />
                      </div>
                    )}
                  </div>
                  <div
                    className="col-6"
                    style={{
                      height: "79vh",
                      overflow: "auto",
                      boxShadow: "inset 0px 0px 37px -4px #ebebeb",
                    }}
                  >
                    {question.type === "MCQ" ? (
                      <div className="col-12 mt-4 pr-3">
                        <div className="mb-2 border-2 mb-3">
                          <h5> Select Option </h5>
                        </div>
                        <ul>
                          {testData?.testAssign?.details?.oRandom === true &&
                            optionShuffle &&
                            optionShuffleFunc(shuffle(question?.options))}
                          {testData?.testAssign?.details?.oRandom === true
                            ? options?.map((option, i) => (
                                <li
                                  key={i}
                                  role="button"
                                  className="p-3 rounded mb-2 d-flex"
                                  onClick={() => {
                                    onCLickOption(option, question);
                                    setIsOptionSelected(true);
                                  }}
                                  style={{
                                    fontSize: 17,
                                    backgroundColor:
                                      option.selected === true
                                        ? "#02004a"
                                        : "#f1f1f1",
                                    color:
                                      option.selected === true ? "#fff" : "",
                                  }}
                                >
                                  <div className="d-flex">
                                    <div>
                                      {option.selected === true ? (
                                        <i className="fas fa-check mr-2"></i>
                                      ) : (
                                        <i className="fas fa-circle mr-2"></i>
                                      )}
                                    </div>
                                    {option?.option}
                                  </div>
                                </li>
                              ))
                            : question?.options?.map((option, i) => (
                                <li
                                  key={i}
                                  role="button"
                                  className="p-3 rounded mb-2 d-flex"
                                  onClick={() => {
                                    onCLickOption(option, question);
                                    setIsOptionSelected(true);
                                  }}
                                  style={{
                                    fontSize: 17,
                                    backgroundColor:
                                      option.selected === true
                                        ? "#02004a"
                                        : "#f1f1f1",
                                    color:
                                      option.selected === true ? "#fff" : "",
                                  }}
                                >
                                  <div className="d-flex">
                                    <div>
                                      {option.selected === true ? (
                                        <i className="fas fa-check mr-2"></i>
                                      ) : (
                                        <i className="fas fa-circle mr-2"></i>
                                      )}
                                    </div>
                                    {option?.option}
                                  </div>
                                </li>
                              ))}
                        </ul>
                      </div>
                    ) : (
                      <>
                        <div className="col-12 mt-4 pr-3">
                          <div className="mb-2 border-2 mb-3">
                            <h5> Write Answer in Textarea </h5>
                          </div>
                          <div className="mb-3">
                            <textarea
                              name=""
                              id=""
                              cols="30"
                              rows="10"
                              value={multilineText}
                              onChange={(e) =>
                                onChangeTextArea(e.target.value, question)
                              }
                              placeholder="Here you can start..."
                            ></textarea>
                          </div>
                        </div>
                      </>
                    )}

                    <div
                      style={{ float: "right" }}
                      className="d-flex gap-3 pe-3"
                    >
                      {questions.length - 1 <= currentQuestionIndex ? (
                        <button
                          className="btn btn-md py-3 px-5"
                          style={{
                            border: "none",
                          }}
                          onClick={() => {
                            submitResult();
                            setIsTestSubmited(true);
                          }}
                          disabled={isOptionSelected ? false : true}
                        >
                          Submit
                        </button>
                      ) : (
                        <button
                          className="btn btn-md py-3 px-5"
                          style={{ border: "none" }}
                          onClick={() => {
                            onclickNext();
                            setMultilineText("");
                          }}
                          disabled={isOptionSelected ? false : true}
                        >
                          Next
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Powered by High5 Start */}
              <Footer />
              {/* Powered by High5 ENd */}
            </div>
          )}
          {showConfirmation && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                backgroundColor: "#fff",
              }}
            >
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
                    onClick={() => {
                      setShowConfirmation(false);
                      setTestEnd(true);
                    }}
                    className="close p-0 bl-modal-close-btn"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>

                <Modal.Body>
                  <div className="bl-modal-body  text-center">
                    <div className="avatar avatar-lg avatar-green1 mr-3">
                      <i className="fas fa-check fa-fw"></i>
                    </div>
                    <p className="text-center lead mt-3">
                      Your assessment has been submitted.
                    </p>
                    <div className="text-center my-4">
                      <button
                        type="button"
                        className="btn btn-secondary mr-3"
                        data-dismiss="modal"
                        onClick={() => {
                          setShowConfirmation(false);
                          setTestEnd(true);
                          if (isFocuse) submitResult();
                        }}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </Modal.Body>
              </Modal>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default GeneralTest;
