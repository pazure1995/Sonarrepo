import moment from "moment";
import React, { useState, useEffect } from "react";
import { findCandidateByAssessmentIdUrl } from "../../../../services/ServiceUrls";
import { post } from "../../../../services/ApiServices";
import { toast } from "react-toastify";
import Pagination from "react-pagination-js";
import "react-pagination-js/dist/styles.css";
import Loader from "../../../../components/loader/Loader";
import { getUserId, getUserRole } from "../../../../services/AuthServices";

const ExpiredInvites = (props) => {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [expiredInvites, setExpiredInvites] = useState([]);
  const [totalInvites, setTotalInvites] = useState(0);

  let pageData = 5;
  const userId = getUserId();
  const userRole = getUserRole();

  const getInvites = () => {
    setLoading(true);
    let payload = {
      assessmentId: props.testId,
      testStatus: "Expired",
      currentPage: currentPage,
      limit: pageData,
      createdBy: userRole === "admin" ? "" : userId,
      parent: "vetting",
    };
    post(findCandidateByAssessmentIdUrl, payload)
      .then((res) => {
        setExpiredInvites(res.data.data);
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

  const formatDate = (invitedOn, expiresAfter) => {
    var newDate = moment(invitedOn)
      .add(expiresAfter, "days")
      .format("MM/DD/YYYY");
    return newDate;
  };

  return (
    <div className="px-1 pt-0 table-cards-1024">
      {loading && <Loader />}
      {totalInvites > 0 ? (
        <>
          {!props.matches && (
            <table className="table table-hoverable table-table-cards-1024 h-3">
              <thead>
                <tr>
                  <th scope="col">Candidate</th>
                  <th scope="col">Email</th>
                  <th scope="col">Invited on</th>
                  <th scope="col">Expired on</th>
                </tr>
              </thead>
              <tbody>
                {expiredInvites?.map((elem, idx) => {
                  return (
                    <tr>
                      <td style={{ paddingTop: "19px", paddingBottom: "19px" }}>
                        <span>
                          {" "}
                          {elem?.candidateInfo?.firstName}{" "}
                          {elem?.candidateInfo?.lastName}{" "}
                        </span>
                      </td>
                      <td style={{ paddingTop: "19px", paddingBottom: "19px" }}>
                        <span> {elem?.candidateInfo.email} </span>
                      </td>
                      <td style={{ paddingTop: "19px", paddingBottom: "19px" }}>
                        <span>
                          {" "}
                          {moment(elem.createdAt).format("MM/DD/YYYY")}{" "}
                        </span>
                      </td>
                      <td>
                        <span>
                          {moment(elem.expiryDate).format("MM/DD/YYYY")}{" "}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          {props.matches && (
            <>
              {expiredInvites?.map((elem, index) => (
                <div className="card card-hoverable p-2 d-flex flex-col flex-sm-col flex-md-row flex-lg-row flex-xl-row  justify-content-between m-2">
                  {" "}
                  <span style={{ paddingTop: "19px", paddingBottom: "19px" }}>
                    Name:{" "}
                    <span>
                      {" "}
                      {elem?.candidateInfo?.firstName}{" "}
                      {elem?.candidateInfo?.lastName}{" "}
                    </span>
                  </span>
                  <span style={{ paddingTop: "19px", paddingBottom: "19px" }}>
                    Email: <span> {elem?.candidateInfo?.email} </span>
                  </span>
                  <span style={{ paddingTop: "19px", paddingBottom: "19px" }}>
                    Invited on:{" "}
                    <span>
                      {" "}
                      {moment(elem?.createdAt).format("MM/DD/YYYY")}{" "}
                    </span>
                  </span>
                  <span style={{ paddingTop: "19px", paddingBottom: "19px" }}>
                    Expired on:{" "}
                    <span>
                      {" "}
                      {formatDate(elem?.createdAt, elem?.expiryDays)}{" "}
                    </span>
                  </span>
                </div>
              ))}
            </>
          )}
          <div className="d-flex p-2 mt-2 align-items-center justify-content-between border-top">
            <div className="ml-auto mx-auto-370 d-flex align-items-center">
              {expiredInvites && totalInvites > 0 && (
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
            <div className="mt-3">No expired invites found</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpiredInvites;
