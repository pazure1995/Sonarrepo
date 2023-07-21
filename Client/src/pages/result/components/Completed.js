import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import Modal from "react-bootstrap/Modal";
import Pagination from "react-pagination-js";
import ResultModal from "../../GeneralTestResult/ResultModal";

const Completed = (props) => {
  const [showResultShareModal, setShowResultShareModal] = useState(false);
  const [id, setId] = useState("");

  const onClickResultShare = (candidateId) => {
    setId(candidateId);
    setShowResultShareModal(true);
  };

  let score = 0.0;
  var data =
    props.parent === "all" ? props?.resultData : props.resultData[0]?.data;

  const navigateOutApp = (link) => window.open(link, "_blank", "noreferrer");

  return (
    <div className="col">
      {data?.map((data, index) => {
        score = props.scoring(data);
        return (
          <a
            key={index}
            href
            style={{ cursor: "default" }}
            onClick={(e) => {
              e.preventDefault();
            }}
            target="_blank"
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
                </div>
                <div className="font-regular font-primary font-gray1 text-truncate mt-2">
                  <span>Assessment: </span>
                  <span className="tag tag-blue2">
                    {data?.testAssign?.testName}
                  </span>
                </div>
                <div className="font-regular font-primary font-gray1 text-truncate  mt-2">
                  <span>Category: </span>
                  <span
                    className={`tag
                  ${
                    data?.testAssign?.testCategory === "MCQ"
                      ? "tag-red1"
                      : data?.testAssign?.testCategory === "General"
                      ? "tag-orange1"
                      : "tag-blue1"
                  }
                  mb-1`}
                  >
                    {data?.testAssign?.testCategory}
                  </span>
                </div>
              </div>
            </div>
            <div className="card-body font-regular d-flex flex-column align-items-end justify-content-center">
              <div className="pr-3 ">
                <span className=" align-items-center  mr-3">
                  {Number(score) <
                  Number(data?.testAssign?.details?.passScore) ? (
                    <span
                      style={{ fontSize: 15, fontWeight: 600 }}
                      className="font-regular font-primary font-coral"
                    >
                      Fail
                    </span>
                  ) : Number(score) >=
                    Number(data?.testAssign?.details?.passScore) ? (
                    <span
                      style={{ fontSize: 15, fontWeight: 600 }}
                      className="font-regular font-primary font-green"
                    >
                      Pass
                    </span>
                  ) : (
                    <></>
                  )}
                </span>
                <span className="font-bold d-inline-1024 d-none">Result: </span>
                <span className=" align-items-center  mr-3">
                  {!isNaN(score) &&
                    score < Number(data?.testAssign?.details?.passScore) && (
                      <span className="tag tag-coral">{score + "%"}</span>
                    )}
                  {!isNaN(score) &&
                    score >= Number(data?.testAssign?.details?.passScore) && (
                      <span className="tag tag-green3">{score + "%"}</span>
                    )}
                  {isNaN(score) && (
                    <span className="tag tag-green2">{score}</span>
                  )}
                </span>
                <Link
                  to={`/result/${
                    props.parent === "all"
                      ? data?.resultData[0]?.candidateId
                      : data?.candidateId
                  }`}
                  state={{
                    backBtn: true,
                  }}
                  target="_blank"
                  onClick={() =>
                    navigateOutApp(
                      `/result/${
                        props.parent === "all"
                          ? data?.resultData[0]?.candidateId
                          : data?.candidateId
                      }`
                    )
                  }
                >
                  <div
                    className="dropdown"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="View"
                    aria-haspopup="true"
                    aria-expanded="false"
                    style={{ fontSize: "17px", cursor: "pointer" }}
                  >
                    <i style={{ color: "#808080" }} class="fas fa-eye"></i>
                  </div>
                </Link>
                <div
                  className="dropdown ms-2"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="Share"
                  aria-haspopup="true"
                  aria-expanded="false"
                  style={{ fontSize: "17px", cursor: "pointer" }}
                  onClick={() =>
                    onClickResultShare(
                      props.parent === "all" ? data._id : data?.candidateId
                    )
                  }
                >
                  {<i className="far fa-share-alt"></i>}
                </div>
              </div>

              <div className="pr-3 mt-2">
                <span className="">Completed on:</span>
                <span className="tag">
                  <span>{moment(data.createdAt).format("MM/DD/YYYY")}</span>
                </span>
              </div>
              <div className="pr-3 mt-2">
                <span className="mb-2">Invited by:</span>
                <span className="tag">
                  <span>
                    {data?.userDetails?.firstName} {data?.userDetails?.lastName}
                  </span>
                </span>
              </div>
            </div>
          </a>
        );
      })}
      <Modal
        show={showResultShareModal}
        size="lg"
        className="modal fade"
        data-backdrop="static"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >
        <div className="modal-header" id="CreateQuestionModal">
          <h6 className="modal-title ml-4" id="CreateQuestionModalLabel">
            {""}
          </h6>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            onClick={() => setShowResultShareModal(false)}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <Modal.Body>
          <ResultModal
            candidateId={id}
            candidateName={data?.candidateName}
            candidateData={data}
            testName={data?.testAssign?.testName}
            testCategory={data?.testAssign?.testCategory}
            skill={data?.testAssign?.skills}
            setShowResultShareModal={setShowResultShareModal}
            parent={props.parent}
          />
        </Modal.Body>
      </Modal>
      {props.parent !== "all" && props?.countOfResults?.completed > 0 && (
        <div className="d-flex p-2 mt-2 align-items-center justify-content-between border-top">
          <div className="ml-auto mx-auto-370 d-flex align-items-center">
            <Pagination
              currentPage={props?.currentPage}
              totalSize={props?.countOfResults?.completed}
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

export default Completed;
