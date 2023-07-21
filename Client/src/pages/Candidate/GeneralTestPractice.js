import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import VideoPage from "../../components/VideoRecord/VideoPage";
import Timer from "./Timer";
import Avatar from "react-avatar";
import Modal from "react-bootstrap/Modal";
import Footer from "./Footer";
import Loader from "../../components/loader/Loader";

const GeneralTestPractice = ({ testData, setPractiseTest }) => {
  const [question, setQuestion] = useState({});
  const [questions, setQuestions] = useState([]);
  const [questionsResData, setQuestionsResData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [video, setVideo] = useState("");
  const [queResults, setQueResults] = useState([]);
  const [candidate, setCandidate] = useState({});
  const [loading, setLoading] = useState(false);
  const [resetTimer, setResetTimer] = useState(false);
  const [isOptionSelected, setIsOptionSelected] = useState(false);
  const [optionShuffle, setOptionShuffle] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [options, setOptions] = useState([]);

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
    return array;
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
    let taquestion = que?.length > 0 ? que : questionsResData;
    setLoading(true);
    let res = {
      candidateName: `${candidate?.firstName} ${candidate?.lastName}`,
      candidateId: candidate?._id,
      testId: candidate?.testAssign?._id,
      questions: queResults,
      reviewer: { ...testData?.reviewer },
      testAssign: { ...candidate?.testAssign, questions: taquestion },
      createdBy: candidate?.createdBy,
      isReviewed: false,
      deleted: false,
    };
    submitResultOnDB(res);
  };

  const onclickNext = async (blob) => {
    if (question?.type === "OneWay") {
      setLoading(false);
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
      const updatedData = {
        ...questions[currentQuestionIndex],
        questionId: questions[currentQuestionIndex]?._id,
        type: "OneWay",
        isCorrectAnswer: false,
        isAnswered: true,
        videoUrl: "response.data.videoUrl",
      };
      setQuestionsResData([...questionsResData, updatedData]);
      setLoading(false);
      toast.success("Response saved successfully!");
      if (currentQuestionIndex + 1 === questions?.length)
        return setTimeout(
          () => submitResult([...questionsResData, updatedData]),
          2000
        );
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setQuestion(questions[currentQuestionIndex + 1]);
      setIsOptionSelected(false);
      setOptionShuffle(true);
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

  const [multilineText, setMultilineText] = useState("");

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

  const submitResultOnDB = (result) => {
    setTimeout(() => {
      setShowConfirmation(true);
    }, 2000);
    toggleFullscreen();
    setLoading(false);
  };

  const getTimerCount = (timeCount) => {
    if (timeCount === "00:05:00") {
      toast.warning("Last 5 minute to complete your assessment !!!");
    }
    if (timeCount === "00:00:01") {
      submitResult();
      toggleFullscreen();
      setResetTimer(!resetTimer);
    }
  };

  const optionShuffleFunc = (options) => {
    setOptions(options);
    setOptionShuffle(false);
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
      submitResult();
    });
    return () => {
      window.removeEventListener("blur", (event) => {
        submitResult();
      });
    };
  });

  return (
    <>
      {loading && <Loader />}

      <div
        style={{
          weidth: "100vw",
          height: "100vh",
          backgroundColor: "#ffffff",
        }}
      >
        <div className="d-flex justify-content-between align-items-center p-3">
          <div className="d-flex  align-items-center">
            {testData?.companyInfo?.companyLogo === "" ? (
              <>
                <Avatar
                  className="avatar  "
                  name={testData?.companyInfo.companyName}
                />
                <div className="mt-1 ml-2" style={{ color: "#FF5F57" }}>
                  <h5>{testData.companyInfo?.companyName} </h5>
                </div>
              </>
            ) : (
              <img src={testData?.companyInfo?.companyLogo} alt="" width={80} />
            )}
          </div>
          <div className="d-flex mt-2">
            <h5>
              Assessment name: {testData.testAssign?.testName?.split("_")[0]}{" "}
            </h5>
          </div>
          <h4>
            <span className="badge bg-dark">
              <Timer
                duration={testData?.testAssign?.details?.duration}
                submitResult={submitResult}
                toggleFullscreen={toggleFullscreen}
                resetTimer={resetTimer}
                getTimerCount={getTimerCount}
              />
            </span>
          </h4>
        </div>

        <div className="px-3">
          <strong className="mr-2">Warning:</strong>
          <span>
            During the assessment, interaction with other applications, desktops
            or screen changes outside the test window is strictly prohibited.
            Otherwise, your test will get submitted automatically.
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
          <div className="row border-top border-2" style={{ height: "85vh" }}>
            <VideoPage
              duration={
                candidate.testAssign.difficulty === "Simple"
                  ? 60
                  : candidate.testAssign.difficulty === "Medium"
                  ? 90
                  : 120
              }
              // duration={questions[currentQuestionIndex]?.duration}
              takes={questions[currentQuestionIndex]?.takes}
              doNext={onclickNext}
              setVideoCopy={setVideoCopy}
              question={questions[currentQuestionIndex]}
              currentQuestionIndex={currentQuestionIndex}
              setCurrentQuestionIndex={setCurrentQuestionIndex}
              questions={questions}
              setShowConfirmation={setShowConfirmation}
              isSaveVideo={isSaveVideo}
            />
          </div>
        ) : (
          <div className="row border-top border-2" style={{ height: "80vh" }}>
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
                  of {questions?.length}
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
                  <img src={question?.imageUrl} alt="que_image" width="100%" />
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
                              color: option.selected === true ? "#fff" : "",
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
                              color: option.selected === true ? "#fff" : "",
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

              <div style={{ float: "right" }} className="d-flex gap-3 pe-3">
                {questions.length - 1 <= currentQuestionIndex ? (
                  <button
                    className="btn btn-md py-3 px-5"
                    style={{
                      border: "none",
                    }}
                    onClick={() => {
                      submitResult();
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
                  setPractiseTest(false);
                  setShowConfirmation(false);
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
                      setPractiseTest(false);
                      setShowConfirmation(false);
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
  );
};

export default GeneralTestPractice;
