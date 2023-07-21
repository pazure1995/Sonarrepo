import React from "react";
import logo from "../../assets/images/High5Logo.png";

const ReviewDone = (props) => {
  return (
    <>
      <div
        className="d-flex p-2 shadow p-3 border-bottom justify-content-between"
        style={{
          backgroundColor: "#fff",
          height: "10vh",
          minHeight: 65,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10000,
        }}
      >
        <img src={logo} alt="logo" />
      </div>

      <div
        style={{
          width: "100vw",
          height: "80vh",
          flexDirection: "column",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        className=" rounded-3 "
      >
        <div className="container-fluid">
          <div className="row position-relative mt-5">
            <div className="offset-xxl-2 col-xxl-8 offset-xl-1 col-xl-10 col-lg-12 col-md-12 col-sm-12">
              <div className="card card-xl">
                <div className="card-body">
                  <div className="Sspace"></div>
                  <h4 className="font-bold mb-3">
                    {props.alredyReviewed
                      ? "The review has already been completed"
                      : "Review is complete."}
                  </h4>
                  <p>
                    {props.alredyReviewed
                      ? "Result will be available on the platform soon."
                      : "The evaluation has finished. We appreciate your review. The final result will shortly be made accessible on the website."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewDone;
