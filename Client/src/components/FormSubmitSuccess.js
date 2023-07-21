import React, { useState } from "react";
import sparkles from "../assets/lottie/sparkles";
import checkMark from "../assets/lottie/checkmark";
import Lottie from "react-lottie-player";
import ReactAnime from "react-animejs";
const { Anime } = ReactAnime;

function FormSubmitSuccess(props) {
  const [loop] = useState(false);

  const closeModal = (value) => {
    props.closeModal(value);
  };

  return (
    <>
      <div className="section section-sm pt-5 pb-0">
        <div className="success-animation">
          <div className="checkmark">
            <Lottie loop={loop} animationData={checkMark} play></Lottie>
          </div>
          <Anime
            i
            react-animejs
            initial={[
              {
                targets: "#LottieSparkles",
                opacity: 0,
                delay: 1000,
              },
            ]}
          >
            <div className="sparkles">
              <Lottie
                loop={loop}
                animationData={sparkles}
                id="LottieSparkles"
                play
              ></Lottie>
            </div>
          </Anime>
        </div>
        <Anime
          initial={[
            {
              targets: ".success-message",
              opacity: 1,
              delay: 800,
              easing: "linear",
            },
          ]}
        >
          <div
            className="success-message opacity-0"
            // style={{ opacity: "0" }}
          >
            <div className="container">
              <div className="col-lg-12">
                <>
                  <h4 className="text-center">{props.successData.title}</h4>
                  <div
                    className="text-center"
                    dangerouslySetInnerHTML={{
                      __html: props.successData.subTitle,
                    }}
                  ></div>
                  <div style={{ padding: "10px" }}></div>
                  <div className="card card-flat card-lg">
                    <div
                      className="card-body"
                      dangerouslySetInnerHTML={{
                        __html: props.successData.htmlTag,
                      }}
                    ></div>
                  </div>
                </>
                <div className="text-center py-4">
                  <button
                    type="button"
                    className="btn btn-secondary mr-2"
                    data-dismiss="modal"
                    onClick={() => {
                      closeModal(false);
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Anime>
      </div>
    </>
  );
}
export default FormSubmitSuccess;
