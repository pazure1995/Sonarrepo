import React from "react";
import Lottie from "react-lottie";
import animationData from "../../assets/lottie/hand-loader.json";

function Loader() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
  };

  return (
    <div className="loaderpopup">
      <Lottie options={defaultOptions} height={200} width={200} />
    </div>
  );
}

export default Loader;
