import React, { useEffect, useState, useRef } from "react";
import ResultCard from "./ResultCard";
import ResultCardMobile from "./ResultCardMobile";
import Pagination from "react-pagination-js";
import "react-pagination-js/dist/styles.css";

const ResultsDashboard = (props) => {
  const [matches, setMatches] = useState(
    window.matchMedia("(max-width: 1200px)").matches
  );

  useEffect(() => {
    window
      .matchMedia("(max-width: 1200px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);

  const scoring = (testAssign, questions, isReviewed) => {
    let score = 0;
    let maximumScore = 0;
    if (testAssign?.testCategory === "MCQ")
      for (let i = 0; i < questions?.length; i++) {
        score = score + questions[i]?.isCorrectAnswer;
      }
    else
      for (let i = 0; i < questions?.length; i++) {
        score = score + Number(questions[i]?.marks);
        maximumScore = maximumScore + 10;
      }

    var percent =
      testAssign?.testCategory === "MCQ"
        ? (score * 100) / questions?.length
        : (score * 100) / maximumScore;
    return testAssign?.testCategory === "MCQ"
      ? percent?.toFixed(2)
      : isReviewed
      ? percent?.toFixed(2)
      : "Under Review";
  };

  useEffect(() => {
    findActive(props?.data);
    var resultsArray = [];
    props?.data?.forEach((element) => {
      let result = {
        ...element,
        score: scoring(
          element.testAssign,
          element.questions,
          element.isReviewed
        ),
      };

      resultsArray = [...resultsArray, result];
      //   setActualData(resultsArray);
      //   setFilterData(resultsArray);
    });
    // eslint-disable-next-line
  }, [JSON.stringify(props.data)]);

  const findActive = (results) => {
    var activeAssessments = [];
    results?.forEach((element) => {
      !!element.testAssign?.testName &&
      !activeAssessments.includes(element.testAssign?.testName)
        ? (activeAssessments = [
            ...activeAssessments,
            element.testAssign?.testName,
          ])
        : (activeAssessments = [...activeAssessments]);
    });
    // setAssessments([...activeAssessments]);
  };

  return (
    <>
      <div className="card p-4 mb-3">
        <div className="mb-3 pb-3 border-bottom-gray2">
          <div className="d-flex align-items-center justify-content-between">
            <h5>Latest results</h5>
          </div>
        </div>
        <div className="">
          <div>
            <div className="px-1 pt-0 ">
              {props?.data?.length > 0 ? (
                <>
                  {!matches ? (
                    <table className="table ">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            data-toggle="tooltip"
                            data-placement="top"
                            title="Click on the candidate to see the result"
                          >
                            Candidate's name
                          </th>
                          <th style={{ minWidth: 140 }} scope="col">
                            Assessment name
                          </th>
                          <th style={{ minWidth: 140 }} scope="col">
                            Category
                          </th>
                          <th style={{ minWidth: 100 }} scope="col">
                            Completed on
                          </th>

                          <th scope="col">Result</th>
                          <th style={{ width: 50 }} scope="col">
                            Link
                          </th>
                        </tr>
                      </thead>
                      {!props.pageLoading ? (
                        <tbody>
                          {props?.data?.map((result, index) => (
                            <ResultCard
                              key={index}
                              parent={"dashboard"}
                              userId={props?.userId}
                              result={result}
                            />
                          ))}
                        </tbody>
                      ) : (
                        <div>Loading...</div>
                      )}
                    </table>
                  ) : (
                    props?.data?.map((result, index) => (
                      <ResultCardMobile
                        parent={"dashboard"}
                        userId={props?.userId}
                        result={result}
                        key={index}
                      />
                    ))
                  )}
                </>
              ) : (
                <div>
                  <div className="text-center p-3">
                    <div className="avatar avatar-lg">
                      <i className="fad fa-comment-slash"></i>
                    </div>
                    <div className="mt-3">No Results Found</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* <div className="d-flex p-2 mt-2 align-items-center justify-content-between border-top">
        <div className="ml-auto mx-auto-370 d-flex align-items-center">
          {props.data.length > 0 && (
            <Pagination
              currentPage={props.currentPage}
              totalSize={props.total}
              sizePerPage={10}
              firstPageText="⟨⟨"
              lastPageText="⟩⟩"
              showFirstLastPages={true}
              changeCurrentPage={props.changeCurrentPage}
              theme="border-bottom"
            />
          )}
        </div>
      </div> */}
    </>
  );
};

export default ResultsDashboard;
