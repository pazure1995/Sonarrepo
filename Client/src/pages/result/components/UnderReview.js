import React from "react";
import moment from "moment";
import Pagination from "react-pagination-js";

const UnderReview = (props) => {
  var data =
    props.parent === "all" ? props.resultData : props.resultData[0].data;

  return (
    <div className="col">
      {data?.map((data, index) => {
        let testCategory =
          data?.assessmentDetails?.testCategory ||
          data?.testAssign?.testCategory;
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
            <div className="card-body d-flex align-items-center ">
              <div className="w-100 ml-2">
                <div className="d-flex align-items-center ">
                  <h6 className="mb-0 me-2">
                    {data?.candidateInfo?.firstName +
                      " " +
                      data?.candidateInfo?.lastName}
                  </h6>
                </div>{" "}
                <div className="font-regular font-primary font-gray1 text-truncate  mt-2">
                  <span>Assessment: </span>
                  <span className="tag tag-blue2">
                    {" "}
                    {data?.assessmentDetails?.testName ||
                      data?.testAssign?.testName}
                  </span>
                </div>
                <div className="font-regular font-primary font-gray1 text-truncate  mt-2">
                  <span>Category: </span>
                  <span
                    className={`tag
                  ${
                    testCategory === "MCQ"
                      ? "tag-red1"
                      : testCategory === "General"
                      ? "tag-orange1"
                      : "tag-blue1"
                  }
                  mb-1`}
                  >
                    {testCategory}
                  </span>
                </div>
              </div>
            </div>{" "}
            <div className="card-body  font-regular d-flex flex-column align-items-end justify-content-center">
              <div className="pr-3 mt-2">
                <span className="">Interviewed on:</span>{" "}
                <span className="tag">
                  <span>{moment(data?.createdAt).format("MM/DD/YYYY")}</span>
                </span>
              </div>
              <div className="pr-3 mt-2 ">
                <span className="mb-2">Invited by:</span>{" "}
                <span className="tag">
                  {/* <i aria-hidden="true" className="far fa-clock"></i> <span>1</span>{" "} */}
                  {data?.userDetails?.firstName} {data?.userDetails?.lastName}
                </span>
              </div>
              <div className="font-regular font-primary font-gray1 text-truncate  mt-2 pr-3 ">
                <span className="font-bold d-inline-1024 d-none">Result: </span>{" "}
                <span>Status: </span>
                <span className="tag tag-green2">Under review</span>
              </div>
            </div>
          </a>
        );
      })}{" "}
      {props.parent !== "all" && props?.countOfResults?.underReview > 0 && (
        <div className="d-flex p-2 mt-2 align-items-center justify-content-between border-top">
          <div className="ml-auto mx-auto-370 d-flex align-items-center">
            <Pagination
              currentPage={props?.currentPage}
              totalSize={props?.countOfResults?.underReview}
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

export default UnderReview;
