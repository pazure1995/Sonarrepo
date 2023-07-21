import React, { useEffect } from "react";

const PreViewPage = (props) => {
  useEffect(() => {
    props.setVideoCopy(props.url);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <video
        src={props.url}
        style={{ width: "100%", height: "100%" }}
        controls
      />
    </>
  );
};

export default PreViewPage;
