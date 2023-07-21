import React from "react";
import { Link } from "react-router-dom";

const InfoCard = (props) => {
  let itemsCountDifferance = props.numberLastMonth ? props.numberLastMonth : 0;

  return (
    <>
      <div className="col-xxl-3 col-sm-4">
        <Link
          to={`${props?.path}`}
          state={{
            tab: props.tab || "all",
          }}
          style={{
            color: "#1b1a1a",
            fontWeight: 400,
            cursor: props?.path === "/dashboard" ? "context-menu" : "pointer",
          }}
        >
          {itemsCountDifferance > 0 && (
            <div className="card card-lg mb-2">
              <div className="card-body">
                <div className="w-50">
                  <h4 className="font-light mb-0">{props?.number}</h4>
                  <p className="mb-0 " style={{ width: "180px" }}>
                    {props?.detail}
                  </p>
                </div>
                <hr></hr>
                <div className="text-left font-green">
                  <p className="mb-0">
                    <small>{`+ ${itemsCountDifferance} in last 30 days`}</small>
                  </p>
                </div>
              </div>
            </div>
          )}
          {itemsCountDifferance < 0 && (
            <div className="card card-lg mb-2">
              <div className="card-body">
                <div className="w-50">
                  <h4 className="font-light mb-0">{props?.number}</h4>
                  <p className="mb-0 " style={{ width: "180px" }}>
                    {props?.detail}
                  </p>
                </div>
                <hr></hr>
                <div className="text-left font-red">
                  <p className="mb-0">
                    <small>
                      <small>{`${itemsCountDifferance} in last 30 days`}</small>
                    </small>
                  </p>
                </div>
              </div>
            </div>
          )}
          {itemsCountDifferance === 0 && (
            <div className="card card-lg mb-2">
              <div className="card-body">
                <div className="w-50">
                  <h4 className="font-light mb-0">{props?.number}</h4>
                  <p className="mb-0 " style={{ width: "180px" }}>
                    {props?.detail}
                  </p>
                </div>
                <hr></hr>
                <div className="text-left font-red">
                  <p className="mb-0 text-left">
                    <small>No change in last 30 days</small>
                  </p>
                </div>
              </div>
            </div>
          )}
        </Link>
      </div>
    </>
  );
};

export default InfoCard;
