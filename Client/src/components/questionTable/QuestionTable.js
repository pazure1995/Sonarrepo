import React, { useEffect, useState } from "react";
import QuestionCard from "../questionCard/QuestionCard";
import QuestionCardMobile from "../questionCardMobile/QuestionCardMobile";
import QuestionPreview from "../questionPreview/QuestionPreview";
import Pagination from "react-pagination-js";
import "react-pagination-js/dist/styles.css";
import { post } from "../../services/ApiServices";
import { removeMultipleQuestionsUrl } from "../../services/ServiceUrls";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import Loader from "../loader/Loader";

const QuestionTable = (props) => {
  const questionList = props?.data;
  const [currentEvent, setCurrentEvent] = useState({});
  const [select, setSelect] = useState(false);
  const [global, setGlobal] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [checkedQuestions, setCheckedQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidePanel, setSidePanel] = useState({
    panel: false,
    question: {},
  });

  //window width
  const [matches, setMatches] = useState(
    window.matchMedia("(max-width: 1200px)").matches
  );
  useEffect(() => {
    window
      .matchMedia("(max-width: 1200px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);

  let dataSize = props?.dataSize;

  const [prevQueData, setPrevQueData] = useState([]);

  useEffect(() => {
    if (props?.data?.length > 0) {
      let tempArr = [...prevQueData, ...props?.data];
      let temp = [
        ...new Map(tempArr.map((item) => [item["_id"], item])).values(),
      ];
      setPrevQueData(temp);
    }
    // eslint-disable-next-line
  }, [props?.data]);

  console.log("prevQueData_______________44", prevQueData);

  useEffect(() => {
    if (!!props?.testCategory || !!props?.difficulty) {
      var newQuestionList = props?.data?.filter((item) => {
        const includeSkill = props?.tags?.includes(item.skill);
        const sameCategory =
          props.testCategory === "General"
            ? true
            : props.testCategory === item.type;
        const similarDifficulty = props.difficulty === item.difficulty;

        if (!props?.tags && !props?.testCategory && !props?.difficulty)
          return item;
        else if (!props?.tags && !props?.testCategory)
          return similarDifficulty ? item : null;
        else if (!props?.testCategory && !props?.difficulty)
          return includeSkill ? item : null;
        else if (!props?.difficulty && !props?.tags)
          return sameCategory ? item : null;
        else if (!props?.tags)
          return similarDifficulty && sameCategory ? item : null;
        else if (!props?.testCategory)
          return includeSkill && similarDifficulty ? item : null;
        else if (!props?.difficulty)
          return includeSkill && sameCategory ? item : null;
        else
          return includeSkill && sameCategory && similarDifficulty
            ? item
            : null;
      });
      setQuestions(newQuestionList);
    } else {
      setQuestions(props.data);
    }
    // eslint-disable-next-line
  }, [props.data]);

  useEffect(() => {
    if (currentEvent.parent === "super") {
      setSelect(currentEvent.type);
      updateList(questions, currentEvent.type, "super");
    } else {
      global === questions?.length && global !== 0
        ? setSelect(true)
        : setSelect(false);
    }
    // eslint-disable-next-line
  }, [currentEvent]);

  useEffect(() => {}, []);

  const getRows = (id, type, parent) => {
    const eventObj = {
      id: id,
      type: type,
      parent: parent,
    };
    setCurrentEvent(eventObj);
    if (parent === "super") {
      type ? setGlobal(props.data.length) : setGlobal(0);
    } else if (parent === "child") {
      type ? setGlobal(global + 1) : setGlobal(global - 1);
    }
  };

  console.log("checkedQuestions", checkedQuestions);

  const updateList = (data, bool, origin) => {
    console.log("data", data);
    console.log("bool", bool);
    console.log("origin", origin);
    console.log("checkedQuestions", checkedQuestions);

    if (origin === "super") {
      bool ? setCheckedQuestions([...data]) : setCheckedQuestions([]);
    } else if (origin === "child") {
      if (!bool) {
        var index = checkedQuestions.indexOf(data);
        if (index !== -1) {
          const newCheckedList = checkedQuestions.filter(function (item) {
            return item !== checkedQuestions[index];
          });
          setCheckedQuestions([...newCheckedList]);
        }
      } else {
        setCheckedQuestions([data, ...checkedQuestions]);
      }
    }
  };

  const handleCheckbox = (event) => {
    getRows(questions, event.target.checked, "super");
  };

  const handleSave = () => {
    props.close(false, true, checkedQuestions);
  };

  const setPreQ = (bool, question) => {
    setSidePanel({
      panel: bool,
      question: question,
    });
  };

  const changeCurrentPage = (n) => {
    props.setCurrentPage(n);
  };

  const [count, setCount] = useState({
    current: 0,
    total: 0,
  });

  const pageCount = () => {
    let n =
      questionList?.length < props.countPerPage
        ? (Number(props?.currentPage) - 1) * props.countPerPage +
          Number(questionList?.length)
        : Number(props?.currentPage) * Number(questionList?.length);

    if (n)
      setCount((state) => ({
        ...state,
        current: n,
      }));

    if (props?.queCount) {
      setCount((state) => ({
        ...state,
        total: props?.queCount,
      }));
    }
  };

  useEffect(() => {
    pageCount();
    setCurrentEvent({ ...currentEvent, type: false });
    // eslint-disable-next-line
  }, [props?.currentPage, questionList]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const deleteMultipleQuestions = async () => {
    setLoading(true);
    let questionsId = checkedQuestions?.map((x) => x._id);
    try {
      const resp = await post(removeMultipleQuestionsUrl, {
        questionsIds: questionsId,
      });
      if (resp.status === 200) {
        setLoading(false);
        toast.success("Questions deleted successfully");
        props.setFetchQueData((state) => !state);
      }
      setCheckedQuestions([]);
    } catch (err) {
      setLoading(false);
      toast.error("Questions are not deleted, try again later");
      console.log("Error : ", err);
    }
  };

  return (
    <>
      {loading && <Loader />}
      {questionList !== undefined && questionList?.length !== 0 ? (
        <>
          {!matches ? (
            <table className={`table table-hover`}>
              <thead>
                <tr>
                  {props.checkbox === true && (
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
                  )}
                  <th scope="col">Question</th>
                  {questionList?.filter((x) => x?.imageUrl?.length > 10)
                    .length > 0 && <th scope="col">Image</th>}
                  <th scope="col" style={{ width: 100 }}>
                    Category
                  </th>
                  <th scope="col" style={{ width: 100 }}>
                    Difficulty
                  </th>
                  <th scope="col" style={{ width: 100 }}>
                    Skill
                  </th>
                </tr>
              </thead>
              <tbody role="button">
                {questionList?.map((elem, i) => (
                  <QuestionCard
                    id={i + 1 + props.currentPage * dataSize - dataSize}
                    key={i}
                    parent={props.parent}
                    questionList={questionList}
                    questionData={elem}
                    getRows={getRows}
                    current={currentEvent}
                    update={updateList}
                    checkbox={props.checkbox}
                    editQuestionInQuesLib={props.editQuestionInQuesLib}
                    templateData={props.templateData}
                    editButton={props.editButton}
                    updateQuestion={props.update}
                    setPreQ={setPreQ}
                    remove={props.remove}
                    checkedQuestions={checkedQuestions}
                    setCheckedQuestions={setCheckedQuestions}
                    // getQuestions={props.getData}
                    testCategory={props.testCategory}
                  />
                ))}
              </tbody>
            </table>
          ) : (
            questionList?.map((elem, i) => (
              <QuestionCardMobile
                id={i + 1 + props.currentPage * dataSize - dataSize}
                key={i}
                parent={props.parent}
                questionData={elem}
                getRows={getRows}
                current={currentEvent}
                update={updateList}
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
                // getQuestions={props.getData}
                testCategory={props.testCategory}
              />
            ))
          )}

          {props.parent !== "testInfo" && (
            <div className="d-flex p-2 mt-2 align-items-center justify-content-between border-top">
              <div>
                <p>{`Showing ${count.current} of ${count.total}`}</p>
              </div>
              <div>
                {/* <button className="btn-sm btn-danger">Delete</button> */}
                {checkedQuestions.length > 0 && (
                  <button
                    type="button"
                    class="btn btn-danger btn-sm"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="Delete selected questions"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Delete
                  </button>
                )}
              </div>
              {/* <div className="ml-auto mx-auto-370 d-flex align-items-center"> */}
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
              {/* </div> */}
            </div>
          )}

          <Modal show={isModalOpen} style={{ zIndex: 999999 }}>
            <div>
              <div className="bl-modal-body text-center">
                <div className="avatar avatar-lg avatar-red2 mr-3">
                  <i class="fas fa-exclamation-triangle fa-fw"></i>
                </div>
                <p className="text-center lead mt-3">
                  {`Are you sure you want to delete selected ${
                    checkedQuestions.length > 1 ? "questions" : "question"
                  }?`}
                  <small className="m-2 bold">
                    {/* {questionData?.uploadedFileInfo?.fileName} */}
                  </small>
                </p>
                <div class="text-center my-4">
                  <button
                    type="button"
                    className="btn btn-secondary mr-3"
                    data-dismiss="modal"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="close p-0 bl-modal-close-btn"
                    data-dismiss="modal"
                    aria-label="Close"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setIsModalOpen(false);
                      deleteMultipleQuestions();
                    }}
                  >
                    Confirm Delete
                  </button>
                </div>
              </div>
            </div>
          </Modal>
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
      {props.parent === "addQuestionInAssessment" ||
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
          disabled={questions?.length === 0 ? true : false}
        >
          Add
        </button>
      ) : null}

      {sidePanel.panel && (
        <QuestionPreview
          parent={props.parent}
          show={setPreQ}
          questionData={sidePanel.question}
          editButton={props.editButton}
          updateQuestion={props.update}
          remove={props.remove}
          setSidePanel={setSidePanel}
          sidePanel={sidePanel}
          setFetchQueData={props.setFetchQueData}
        />
      )}
    </>
  );
};

export default QuestionTable;
