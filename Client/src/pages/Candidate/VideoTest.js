import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import VideoPage from "../../components/VideoRecord/VideoPage";
import TestEnd from "./TestEnd";
import logo from "../../assets/images/High5Logo.png";
import VideoPractise from "./GeneralTestPractice";
import TimerHook from "./TimerHook";
import {
  createResultUrl,
  storeVideoUrl,
  updateCandidateUrl,
  vettingDetailsUpdateStatus,
} from "../../services/ServiceUrls";
import { post } from "../../services/ApiServices";
import Loader from "../../components/loader/Loader";

const VideoTest = (props) => {
  const questionList = props?.testData.testAssign.questions;
  const [questionAnswerList, setQuestionAnswerList] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [video, setVideo] = useState("");
  const [resultSubmitted, setResultSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [practice, setPractice] = useState(false);
  const [testEnd, setTestEnd] = useState(false);
  const [exam, setExam] = useState(false);
  const [resetTimer, setResetTimer] = useState(false);
  const [pauseTimer, setPauseTimer] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isFocuse, setIsFocuse] = useState(false);
  const [isTestSubmited, setIsTestSubmited] = useState(false);

  useEffect(() => {
    if (questionAnswerList.length === questionList.length && !isFocuse) {
      confirmSubmitResult();
      setResetTimer(!resetTimer);
      setIsTestSubmited(true);
    }
    // eslint-disable-next-line
  }, [questionAnswerList]);

  const confirmSubmitResult = () => {
    setShowConfirmation(true);
    onSubmitResult();
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

  const time = new Date();
  time.setSeconds(
    time.getSeconds() +
      Number(props?.testData?.testAssign?.details?.duration) * 60
  ); // in minutes timer

  const onclickNext = async (blob) => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    if (isFocuse) return;
    setLoading(true);
    setPauseTimer(true);
    const videoData = await fetch(blob).then((r) => r.blob());
    const videoFile = new File([videoData], "videos.mp4", {
      type: videoData.type,
    });
    const formData = new FormData();
    formData.append("questionId", questionList[currentQuestionIndex]?._id);
    formData.append("videos", videoFile);
    formData.append("candidateId", props?.testData?._id);
    formData.append("testId", props?.testData?.testAssign?._id);
    setTimeout(() => {}, 3000);
    setPauseTimer(true);
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
          questionId: questionList[currentQuestionIndex]._id,
          type: "OneWay",
          isCorrectAnswer: false,
          isAnswered: true,
          videoUrl: response.data.videoUrl,
        };
        const _questionAnswerList = [...questionAnswerList, updatedData];
        setQuestionAnswerList(_questionAnswerList);
        setLoading(false);
        setPauseTimer(false);
        // toast.success("Response saved successfully!");
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      })
      .catch((error) => {
        console.log(error, "error");
        setPauseTimer(false);
        toast.error(error.message);
        setLoading(false);
      });
  };

  let isSaveVideo = false;

  const onSubmitResult = async () => {
    if (resultSubmitted === true) return;
    const resQue = [];
    props?.testData.testAssign.questions.map((x) => {
      const respTemp = questionAnswerList.find((y) => y.questionId === x._id);
      respTemp
        ? resQue.push(respTemp)
        : resQue.push({
            isAnswered: false,
            isCorrectAnswer: false,
            questionId: x._id,
            type: "OneWay",
            videoUrl: "",
          });
      return resQue;
    });
    const _result = {
      candidateName: `${props?.testData?.firstName} ${props?.testData?.lastName}`,
      candidateId: props?.testData?._id,
      questions: resQue,
      testAssign: props?.testData.testAssign,
      deleted: false,
      isReviewed: false,
      createdBy: { ...props?.testData?.createdBy },
      reviewer: { ...props?.testData?.reviewer },
      testRejected: isFocuse,
    };

    setLoading(true);
    try {
      await post(createResultUrl, _result);
      setIsTestSubmited(true);
      await post(updateCandidateUrl, {
        candidateId: props.testData._id,
        testStatus:
          props.testData?.testAssign?.testCategory === "MCQ"
            ? "completed"
            : "underReview",
      });

      if (props.testData.createdFrom === "High5hire") {
        let obj = {
          data: _result,
          uniqueCode: props.testData.uniqueCode,
          testStatus:
            props.testData?.testAssign?.testCategory === "MCQ"
              ? "completed"
              : "underReview",
        };

        await post(vettingDetailsUpdateStatus, obj);
      }
      setResultSubmitted(true);
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
      toast("Last 5 minute to complete your assessment !!!");
    }
    if (timeCount === "00:00:01") {
      onSubmitResult();
      // toggleFullscreen();
      setShowConfirmation(true);
      setResetTimer(!resetTimer);
      // setTestEnd(false);
    }
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
      if (exam) {
        setShowConfirmation(true);
        setIsFocuse(true);
      }
    });
    // eslint-disable-next-line
  });

  return (
    <>
      {loading && <Loader />}
      {testEnd ? (
        <TestEnd
          companyLogo={props?.testData?.companyInfo?.companyLogo}
          companyName={props?.testData?.companyInfo?.companyName}
          rejected={isFocuse}
          isTestSubmited={isTestSubmited}
        />
      ) : (
        <>
          {!exam ? (
            !practice ? (
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
                  {/* <div className="d-flex  align-items-center">
                    {props?.testData?.companyInfo?.companyLogo === "" ? (
                      <>
                        <Avatar
                          className="avatar "
                          name={props?.testData?.companyInfo.companyName}
                          // round="80px"
                          size="50px"
                          title="sdffsff"
                        />
                        <div className="mt-1 ml-2" style={{ color: "#FF5F57" }}>
                          <h5>{props?.testData.companyInfo?.companyName} </h5>
                        </div>
                      </>
                    ) : (
                      <img
                        src={props?.testData?.companyInfo?.companyLogo}
                        alt=""
                        width={80}
                      />
                    )}
                  </div> */}

                  <div></div>

                  <div className="d-flex mt-2">
                    <h5>OneWay Assessment Instruction </h5>
                  </div>

                  <div></div>
                </div>

                <div className="col-md-8 mt-5 p-4">
                  {/* <OneWayTestInfo /> */}
                  <p>
                    This assessment will comprise of{" "}
                    <strong> OneWay Type Questions </strong> (1-way video). You
                    have only 1 take to attempt each question. Use the re-takes
                    appropriately if retake option is allowed and the number of
                    takes will be displayed on the question screen. There will
                    be a <strong> timer </strong> which will begin after the
                    test has started (Prime timer for the test at top-right
                    corner). For each question, there will be allowable time to
                    submit the response and will be displayed below the
                    recording screen after the test has started. The recording
                    will stop automatically after{" "}
                    <strong> Maximum time limit </strong> has reached. Candidate
                    can either submit the response or re-take the response (if
                    option is available). The other details related to the
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
                        Once the final submission is done, you will not be able
                        to take up the assessment again.
                      </div>
                    </li>
                  </ul>
                  <div className="mt-4">
                    <h6>Warning</h6>
                    <ul>
                      <li>
                        During the assessment, interaction with other
                        applications, desktops or screen changes outside the
                        test window is strictly prohibited. Otherwise, your test
                        will get submitted automatically.
                      </li>
                      <li>
                        We recommend that you remain in the test window until
                        after you submit your test.
                      </li>
                    </ul>
                  </div>
                </div>
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
                    // style={{ backgroundColor: "syan" }}
                    onClick={() => {
                      setPractice(true);
                      // goFS();
                    }}
                  >
                    Practice Assessment
                  </button>
                </div>
                <div
                  className="d-flex"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    width: "100vw",
                  }}
                >
                  <div className="w-75"></div>
                  <div className="w-25">
                    <span style={{ float: "right" }}>
                      <span style={{ fontWeight: 600 }} className="text-muted ">
                        Powered by
                      </span>
                      <img
                        className=" mb-3 p-1"
                        style={{ height: 33 }}
                        src={logo}
                        alt="high5logo"
                      />
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <VideoPractise
                setPractiseTest={setPractice}
                data={props.testData}
              />
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
                <div className="d-flex  align-items-center">
                  {/* {props?.testData?.companyInfo?.companyLogo === "" ? (
                    <>
                      <Avatar
                        className="avatar  "
                        name={props?.testData?.companyInfo.companyName}
                      />
                      <div className="mt-1 ml-2" style={{ color: "#FF5F57" }}>
                        <h5>{props?.testData.companyInfo?.companyName} </h5>
                      </div>
                    </>
                  ) : (
                    <img
                      src={props?.testData?.companyInfo?.companyLogo}
                      alt=""
                      width={80}
                    />
                  )} */}
                </div>
                <div className=" mt-2">
                  <h5>
                    Assessment name:{" "}
                    {props?.testData.testAssign?.testName?.split("_")[0]}{" "}
                  </h5>
                </div>
                <h4>
                  <span className="badge bg-dark">
                    <TimerHook
                      duration={props?.testData?.testAssign?.details?.duration}
                      expiryTimestamp={time}
                      submitResult={onSubmitResult}
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

              <div
                className="row border-top border-2"
                style={{ height: "85vh", marginBottom: 200 }}
              >
                <VideoPage
                  duration={
                    props.testData.testAssign.difficulty === "Simple"
                      ? 60
                      : props.testData.testAssign.difficulty === "Medium"
                      ? 90
                      : 120
                  }
                  takes={questionList[currentQuestionIndex]?.takes}
                  doNext={onclickNext}
                  setVideoCopy={setVideoCopy}
                  question={questionList[currentQuestionIndex]}
                  currentQuestionIndex={currentQuestionIndex}
                  setCurrentQuestionIndex={setCurrentQuestionIndex}
                  questions={questionList}
                  setShowConfirmation={setShowConfirmation}
                  isSaveVideo={isSaveVideo}
                  stopRecording={showConfirmation}
                  setIsTestSubmited={setIsTestSubmited}
                />
              </div>

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
                          toggleFullscreen();
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
                              toggleFullscreen();
                              if (isFocuse) onSubmitResult();
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

              <div
                className="d-flex align-items-baseline justify-content-end "
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                }}
              >
                <div className="">
                  <span style={{ float: "right" }}>
                    <span style={{ fontWeight: 600 }} className="text-muted ">
                      Powered by
                    </span>
                    <img
                      className=" mb-3 p-1"
                      style={{ height: 33 }}
                      src={logo}
                      alt="high5logo"
                    />
                  </span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default VideoTest;
