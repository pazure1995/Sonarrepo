import React, { useEffect, useRef } from "react";

function VideoPreview({ stream }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  if (!stream) {
    return null;
  }
  return <video ref={videoRef} id="video" style={{width:"100%", height: "100%"}} autoPlay />;
}

export default VideoPreview;