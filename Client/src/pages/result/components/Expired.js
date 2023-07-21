import React from "react";
import moment from "moment";
import Pagination from "react-pagination-js";

const Expired = (props) => {
  var data =
    props.parent === "all" ? props.resultData : props.resultData[0].data;

  return (
    <div className="col">
      {data?.map((item, index) => {
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
                    {item?.candidateInfo?.firstName}{" "}
                    {item?.candidateInfo?.lastName}
                  </h6>
                </div>{" "}
                <div className="font-regular font-primary font-gray1 text-truncate  mt-2">
                  <span>Assessment: </span>
                  <span className="tag tag-blue2 ">
                    {" "}
                    {item?.assessmentDetails?.testName}
                  </span>
                </div>
                <div className="font-regular font-primary font-gray1 text-truncate  mt-2">
                  <span>Category: </span>
                  <span
                    className={`tag
                  ${
                    item?.assessmentDetails?.testCategory === "MCQ"
                      ? "tag-red1"
                      : item?.assessmentDetails?.testCategory === "General"
                      ? "tag-orange1"
                      : "tag-blue1"
                  }
                  mb-1`}
                  >
                    {item?.assessmentDetails?.testCategory}
                  </span>
                </div>
                {/* <div className="font-regular font-primary font-gray1 text-truncate  mt-2">
                  <span>Email: </span>
                  <span className="tag tag-green2 ">{item?.email}</span>
                </div> */}
              </div>
            </div>{" "}
            <div className="card-body  font-regular d-flex flex-column align-items-end justify-content-center">
              <div className="pr-3">
                <span className="">Invited on:</span>{" "}
                <span className="tag">
                  <span>{moment(item?.createdAt).format("MM/DD/YYYY")}</span>
                </span>
              </div>
              <div className="pr-3 mt-2">
                <span className="">Expired on:</span>{" "}
                <span className="tag">
                  <span>{moment(item?.expiryDate).format("MM/DD/YYYY")}</span>
                </span>
              </div>
              <div className="pr-3 mt-2">
                <span className="">Invited by:</span>{" "}
                <span className="tag">
                  {item?.userDetails?.firstName} {item?.userDetails?.lastName}
                </span>
              </div>
              <div className="font-regular font-primary font-gray1 text-truncate  mt-2 pr-3">
                <span>Status: </span>
                <span className="tag tag-coral ">{"Expired"}</span>
              </div>
            </div>
          </a>
        );
      })}
      {props.parent !== "all" && props?.countOfResults?.expired > 0 && (
        <div className="d-flex p-2 mt-2 align-items-center justify-content-between border-top">
          <div className="ml-auto mx-auto-370 d-flex align-items-center">
            <Pagination
              currentPage={props?.currentPage}
              totalSize={props?.countOfResults?.expired}
              sizePerPage={props.dataSize}
              firstPageText="⟨⟨"
              lastPageText="⟩⟩"
              showFirstLastPages={true}
              changeCurrentPage={props.currentPage}
              theme="border-bottom"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Expired;
