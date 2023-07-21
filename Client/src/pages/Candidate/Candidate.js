import React, { useState } from "react";
import { toast } from "react-toastify";
import moment from "moment";
import GeneralTest from "./GeneralTest";
import { ReactMediaRecorder } from "react-media-recorder";
import Loader from "../../components/loader/Loader";
import { post } from "../../services/ApiServices";
import { findCandidateByUniqueIdUrl } from "../../services/ServiceUrls";
import logo from "../../assets/images/High5Logo.png";
import video_placeHolder from "../../assets/images/video_player_placeholder.gif";

const Candidate = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [inputCode, setinputCode] = useState("");
  const [testData, setTestData] = useState({});
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState(false);
  const [record, setRecord] = useState(false);
  const [accessTest, setAssessTest] = useState(false);
  const [onClick, setOnClick] = useState(false);
  const [desabled, setDesabled] = useState(false);

  const onChangeInputBox = (e) => {
    const val = [];
    val.push(e.target.value);
    setinputCode(e.target.value);
  };

  const onClickLogin = async () => {
    setLoading(true);
    const respCand = await post(findCandidateByUniqueIdUrl, {
      uniqueCode: inputCode,
    });

    var a = moment(moment(respCand.data?.expiryDate).utc());
    var b = moment().utc();
    var d = a.diff(b, "days");

    if (d < 0) {
      setLoading(false);
      return toast.error("Assessment Expired.");
    }

    if (respCand.data?.testStatus !== "Invited") {
      setLoading(false);
      return toast.error("You have already attempted once.");
    }

    if (respCand.data?.testAssign?._id) {
      toast.success("Successfully logged in!");
      setLoading(false);
      setTestData(respCand.data);
      setIsLogin(respCand ? true : false);
    }
    setLoading(false);
  };

  return (
    <>
      {loading && <Loader />}
      {!isLogin ? (
        <div id="Login" className="login-layout">
          <div className="col-left d-flex align-items-center">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-xl-6 col-lg-8">
                  <a className="logo" href="/candidate">
                    <img src={logo} alt="Login logo" />
                  </a>
                  <div className="section section-sm ">
                    <h4> Unique Assessment Code </h4>
                    <p className="">
                      Enter the assessment code sent to you in the email.
                    </p>
                    <input
                      type="text"
                      className="my-4 fs-4 gap-3"
                      onChange={onChangeInputBox}
                    />
                    <button
                      onClick={onClickLogin}
                      className="btn btn-dark w-100"
                    >
                      Login
                    </button>
                  </div>
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{
                      position: "absolute",
                      bottom: 0,
                      margin: "auto 0",
                      marginLeft: "148px",
                    }}
                  >
                    <span style={{ fontWeight: 600 }} className="text-muted ">
                      Powered by
                    </span>
                    {/* <div style={{ display: "inline-block" }}> */}
                    <img
                      className=" mb-3 p-1"
                      style={{ height: 33 }}
                      src={logo}
                      alt="high5logo"
                    />
                    {/* </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-right"></div>
        </div>
      ) : testData.testAssign?.testCategory === "MCQ" ? (
        <GeneralTest testData={testData} />
      ) : (
        !permission && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <div
              className="d-flex justify-content-center align-items-center p-3 col-12"
              style={{
                borderBottom: "3px solid #fe5d59",
                height: 90,
              }}
            >
              <div className="text-center mt-2 col-4">
                <h5>Permission Required</h5>
              </div>
            </div>
            <div className="d-flex gap-4 p-5">
              <div className="">
                <h5>Instructions:</h5>
                <div className="mt-5"></div>
                <h6 className="">Camera & Microphone Access are Required!</h6>
                <h6 className=" mt-2" style={{ fontWeight: 400 }}>
                  Allow access permissions for this browser to use your
                  webcam/camera and microphone. Both requirements are crucial
                  parameters to proceed with the assessment.
                </h6>
              </div>
              <div className="card p-5 card-flat">
                <ReactMediaRecorder
                  video
                  render={({
                    status,
                    startRecording,
                    stopRecording,
                    mediaBlobUrl,
                  }) => (
                    <div className="">
                      <div className="text-center mb-3">
                        <h6 className="" style={{ color: "#140330" }}>
                          Verify and grant access to your camera and microphone
                          here.
                        </h6>
                      </div>
                      <div className="d-flex justify-content-center">
                        {mediaBlobUrl?.length > 0 ? (
                          <video
                            src={mediaBlobUrl}
                            controls
                            autoPlay
                            width={300}
                          />
                        ) : (
                          <div className="d-flex justify-content-center align-items-center">
                            <img
                              src={video_placeHolder}
                              alt="video_place_holder"
                              width={300}
                            />
                          </div>
                        )}
                      </div>
                      <div className="text-center pt-3"></div>
                      <div className="d-flex justify-content-center gap-2 my-4">
                        {!record ? (
                          <button
                            className="btn btn-sm"
                            disabled={onClick}
                            onClick={() => {
                              startRecording();
                              setOnClick(true);
                              setDesabled(true);
                              setTimeout(() => {
                                setRecord(true);
                                setOnClick(false);
                              }, 2000);
                              setAssessTest(true);
                            }}
                          >
                            Click here
                          </button>
                        ) : (
                          <button
                            className="btn btn-sm"
                            onClick={() => {
                              stopRecording();
                              setRecord(false);
                              setDesabled(false);
                              setLoading(true);
                              setTimeout(() => setLoading(false), 1000);
                            }}
                            disabled={!record}
                          >
                            Stop / Preview
                          </button>
                        )}
                      </div>
                      <div className="p-4 text-center">
                        <h6 className="">Start Assessment</h6>
                        {accessTest && !desabled ? (
                          <button
                            // disabled={true}
                            onClick={() => {
                              stopRecording();
                              setPermission(true);
                            }}
                            className="w-50 btn-sm"
                          >
                            Start
                          </button>
                        ) : (
                          <button
                            disabled={true}
                            onClick={() => {
                              stopRecording();
                              setPermission(true);
                            }}
                            className="w-50 btn-sm"
                          >
                            Start
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                />
              </div>
            </div>

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
        )
      )}
      {isLogin &&
        permission &&
        (testData.testAssign.testCategory ? (
          <GeneralTest testData={testData} />
        ) : (
          <>No Data</>
        ))}
      {}
    </>
  );
};

export default Candidate;
