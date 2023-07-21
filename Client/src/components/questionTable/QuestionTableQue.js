import React, { useEffect, useState } from "react";
import QuestionCard from "../questionCard/QuestionCard";
import QuestionCardMobile from "../questionCardMobile/QuestionCardMobile";
import QuestionPreview from "../questionPreview/QuestionPreview";
import Pagination from "react-pagination-js";
import "react-pagination-js/dist/styles.css";

const QuestionTableQue = (props) => {
  const [currentEvent, setCurrentEvent] = useState({});
  const [questions, setQuestions] = useState([]);
  const [pageType, setPageType] = useState("");
  const [paginationGroup, setPaginationGroup] = useState([]);
  const [requestTitleArray, setRequestTitleArray] = useState([]);
  const [newRequestList, setnewRequestList] = useState([]);
  const [parent, setParent] = useState("");
  const [checkedQuestions, setCheckedQuestions] = useState([]);
  const [sidePanel, setSidePanel] = useState({
    panel: false,
    question: {},
  });
  const [matches, setMatches] = useState(
    window.matchMedia("(max-width: 1200px)").matches
  );

  useEffect(() => {
    window
      .matchMedia("(max-width: 1200px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);

  let pageSize = 8;
  let dataSize = props.parent === "QuestionLib" ? props.pageData : 10;

  useEffect(() => {
    if (props.parent === "QuestionLib") {
      props.TabActive ? setParent("public") : setParent("user");
    } else if (props.parent === "createTest") {
      props.marks ? setParent("createTestM") : setParent("createTest");
    }
    props.parent === "addQuestion" && setParent("addQuestion");
    props.parent === "testInfo" && setParent("testInfo");
  }, [props]);

  useEffect(() => {
    !!props?.getQuestions && props.getQuestions();
    if (!!props?.tags || !!props?.testCategory || !!props?.difficulty) {
      var newQuestionList = props.data.filter((item) => {
        const includeSkill = props.tags.includes(item.skill);
        const sameCategory =
          props.testCategory === "General"
            ? true
            : props.testCategory === item.type;
        const similarDifficulty = props.difficulty === item.difficulty;

        if (!props?.tags && !props?.testCategory && !props?.difficulty) {
          return item;
        } else if (!props?.tags && !props?.testCategory) {
          return similarDifficulty ? item : null;
        } else if (!props?.testCategory && !props?.difficulty) {
          return includeSkill ? item : null;
        } else if (!props?.difficulty && !props?.tags) {
          return sameCategory ? item : null;
        } else if (!props?.tags) {
          return similarDifficulty && sameCategory ? item : null;
        } else if (!props?.testCategory) {
          return includeSkill && similarDifficulty ? item : null;
        } else if (!props?.difficulty) {
          return includeSkill && sameCategory ? item : null;
        } else {
          return includeSkill && sameCategory && similarDifficulty
            ? item
            : null;
        }
      });
      setQuestions(newQuestionList);
    } else {
      setQuestions(props.data);
    }

    // eslint-disable-next-line
  }, [props.data]);

  useEffect(() => {
    if (pageType === "up") {
      if ((props.currentPage - 1) % pageSize === 0 && props.currentPage !== 1) {
        setPaginationGroup(
          requestTitleArray.slice(
            props.currentPage - 1,
            props.currentPage + (pageSize - 1)
          )
        );
      }
    }
    if (pageType === "down") {
      if (props.currentPage % pageSize === 0 && props.currentPage !== 1) {
        setPaginationGroup(
          requestTitleArray.slice(
            props.currentPage - pageSize,
            props.currentPage
          )
        );
      }
    }
    // eslint-disable-next-line
  }, [props.currentPage]);

  useEffect(() => {
    setnewRequestList(questions);
    setRequestTitleArray(
      new Array(Math.ceil(questions?.length / dataSize))
        .fill()
        .map((_, i) => i + 1)
    );
    setPaginationGroup(
      new Array(Math.ceil(questions.length / dataSize))
        .fill()
        .map((_, i) => i + 1)
        .slice(0, pageSize)
    );
    // eslint-disable-next-line
  }, [questions, dataSize]);

  const changeCurrentPage = (n) => {
    props.setCurrentPage(n);
  };

  const getPaginatedData = () => {
    const startIndex = props.currentPage * dataSize - dataSize;
    const endIndex = startIndex + +dataSize;
    return newRequestList.slice(startIndex, endIndex);
  };

  const setPreQ = (bool, question) => {
    setSidePanel({
      panel: bool,
      question: question,
    });
  };

  return (
    <>
      {getPaginatedData().length !== 0 ? (
        <>
          {!matches ? (
            <table className={`table table-sortable table-hoverable ${parent}`}>
              <thead>
                <tr>
                  {/* {props.checkbox === true && (
                    <th className="p-relative" style={{ width: 70 }}>
                      <input
                        className="form-check-input w-40 mb-2"
                        type="checkbox"
                        value=""
                        id="flexCheckDefault"
                        checked={select}
                        onChange={(event) => handleCheckbox(event)}
                      />
                    </th>
                  )} */}
                  <th scope="col">Question</th>
                  {getPaginatedData().find((x) => x?.imageUrl?.length > 10) && (
                    <th scope="col">Image</th>
                  )}
                  <th scope="col">Category</th>
                  <th scope="col">Difficulty</th>
                  <th scope="col">Skill</th>
                </tr>
              </thead>
              <tbody>
                {getPaginatedData().map((elem, i) => (
                  <QuestionCard
                    id={i + 1 + props.currentPage * dataSize - dataSize}
                    key={i}
                    parent={props.parent}
                    questionData={elem}
                    // getRows={getRows}
                    current={currentEvent}
                    // update={updateList}
                    checkbox={props.checkbox}
                    marks={props.marks}
                    editQuestionInQuesLib={props.editQuestionInQuesLib}
                    templateData={props.templateData}
                    editButton={props.editButton}
                    updateQuestion={props.update}
                    setPreQ={setPreQ}
                    remove={props.remove}
                    checkedQuestions={checkedQuestions}
                    setCheckedQuestions={setCheckedQuestions}
                    getQuestions={props.getData}
                    testCategory={props.testCategory}
                  />
                ))}
              </tbody>
            </table>
          ) : (
            getPaginatedData().map((elem, i) => (
              <QuestionCardMobile
                id={i + 1 + props.currentPage * dataSize - dataSize}
                key={i}
                parent={props.parent}
                questionData={elem}
                // getRows={getRows}
                current={currentEvent}
                // update={updateList}
                checkbox={props.checkbox}
                marks={props.marks}
                editQuestionInQuesLib={props.editQuestionInQuesLib}
                templateData={props.templateData}
                editButton={props.editButton}
                updateQuestion={props.update}
                setPreQ={setPreQ}
                remove={props.remove}
                checkedQuestions={checkedQuestions}
                setCheckedQuestions={setCheckedQuestions}
                getQuestions={props.getData}
                testCategory={props.testCategory}
              />
            ))
          )}
          {props.parent !== "testInfo" && (
            <div className="d-flex p-2 mt-2 align-items-center justify-content-between border-top">
              <div className="w-100-370 mb-point5-370">
                Showing{" "}
                {`${
                  getPaginatedData().length < 10
                    ? getPaginatedData().length + 10 * (props?.currentPage - 1)
                    : getPaginatedData().length * props?.currentPage
                }
                of ${questions.length}`}
              </div>
              <div className="ml-auto mx-auto-370 d-flex align-items-center">
                <Pagination
                  currentPage={props?.currentPage}
                  totalSize={props?.queCount}
                  sizePerPage={props.countPerPage || 10}
                  firstPageText="⟨⟨"
                  lastPageText="⟩⟩"
                  showFirstLastPages={true}
                  changeCurrentPage={changeCurrentPage}
                  theme="border-bottom"
                />
              </div>
            </div>
          )}
        </>
      ) : (
        <div>
          <div className="text-center p-3">
            <div className="avatar avatar-lg">
              <i className="fad fa-comment-slash"></i>
            </div>
            <div className="mt-3">No Questions Found </div>
          </div>
        </div>
      )}
      {/* {props.parent === "addQuestion" ||
      props.parent === "addQuestionViewTemplate" ? (
        <button
          type="submit"
          style={{
            float: "right",
            width: 80,
          }}
          className=" my-5 btn btn-sm"
          onClick={() => {
            handleSave();
          }}
          disabled={questions.length === 0 ? true : false}
        >
          Add
        </button>
      ) : null} */}

      {sidePanel.panel && (
        <QuestionPreview
          parent={props.parent}
          show={setPreQ}
          questionData={sidePanel.question}
          getQuestions={props.getData}
          editButton={props.editButton}
          updateQuestion={props.update}
          remove={props.remove}
          setSidePanel={setSidePanel}
          sidePanel={sidePanel}
        />
      )}
    </>
  );
};

export default QuestionTableQue;
