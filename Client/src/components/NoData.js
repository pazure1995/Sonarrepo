import React from "react";

function NoData(props) {
  return (
    <div className="d-flex align-items-center justify-content-center">
      <p className="d-flex align-items-center justify-content-center m-5 p-5">
        {`No ${props.component ? props.component : "data"} found`}
      </p>
    </div>
  );
}

export default NoData;
