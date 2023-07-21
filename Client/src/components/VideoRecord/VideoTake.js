import React from "react";
import PreViewPage from "./PreViewPage";
import VideoPreview from "./VideoPreview";

function VideoTake(props) {

  return (
    <>
      {/* {props?.status === "idle" && <VideoPreview stream={props.idleStream} />} */}
      {props?.status === "recording" && <VideoPreview stream={props.stream} />}
      {props.status === "stopped" && (
        <PreViewPage url={props.url} setVideoCopy={props.setVideoCopy} />
      )}
    </>
  );
}

export default VideoTake;
