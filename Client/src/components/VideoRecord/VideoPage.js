import React, { useState, useEffect, useRef } from "react";
import { ReactMediaRecorder } from "react-media-recorder";
import { toast } from "react-toastify";
import VideoTake from "./VideoTake";
import Modal from "react-bootstrap/Modal";

function VideoPage(props) {
  const [qTakes, setQTakes] = useState("");
  const [nextDisable, setNextDisable] = useState(true);
  const [countDown, setCountDown] = useState("");
  const [timer, setTimer] = useState();
  const Ref = useRef(null);
  const button = useRef(null);
  const [buttonShow, setButtonShow] = useState({
    button: "start",
    disabled: false,
  });
  const [timerCount, setTimerCount] = useState("");
  const [submitRequest, setSubmitRequest] = useState(false);

  const lastSubmit = () => {
    if (
      props?.currentQuestionIndex + 1 === props?.questions?.length &&
      props.isSaveVideo
    ) {
      props.setIsTestSubmited(true);
      props.setResultSave(true);
      setTimeout(() => {
        props.setShowConfirmation(true);
      }, 1000);
    }
  };

  useEffect(() => {
    if (buttonShow.button === "start" && timerCount === "00") {
      button.current.click();
    }
    // eslint-disable-next-line
  }, [timerCount]);

  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    return {
      total,
      seconds,
    };
  };

  const startTimer = (e) => {
    let { total, seconds } = getTimeRemaining(e);
    if (total >= 0) {
      setTimerCount(seconds > 9 ? seconds : "0" + seconds);
    }
  };

  const clearTimer = (e) => {
    setTimerCount("06");
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    Ref.current = id;
  };

  const getDeadTime = () => {
    let deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + 6);
    return deadline;
  };

  useEffect(() => {
    if (!!props?.question) {
      clearTimer(getDeadTime());
      setNextDisable(true);
      setCountDown(true);
      setTimer();
      setQTakes(props.takes);
      setButtonShow({
        button: "start",
        disabled: false,
      });
      setTimerCount("");
    }
    // eslint-disable-next-line
  }, [JSON.stringify(props.question)]);

  const delay = () => {
    setNextDisable(false);
  };

  return (
    <>
      {!!props?.question && (
        <>
          <div
            className="col-7 border-end border-3 pt-2"
            style={{
              height: "85vh",
              overflow: "auto",
              boxShadow: "inset 0px 0px 37px -4px #ebebeb",
            }}
          >
            <div>
              <div style={{ margin: "10px 10px" }}>
                <span style={{ fontSize: 20 }}>
                  Question{" "}
                  <span
                    style={{
                      fontSize: 30,
                      fontWeight: 600,
                      color: "#fe5d59",
                    }}
                  >
                    {props.currentQuestionIndex + 1}{" "}
                  </span>
                  of {props?.questionList?.length || props.questions?.length}
                </span>
              </div>
              <div
                style={{
                  backgroundColor: "#f1f1f1",
                }}
                className="p-3 d-flex"
              >
                <lottie-player
                  src="https://assets5.lottiefiles.com/packages/lf20_ShJB4F.json"
                  background="transparent"
                  speed="2"
                  style={{ width: "75px", height: "50px", marginRight: "10px" }}
                  loop
                  autoplay
                ></lottie-player>
                <h3 className="lh-base">{props?.question?.question}</h3>
              </div>

              {props?.question?.imageUrl?.length > 0 && (
                <div className="col-10 mt-2">
                  <img
                    src={props?.question?.imageUrl}
                    alt="que_image"
                    width="100%"
                  />
                </div>
              )}
            </div>
          </div>
          <div
            className="col-5"
            style={{
              height: "85vh",
              padding: "10px",
              overflow: "auto",
              boxShadow: "inset 0px 0px 37px -4px #ebebeb",
            }}
          >
            <div>
              <ReactMediaRecorder
                video={{
                  height: { exact: 480, ideal: 480 },
                  width: { exact: 640, ideal: 640 },
                  //   aspectRatio: 0.75,
                }}
                render={({
                  previewStream,
                  status,
                  startRecording,
                  stopRecording,
                  mediaBlobUrl,
                  clearBlobUrl,
                }) => {
                  return (
                    <>
                      {props.stopRecording && stopRecording()}
                      <div className="d-flex flex-column align-items-center justify-content-between">
                        <div
                          className="d-flex align-items-center justify-content-between"
                          style={{
                            borderStyle: "solid",
                            borderColor: "black",
                            borderRadius: "5px",
                            backgroundColor: "black",
                            width: "99%",
                            height: "500px",
                          }}
                        >
                          {!countDown ? (
                            <VideoTake
                              status={status}
                              url={mediaBlobUrl}
                              stream={previewStream}
                              setVideoCopy={props.setVideoCopy}
                              doNext={props.doNext}
                            />
                          ) : (
                            <p
                              className="d-flex flex-column justify-content-center align-items-center"
                              style={{ color: "white", width: "100%" }}
                            >
                              <p>Response will be recorded in</p>
                              <strong
                                className="ml-2 mt-3"
                                style={{ fontSize: "70px" }}
                              >
                                {timerCount}
                              </strong>
                            </p>
                          )}
                        </div>
                        <div
                          className="d-flex align-items-center justify-content-around"
                          style={{
                            width: "100%",
                          }}
                        >
                          <div className="col-8 card my-3">
                            <div className="ml-2 my-1">
                              <span>
                                Status:{" "}
                                <strong>
                                  {status.charAt(0).toUpperCase() +
                                    status.slice(1)}
                                </strong>
                              </span>
                            </div>
                            <div className="ml-2 my-1">
                              Maximum duration allowed to record:{" "}
                              <strong>{props?.duration} seconds</strong>
                            </div>
                          </div>
                          <div className="col-4 px-2 py-2">
                            <div className="d-flex col-10 justify-content-around align-items-center">
                              {buttonShow.button === "start" && (
                                <div
                                  ref={button}
                                  onClick={() => {
                                    clearBlobUrl();
                                    startRecording();
                                    let duration =
                                      (parseInt(props.duration) + 2) * 1000;
                                    let qTimer = setTimeout(() => {
                                      stopRecording();
                                      setButtonShow({
                                        button: "stop",
                                        disabled: true,
                                      });
                                      setTimeout(() => delay(), 5000);
                                      setCountDown(false);
                                      clearTimeout(timer);
                                      lastSubmit();
                                    }, duration);
                                    setTimer(qTimer);
                                    setButtonShow({
                                      button: "stop",
                                      disabled: false,
                                    });
                                    setTimeout(() => delay(), 5000);
                                    setCountDown(false);
                                  }}
                                ></div>
                              )}
                              {buttonShow.button === "stop" && (
                                <div
                                  onClick={() => {
                                    stopRecording();
                                    setButtonShow({
                                      button: "stop",
                                      disabled: true,
                                    });
                                    // setNextDisable(false);
                                    setTimeout(() => delay(), 5000);

                                    setCountDown(false);
                                    clearTimeout(timer);
                                  }}
                                  disabled={buttonShow.disabled}
                                ></div>
                              )}
                            </div>
                            <div className="mt-2">
                              <button
                                style={{
                                  border: "none",
                                  width: 135,
                                }}
                                onClick={() => {
                                  stopRecording();
                                  setButtonShow({
                                    button: "stop",
                                    disabled: true,
                                  });
                                  setNextDisable(true);
                                  setCountDown(false);
                                  clearTimeout(timer);
                                  lastSubmit();
                                }}
                                disabled={nextDisable}
                              >
                                Submit
                                <i className="fad fa-chevron-double-right ml-1"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Modal
                        show={submitRequest}
                        onHide={setSubmitRequest === false}
                        size=""
                      >
                        <div className="bl-modal-header">
                          <button
                            type="button"
                            data-dismiss="modal"
                            aria-label="Close"
                            onClick={() => setSubmitRequest(false)}
                            className="close p-0 bl-modal-close-btn"
                          >
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>

                        <Modal.Body>
                          <div className="bl-modal-body  text-center">
                            <p className="text-center lead mt-3">
                              Are you sure you want to submit or re-take this
                              question?
                            </p>
                            <div className="text-center my-4">
                              <button
                                className="mx-2"
                                onClick={() => {
                                  toast.info(
                                    `Number of takes left ${qTakes - 2}.`,
                                    {
                                      autoClose: 5000,
                                    }
                                  );
                                  setQTakes(qTakes - 1);
                                  setButtonShow({
                                    button: "start",
                                    disabled: false,
                                  });
                                  setNextDisable(true);
                                  setCountDown(true);
                                  clearTimer(getDeadTime());
                                  setSubmitRequest(false);
                                }}
                                disabled={qTakes === 1}
                              >
                                <i className="fas fa-undo-alt mr-2"></i>
                                Re-Take
                              </button>
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => {
                                  props.doNext();
                                  setSubmitRequest(false);
                                }}
                              >
                                Confirm submission
                              </button>
                            </div>
                          </div>
                        </Modal.Body>
                      </Modal>
                    </>
                  );
                }}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default VideoPage;
