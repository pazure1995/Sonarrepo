import React from "react";
import testCompletedImg from "../../assets/images/taskEnd.svg";
import logo from "../../assets/images/High5Logo.png";

const TestEnd = ({ companyLogo, companyName, rejected, isTestSubmited }) => {
  return (
    <div
      style={{
        backgroundColor: "lightGray",
        color: "#00404a",
        width: "100vw",
        height: "100vh",
      }}
      className="px-5 pt-2"
    >
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "60%" }}
      >
        <img src={testCompletedImg} alt="" width={60} />

        <div className="ms-4">
          <h1>Thank You !</h1>
          {rejected && !isTestSubmited ? (
            <>
              <h6>
                Your assessment got automatically submitted as the system
                detected change of focus due to toggling between screens. There
                is no further action needed from you. You will be contacted
                after your assessment has been reviewed.
              </h6>
            </>
          ) : (
            <>
              <h6>
                Your assessment has been submitted successfully. There is no
                further action needed from your end. Once the assessment has
                been reviewed, we will get back to you.
              </h6>
            </>
          )}
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
    </div>
  );
};

export default TestEnd;
