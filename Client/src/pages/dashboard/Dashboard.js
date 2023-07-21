import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import SideNavBar from "../layout/SideNavBar";
import TopNavBar from "../layout/TopNavBar";
import InfoCard from "./InfoCard";
import ResultsDashboard from "../../components/Results/ResultsDashboard";
import Loader from "../../components/loader/Loader";
import {
  getUserId,
  getUserRole,
  getUserToken,
} from "../../services/AuthServices";
import { getLatestResults } from "../../redux/actions/dashboard/latestResults";
import { getDashboardData } from "../../redux/actions/dashboard/dashboardData";

const DashBoard = () => {
  const dispatch = useDispatch();

  const userId = getUserId();
  const userRole = getUserRole();

  const { resultData, dashboardData, resultDataLoading, dashboardDataLoading } =
    useSelector(
      (state) => ({
        resultData: state.getLatestResultsReducer.resultData,
        resultDataLoading: state.getLatestResultsReducer.resultDataLoading,
        dashboardData: state.getDashboardDataReducer.dashboardData,
        dashboardDataLoading:
          state.getDashboardDataReducer.dashboardDataLoading,
      }),
      shallowEqual
    );

  useEffect(() => {
    if (!resultData) {
      dispatch(
        getLatestResults({
          companyId: Token.companyId,
          createdBy: userRole === "admin" ? "" : userId,
        })
      );
    }
    if (!dashboardData) {
      dispatch(
        getDashboardData({
          companyId: Token.companyId,
          userId: Token.id,
          createdBy: userRole === "admin" ? "" : userId,
        })
      );
    }
  }, [resultData, dashboardData]);

  const [toggle, setToggle] = useState(false);
  const Token = getUserToken();
  const toggleDiv = (type) => {
    if (type === true) {
      setToggle(true);
    } else {
      setToggle(false);
    }
  };

  return (
    <>
      {(resultDataLoading || dashboardDataLoading) && <Loader />}
      <body
        className={
          toggle === true ? "layout1 layout1-closed close-menu" : "layout1"
        }
      >
        <div className="body-decorator body-decorator-top"></div>
        <div className="body-decorator body-decorator-bottom"></div>
        <SideNavBar />
        <TopNavBar isFrom="dashboard" handleToggle={toggleDiv} />

        <div id="Content">
          <div className="section section-sm pt-0-768">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-12">
                  <div className="col-12 text-center">
                    <div className="mb-5">
                      <h3>
                        <span className="wave mr-2">👋</span>
                        Hi, {Token.firstName}. Welcome!
                      </h3>
                      <p>What can we help you work on today?</p>
                    </div>
                  </div>
                  <div className="d-flex mb-4 pr-2 justify-content-end"></div>

                  <div className="row col-12 ms-1">
                    {Token.role !== "admin" && (
                      <InfoCard
                        number={dashboardData?.projects}
                        numberLastMonth={dashboardData?.projectsLastMonth}
                        detail="Projects"
                        path="/projects"
                      />
                    )}

                    <InfoCard
                      detail="Assessments"
                      number={dashboardData?.assessments}
                      numberLastMonth={dashboardData?.assessmentsLastMonth}
                      path="/assessments"
                    />

                    {Token.role !== "admin" && (
                      <InfoCard
                        number={dashboardData?.results}
                        numberLastMonth={dashboardData?.resultsLastMonth}
                        detail="Results"
                        path="/results"
                      />
                    )}

                    <InfoCard
                      number={dashboardData?.invitedCandidates}
                      numberLastMonth={
                        dashboardData?.invitedCandidatesLastMonth
                      }
                      detail="Invited"
                      path={Token.role === "admin" ? "/dashboard" : "/results"}
                      tab={Token.role !== "admin" ? "" : "invited"}
                    />

                    {Token.role === "admin" && (
                      <InfoCard
                        number={
                          dashboardData?.results +
                          dashboardData?.candidateUnderReview
                        }
                        numberLastMonth={
                          dashboardData?.resultsLastMonth +
                          dashboardData?.candidateUnderReviewLastMonth
                        }
                        detail="Assessments Taken"
                        path={
                          Token.role === "admin" ? "/dashboard" : "/results"
                        }
                        tab={Token.role !== "admin" ? "" : "completed"}
                      />
                    )}

                    <InfoCard
                      number={dashboardData?.candidateUnderReview}
                      numberLastMonth={
                        dashboardData?.candidateUnderReviewLastMonth
                      }
                      detail="Assessments under review"
                      path={Token.role === "admin" ? "/dashboard" : "/results"}
                      tab={Token.role === "admin" ? "" : "underReview"}
                    />

                    <InfoCard
                      number={dashboardData?.expiredInvitation}
                      numberLastMonth={
                        dashboardData?.expiredInvitationLastMonth
                      }
                      detail="Assessments Expired"
                      path="/results"
                      tab={"expired"}
                    />

                    <InfoCard
                      number={dashboardData?.questionsCount}
                      numberLastMonth={dashboardData?.questionInLastMonth}
                      detail="Questions"
                      questionInLastMonth
                      path="/questionLibrary"
                    />

                    {Token.role === "admin" && (
                      <InfoCard
                        number={dashboardData?.adminUsers}
                        numberLastMonth={dashboardData?.adminUsersInLastMonth}
                        detail="Users"
                        path="/users"
                      />
                    )}

                    {/* {Token.role !== "admin" && (
                      <InfoCard number={10} detail="Members" />
                    )} */}
                  </div>
                </div>
                <div className="mt-3" style={{ padding: "0 20px 0 25px" }}>
                  {Token.role !== "admin" && (
                    <ResultsDashboard
                      userId={"5667734234"}
                      data={resultData}
                      currentPage={1}
                      total={1}
                      changeCurrentPage={() => {}}
                      pageLoading={false}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </>
  );
};

export default DashBoard;
