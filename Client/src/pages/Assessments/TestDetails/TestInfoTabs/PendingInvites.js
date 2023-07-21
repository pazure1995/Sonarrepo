import React, { useState, useEffect } from "react";
import moment from "moment";
import { findCandidateByAssessmentIdUrl } from "../../../../services/ServiceUrls";
import { post } from "../../../../services/ApiServices";
import Pagination from "react-pagination-js";
import "react-pagination-js/dist/styles.css";
import Loader from "../../../../components/loader/Loader";
import { toast } from "react-toastify";
import { getUserId, getUserRole } from "../../../../services/AuthServices";

const PendingInvites = (props) => {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [totalInvites, setTotalInvites] = useState(0);

  let pageData = 5;
  const userId = getUserId();
  const userRole = getUserRole();

  const getInvites = () => {
    setLoading(true);
    let payload = {
      assessmentId: props.testId,
      testStatus: "Invited",
      currentPage: currentPage,
      limit: pageData,
      createdBy: userRole === "admin" ? "" : userId,
      parent: "vetting",
    };
    post(findCandidateByAssessmentIdUrl, payload)
      .then((res) => {
        setPendingInvites(res.data.data);
        setTotalInvites(res.data.total);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong");
        setLoading(false);
      });
  };

  useEffect(() => {
    getInvites();
    // eslint-disable-next-line
  }, [props.testId]);

  const changePage = (number) => {
    setCurrentPage(number);
  };

  useEffect(() => {
    getInvites();
  }, [currentPage]);

  return (
    <div className="px-1 pt-0 table-cards-1024">
      {loading && <Loader />}
      {totalInvites > 0 ? (
        <>
          {!props?.matches && (
            <table className="table table-hoverable table-table-cards-1024 ">
              <thead>
                <tr>
                  <th scope="col">Candidate</th>
                  <th scope="col">Email</th>
                  <th scope="col">Invited on</th>
                  <th scope="col">Expires on</th>
                </tr>
              </thead>
              <tbody>
                {pendingInvites?.map((doc, index) => (
                  <tr key={index}>
                    <td style={{ paddingTop: "19px", paddingBottom: "19px" }}>
                      <span>
                        {" "}
                        {doc?.candidateInfo.firstName}{" "}
                        {doc?.candidateInfo?.lastName}{" "}
                      </span>
                    </td>
                    <td style={{ paddingTop: "19px", paddingBottom: "19px" }}>
                      <span> {doc?.candidateInfo?.email} </span>
                    </td>
                    <td style={{ paddingTop: "19px", paddingBottom: "19px" }}>
                      <span>
                        {" "}
                        {moment(doc?.createdAt).format("MM/DD/YYYY")}{" "}
                      </span>
                    </td>
                    <td style={{ paddingTop: "19px", paddingBottom: "19px" }}>
                      <span>
                        {" "}
                        {moment(doc?.expiryDate).format("MM/DD/YYYY")}{" "}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {props?.matches && (
            <>
              {pendingInvites?.map((doc, index) => (
                <div
                  key={index}
                  className="card card-hoverable p-2 d-flex flex-col flex-sm-col flex-md-row flex-lg-row flex-xl-row  justify-content-between m-2"
                >
                  {" "}
                  <span style={{ paddingTop: "19px", paddingBottom: "19px" }}>
                    Name:{" "}
                    <span>
                      {" "}
                      {doc?.candidateInfo?.firstName}{" "}
                      {doc?.candidateInfo?.lastName}{" "}
                    </span>
                  </span>
                  <span style={{ paddingTop: "19px", paddingBottom: "19px" }}>
                    Email: <span> {doc?.candidateInfo?.email} </span>
                  </span>
                  <span style={{ paddingTop: "19px", paddingBottom: "19px" }}>
                    Invited on:
                    <span> {moment(doc?.createdAt).format("MM/DD/YYYY")} </span>
                  </span>
                  <span style={{ paddingTop: "19px", paddingBottom: "19px" }}>
                    Expires on:
                    {moment(doc?.expiryDate).format("MM/DD/YYYY")}{" "}
                  </span>
                </div>
              ))}
            </>
          )}

          <div className="d-flex p-2 mt-2 align-items-center justify-content-between border-top">
            <div className="ml-auto mx-auto-370 d-flex align-items-center">
              {pendingInvites && totalInvites > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalSize={totalInvites}
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
            <div className="mt-3">No Invited Candidates Found</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingInvites;
