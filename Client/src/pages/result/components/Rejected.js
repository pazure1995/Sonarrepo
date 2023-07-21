import React from "react";
import moment from "moment";

const Rejected = (props) => {
  var data = !(props.parent === "all")
    ? props.rejected
    : props.getPaginatedData();
  return (
    <div className="col">
      {data?.map((data, index) => {
        return (
          <a
            key={index}
            href
            style={{ cursor: "default" }}
            onClick={(e) => {
              e.preventDefault();
            }}
            className="card d-flex flex-row align-items-stretch justify-content-between mb-1 p-relative"
          >
            {" "}
            <div className="card-body d-flex align-items-center ">
              <div className="w-100 ml-2">
                <div className="d-flex align-items-center ">
                  <h6 className="mb-0 me-2">
                    {data?.firstName} {data?.lastName}
                  </h6>
                </div>{" "}
                <div className="font-regular font-primary font-gray1 text-truncate mt-2">
                  <span>Assessment: </span>
                  <span className="tag tag-blue2 ">
                    {" "}
                    {data?.testAssign?.testName}
                  </span>
                </div>
                <div className="font-regular font-primary font-gray1 text-truncate  mt-2">
                  <span>Category: </span>
                  <span
                    className={`tag
                  ${
                    data?.testAssign.testCategory === "MCQ"
                      ? "tag-red1"
                      : data?.testAssign.testCategory === "General"
                      ? "tag-orange1"
                      : "tag-blue1"
                  }
                  mb-1`}
                  >
                    {data?.testAssign.testCategory}
                  </span>
                </div>
                {/* <div className="font-regular font-primary font-gray1 text-truncate mt-2">
                  <span>Email: </span>
                  <span className="tag tag-green2">{data?.email}</span>
                </div> */}
              </div>
            </div>{" "}
            <div className="card-body  font-regular d-flex flex-column align-items-end justify-content-center">
              <div className="pr-3 mt-2">
                <span className="">Rejected on:</span>{" "}
                <span className="tag">
                  {/* <i aria-hidden="true" className="far fa-clock"></i> <span>1</span>{" "} */}
                  <span>{moment(data.createdAt).format("MM/DD/YYYY")}</span>
                </span>
              </div>
              <div className="pr-3 mt-2">
                <span className="mb-2">Invited by:</span>{" "}
                <span className="tag">
                  {/* <i aria-hidden="true" className="far fa-clock"></i> <span>1</span>{" "} */}
                  <span>
                    {data?.createdBy?.firstName} {data?.createdBy?.lastName}
                  </span>
                </span>
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
};

export default Rejected;
