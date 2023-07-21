import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import ResultCard from "../../../../components/Results/ResultCard";
import ResultCardMobile from "../../../../components/Results/ResultCardMobile";
import { getUserToken } from "../../../../services/AuthServices";
import { post } from "../../../../services/ApiServices";
import { findResultByAssessmentIdUrl } from "../../../../services/ServiceUrls";
import Pagination from "react-pagination-js";
import "react-pagination-js/dist/styles.css";
import Loader from "../../../../components/loader/Loader";
const Result = (props) => {
  const [showResultLink, setShowResultLink] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [results, setResults] = useState([]);
  const [totalRes, setTotalRes] = useState(0);
  const [matches, setMatches] = useState(
    window.matchMedia("(max-width: 1200px)").matches
  );
  useEffect(() => {
    window
      .matchMedia("(max-width: 1200px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);

  const Token = getUserToken();

  let pageData = 5;

  const changePage = (number) => {
    setCurrentPage(number);
  };

  useEffect(() => {
    setLoading(true);
    let payload = {
      assessmentId: props.testId,
      companyId: Token.companyId,
      limit: pageData,
      currentPage: currentPage,
      createdBy: Token.role === "admin" ? "" : Token.id,
    };
    post(findResultByAssessmentIdUrl, payload)
      .then((res) => {
        setResults(res.data[0]?.data);
        setTotalRes(res.data[0]?.count[0]?.total);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
    // eslint-disable-next-line
  }, [currentPage, props.testId]);

  return (
    <div className="px-1 pt-0 table-cards-1024">
      {loading && <Loader />}
      {totalRes > 0 ? (
        <>
          {!matches && (
            <table className="table table-hoverable table-table-cards-1024 ">
              <thead>
                <tr>
                  <th
                    scope="col"
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Click on the candidate to see the result"
                  >
                    Candidate
                  </th>
                  <th scope="col">Completed on</th>
                  <th scope="col">Score</th>
                  <th style={{ width: 10 }} scope="col">
                    Result
                  </th>

                  {/* <th scope="col" className="text-center">
                      Link
                    </th> */}
                </tr>
              </thead>
              <tbody>
                {results?.map((cand, index) => (
                  <ResultCard
                    key={index}
                    parent={"test"}
                    userId={Token?.id}
                    result={cand}
                  />
                ))}
              </tbody>
            </table>
          )}
          {matches &&
            results?.map((candid, index) => (
              <ResultCardMobile
                key={index}
                parent={"test"}
                userId={Token?.id}
                result={candid}
              />
            ))}

          <div className="d-flex p-2 mt-2 align-items-center justify-content-between border-top">
            <div className="ml-auto mx-auto-370 d-flex align-items-center">
              {results && totalRes > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalSize={totalRes}
                  sizePerPage={pageData}
                  firstPageText="⟨⟨"
                  lastPageText="⟩⟩"
                  showFirstLastPages={true}
                  changeCurrentPage={changePage}
                  theme="border-bottom"
                />
              )}
            </div>
          </div>
        </>
      ) : (
        <div>
          <div className="text-center p-3">
            <div className="avatar avatar-lg">
              <i className="fad fa-comment-slash"></i>
            </div>
            <div className="mt-3">No Results Found </div>
          </div>
        </div>
      )}
      <Modal show={showResultLink} size="lg" centered>
        <div className="bl-modal-header p-3 mx-3">
          <h6 className="bl-modal-title">{"Result Share Link"}</h6>
          <button
            type="button"
            data-dismiss="modal"
            aria-label="Close"
            onClick={() => setShowResultLink(false)}
            className="close p-0 bl-modal-close-btn"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <Modal.Body>
          <div className="bl-modal-body pt-0">
            <div className="input-group input-group-append mb-1">
              <input
                type="text"
                className="form-control"
                disabled
                placeholder="Copy Share Link"
                aria-label="Copy Share Link"
                aria-describedby="button-addon2"
              />
              <button
                className="btn btn-secondary"
                type="button"
                id="button-addon2"
              >
                Copy
              </button>
            </div>
            <div className="text-center animate animate-in">
              <div className="tag d-block tag-green1">Link Copied!</div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Result;
