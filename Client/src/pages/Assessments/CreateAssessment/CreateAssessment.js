import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useRef } from "react";
import Loader from "../../../components/loader/Loader";
import { categoryData } from "../../../constants/constants";
import { getUserToken } from "../../../services/AuthServices";
import ModalView from "../../../components/modal/Modal";
import QuestionTable from "../../../components/questionTable/QuestionTableQue";
import NoData from "../../../components/NoData";
import Details from "./Details";
import { post } from "../../../services/ApiServices";
import {
  createAssessmentUrl,
  findAllProjectsUrl,
} from "../../../services/ServiceUrls";
import { testCreationSuccess } from "./TestSuccess";

const CreateAssessment = (props) => {
  const Token = getUserToken();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState("");
  const [tags, setTags] = useState([]);
  const [addPathQModal, setAddPathQModal] = useState("");
  const [questionList, setQuestionList] = useState([]);
  const [nValid, setNValid] = useState(true);
  const [suggestedDuration, setSuggestedDuration] = useState(0);
  const [tValid, setTValid] = useState(true);
  const [successValue, setSuccessValue] = useState(null);
  const [successValueQ, setSuccessValueQ] = useState(false);
  const [successData, setSuccessData] = useState({});
  const [details, setDetails] = useState({
    numberOfQtoAppear: 0,
    duration: "5",
    passScore: "45",
    qRandom: false,
    oRandom: false,
  });
  const [detailValidation, setDetailValidation] = useState({ dValid: true });
  const [testCategory, setTestCategory] = useState("");
  const [tab, setTab] = useState("questions");
  const [ShowAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [duplicateModal, setDuplicateModal] = useState({
    modal: false,
    questions: [],
    nonDuplicates: [],
    parent: "",
  });
  const [showMarks, setShowMarks] = useState(false);
  const [addQuestionButton, setAddQuestionButton] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [valCategory, setValCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");

  useEffect(() => {
    setSuggestedDuration(0);
    let d = 0;
    questionList.forEach((question) => {
      d = d + (Number(question.duration) + 15) * Number(question.takes);
    });
    setSuggestedDuration(d);
  }, [questionList]);

  useEffect(() => {
    successValue === false && navigate("/assessments");
    // eslint-disable-next-line
  }, [successValue]);

  useEffect(() => {
    setLoading(true);
    const getProject = async () => {
      post(findAllProjectsUrl, { companyId: Token.companyId })
        .then((response) => {
          const data = response.data.map((x) => ({
            projectId: x.value,
            projectName: x.label,
          }));
          setProjects(data);
          setLoading(false);
        })
        .catch((error) => {
          console.log("error", error);
          setLoading(false);
        });
      setLoading(false);
    };
    getProject();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const { data } = location.state;
    if (!!Object.keys(data).length) {
      setTestCategory(data.testCategory);
      setValCategory(data.testCategory);
      setTags(data.skills);
      setQuestionList([...data.questions]);
    }
    setAddQuestionButton(!!testCategory && !!difficulty);
    // eslint-disable-next-line
  }, [testCategory, difficulty, tags, template]);

  const formDetails = (data) => {
    setDetails({ ...details, ...data });
  };

  useEffect(() => {
    let n = 999999999999;
    if (testCategory === "MCQ") {
      n = Math.floor(
        Number(details.duration) /
          (difficulty === "Simple" ? 0.75 : difficulty === "Medium" ? 1 : 1.5)
      );
    } else if (testCategory === "OneWay") {
      n = 0;
      questionList.forEach((question) => {
        n =
          n +
          ((difficulty === "Simple" ? 60 : difficulty === "Medium" ? 90 : 120) +
            /*This is padding*/ 7);
      });
      n = n / 60 / questionList.length;
      n = Math.floor(Number(details.duration) / n);
    } else {
      n = 0;
      questionList.forEach((question) => {
        n =
          n +
          ((difficulty === "Simple" ? 60 : difficulty === "Medium" ? 90 : 120) +
            15);
      });
      n = n / 60 / questionList.length;
      n = Math.floor(Number(details.duration) / n);
    }
    formDetails({
      numberOfQtoAppear: n,
    });
    // eslint-disable-next-line
  }, [difficulty, details.duration, testCategory, questionList]);

  const handleChangeN = (e) => {
    var name = e.target.value;
    name !== ""
      ? setTemplate(name.charAt(0).toUpperCase() + name.slice(1))
      : setTemplate("");
  };

  const setAddQuestionModal = (modal, status, question) => {
    setAddPathQModal("");
    if (status === null) {
      setShowAddQuestionModal(modal);
      let nonDuplicates = question.questions.filter((Q) => {
        return questionList.filter((e) => e._id !== Q._id).length ===
          questionList.length
          ? Q
          : null;
      });
      if (question.questions.length !== nonDuplicates.length) {
        setDuplicateModal({
          modal: true,
          questions: question.questions,
          nonDuplicates: nonDuplicates,
          parent: `${question.templateName} template`,
        });
      } else {
        const newQuestions = [...question.questions, ...questionList];
        setQuestionList((state) => [...state, ...newQuestions]);
        toast.success(
          `${question.questions.length} questions added from "${question.templateName}" template successfully.`
        );
      }
    } else {
      if (Array.isArray(question)) {
        setShowAddQuestionModal(modal);
        let nonDuplicates = question.filter((Q) => {
          return questionList.filter((e) => e._id !== Q._id).length ===
            questionList.length
            ? Q
            : null;
        });
        if (question.length !== nonDuplicates.length) {
          setDuplicateModal({
            modal: true,
            questions: question,
            nonDuplicates: nonDuplicates,
            parent: "Question Library",
          });
        } else {
          const newQuestions = [...question, ...questionList];
          setQuestionList(newQuestions);
          toast.success(
            `${question.length} ${
              question.length > 1 ? "questions" : "question"
            } added from "Question Library" successfully.`
          );
        }
      } else {
        const newQuestions = [question, ...questionList];
        setShowAddQuestionModal(modal);
        setQuestionList(newQuestions);
      }
    }
  };

  const formValidation = () => {
    if (template === "untitled" || "" || !details.duration) {
      toast.error("Please enter all the mandatory detail.");
    } else if (details.difficulty?.length <= 0)
      toast.error("Please select difficulty");
    else if (
      template !== ("untitled" || "") &&
      !!details.duration &&
      !questionList.length
    ) {
      toast.error("At least one question required to create an assessment.");
    } else if (details.duration < 5)
      toast.error("Duration must be greater than or equal to 5 minutes");
    else if (details.passScore < 45) {
      toast.error("Passing score must be greater than or equal to 45%");
    } else {
      return true;
    }
  };

  const projectRef = useRef({});

  useEffect(() => {
    projectRef.current = projects.find((t) => t._id === selectedProject);
    // eslint-disable-next-line
  }, [selectedProject]);

  const handleSave = () => {
    if (formValidation()) {
      const test = {
        testName: template.trim(),
        difficulty: difficulty,
        projects: projects.filter((x) => x.projectId === selectedProject),
        questions: [...questionList],
        details: { ...details },
        createdBy: Token.id,
        updatedBy: Token.id,
        testCategory: testCategory,
        deleted: false,
      };
      postTest(test);
    }
  };

  const postTest = async (test) => {
    setLoading(true);
    post(createAssessmentUrl, test)
      .then((res) => {
        setLoading(false);
        setSuccessData({
          title: "Success",
          subTitle: "Assessment Created Successfully!",
          htmlTag: testCreationSuccess(test),
        });
        setSuccessValue(true);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const updateQuestion = (questionData, marks) => {
    setQuestionList(
      questionList.map((elem) => {
        if (elem._id === questionData?._id) {
          return {
            ...elem,
            question: questionData.question,
            type: questionData.type,
            skill: questionData.skill,
            options: questionData.options,
            answer: questionData.answer,
            difficulty: questionData.difficulty,
            duration: questionData.duration,
            takes: questionData.takes,
            marks: marks,
          };
        } else {
          return elem;
        }
      })
    );
  };

  const removeQuestion = (id) => {
    const updatedList = questionList.filter((question) => question._id !== id);
    setQuestionList(updatedList);
    toast.success("Question removed.");
  };

  return (
    <>
      {loading && <Loader />}
      <div className="row justify-content-center">
        <div className="col-lg-12">
          <div className="card card-flat card-borderless p-0 p-0-600 mb-3">
            <div
              className={`d-flex align-items-center justify-content-between border-bottom-gray2 ${
                !location.state.data.templateName && "pb-3"
              }`}
            >
              <div role="presentation" onClick={(e) => e.preventDefault()}>
                <ol
                  className="breadcrumb"
                  style={{ fontSize: "18px", marginBottom: "0px" }}
                >
                  <li className="breadcrumb-item">
                    <Link to="/assessments">Create Assessment</Link>
                  </li>
                  {/* <li className="breadcrumb-item">
                    <strong>{template}</strong>
                  </li> */}
                </ol>
                {!!location.state.data.templateName && (
                  <div className="mt-3">
                    You are using "{location.state.data.templateName}" template.
                  </div>
                )}
              </div>
            </div>
            <div className="d-none d-block-768 mb-2"></div>
            <hr className="mt-0 d-none d-block-1300 d-none-768" />
            <div className="row pt-5 justify-content-around">
              <div className="col-sm-6 my-1">
                <div className="form-floating">
                  <input
                    type="text"
                    className={`form-control ${!nValid ? "is-invalid" : ""}`}
                    value={template !== "untitled" ? template : ""}
                    placeholder="Assessment name"
                    id="testName"
                    onChange={handleChangeN}
                    required
                  />
                  <div id="testNameFeedback" className="invalid-feedback">
                    Please provide a valid test name.
                  </div>
                  <label for="testName">Assessment name*</label>
                </div>
              </div>

              <div className="col-sm-6 my-1">
                <div className="form-floating">
                  <select
                    className={`form-select font-14 ${
                      !tValid ? "is-invalid" : ""
                    }`}
                    id="tCategory"
                    value={testCategory}
                    onChange={(event) => {
                      setTestCategory(event.target.value);
                    }}
                    // required
                    disabled={
                      valCategory === "" && questionList.length === 0
                        ? false
                        : true
                    }
                  >
                    <option value="" selected>
                      Select
                    </option>
                    {categoryData.map((item, index) => (
                      <option
                        key={index}
                        value={item.value}
                        disabled={questionList.length > 0 ? true : false}
                      >
                        {item.SourceName}
                      </option>
                    ))}
                  </select>
                  <div id="tCategoryFeedback" className="invalid-feedback">
                    Please select a valid category
                  </div>
                  <label for="tCategory">Assessment Category*</label>
                </div>
              </div>
            </div>

            <div className="row pt-2 justify-content-start">
              <div className="col-sm-4 my-1">
                <div className="d-flex flex-column form-floating">
                  <select
                    onChange={(e) => {
                      setDifficulty(e.target.value);
                    }}
                    className="form-select font-14"
                    disabled={questionList.length === 0 ? false : true}
                  >
                    <option value="" selected>
                      Select
                    </option>
                    <option value="Simple">Simple</option>
                    <option value="Medium">Medium</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                  <label className="mb-2">Difficulty*</label>
                </div>
              </div>

              <div className="col-sm-4 my-1">
                <div className="form-floating">
                  <select
                    className={`form-select font-14 ${
                      !tValid ? "is-invalid" : ""
                    }`}
                    id="Project"
                    value={selectedProject}
                    onChange={(e) => {
                      setSelectedProject(e.target.value);
                    }}
                    disabled={
                      valCategory === "" && questionList?.length === 0
                        ? false
                        : true
                    }
                  >
                    <option value="" selected>
                      Select
                    </option>
                    {projects?.map((item, index) => (
                      <option
                        key={index}
                        value={item.projectId}
                        disabled={questionList?.length > 0 ? true : false}
                      >
                        {item.projectName}
                      </option>
                    ))}
                  </select>
                  <div id="tCategoryFeedback" className="invalid-feedback">
                    Please select a project
                  </div>
                  <label for="tCategory">Project</label>
                </div>
              </div>

              <div className="col-sm-4 my-1">
                <div className="form-floating">
                  <input
                    className={`form-control font-14 ${
                      !detailValidation.dValid ? "is-invalid" : ""
                    }`}
                    type="number"
                    min={5}
                    max={90}
                    step={5}
                    pattern={"^(?:[1-9]d*|0)$"}
                    onChange={(e) => {
                      if (e.target.value.length > 1)
                        if (Number(e.target.value) > 90) return;
                      formDetails({
                        duration:
                          e.target.value <= 0
                            ? e.target.value.substring(1)
                            : e.target.value,
                      });
                    }}
                    value={details.duration || ""}
                    // onKeyPress={inputKeyPressHandelr}
                  />

                  <div id="durationFeedback" className="invalid-feedback">
                    Please provide test duration.
                  </div>
                  <label for="duration">Duration (minutes)*</label>
                  {testCategory === "OneWay" && !!suggestedDuration && (
                    <p className="mt-1">
                      {/* *Suggested Duration : {Math.round(suggestedDuration / 60)}{" "}
                      minutes */}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {!addQuestionButton && (
              <div className="row p-4 bold">
                *Assessment category is required to add questions.
              </div>
            )}
            {/* {addQuestionButton && questionList.length > 0 && (
              <div className="row p-4 bold">
                {details.numberOfQtoAppear > questionList.length
                  ? questionList.length
                  : details.numberOfQtoAppear}{" "}
                questions will appear to every candidate.
              </div>
            )} */}
            <div className="d-flex-column d-block d-flex flex-row align-items-end my-3 justify-content-between border-bottom-gray2">
              <ul className="nav nav-tabs nav-tabs-tablet pt-1 justify-content-start">
                <li className="nav-item">
                  <button
                    type="button"
                    className={
                      tab === "questions"
                        ? "nav-link pb-3 mx-1 bg-transparent active"
                        : "nav-link pb-3 mx-1 bg-transparent"
                    }
                    onClick={() => setTab("questions")}
                  >
                    <div>Questions</div>
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className={
                      tab === "details"
                        ? "nav-link pb-3 mx-1 bg-transparent active"
                        : "nav-link pb-3 mx-1 bg-transparent"
                    }
                    onClick={() => setTab("details")}
                  >
                    <div className="d-flex">
                      Settings
                      {details.passScore < 45 && (
                        <span>
                          <div
                            className="ms-1"
                            style={{
                              backgroundColor: "red",
                              width: 10,
                              height: 10,
                              borderRadius: "50%",
                            }}
                          ></div>
                        </span>
                      )}
                    </div>
                  </button>
                </li>
              </ul>
              <div className="d-flex align-items-center mb-2">
                <button
                  type="button"
                  className="btn btn-sm"
                  disabled={!addQuestionButton}
                  onClick={() => setShowAddQuestionModal(true)}
                >
                  <i aria-hidden="true" className="fas fa-fw fa-plus"></i>
                  <span className="d-none-768 ml-2">Add question</span>
                </button>
              </div>
            </div>
            {tab === "questions" && !!questionList.length ? (
              <QuestionTable
                data={questionList}
                queCount={questionList.length}
                parent="createTest"
                update={updateQuestion}
                marks={showMarks}
                dataSize={5}
                pagination={"custom"}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                remove={removeQuestion}
                checkbox={false}
              />
            ) : tab === "questions" ? (
              <NoData component="questions" />
            ) : null}
            {tab === "details" && (
              <Details
                disable_Q_R={questionList.length < 2}
                updateForm={formDetails}
                data={details}
                testCategory={testCategory}
                // validation={detailValidation}
              />
            )}
          </div>

          {questionList.length > 0 && (
            <>
              <hr />
              <div className="d-flex  justify-content-end gap-2">
                <Link to="/assessments">
                  {" "}
                  <button type="button" className="btn btn-secondary">
                    Close
                  </button>
                </Link>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    handleSave();
                  }}
                >
                  Create
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <ModalView
        modalSize={"xl"}
        modalTitle={
          addPathQModal === ""
            ? "Add question"
            : addPathQModal === "fromScratch"
            ? "Create a question"
            : "Select question"
        }
        isModalOpen={ShowAddQuestionModal}
        setModalClose={setShowAddQuestionModal}
        setShowAddQuestionModal={setShowAddQuestionModal}
        setQuestionList={setQuestionList}
        isFrom={"addQuestionInAssessment"}
        tags={tags}
        testCategory={testCategory}
        setAddPathQModal={setAddPathQModal}
        difficulty={difficulty}
        questionsAlready={questionList}
        close={(modal, status, question) =>
          setAddQuestionModal(modal, status, question)
        }
      />

      <ModalView
        modalTitle={"Assessment Created!"}
        isModalOpen={successValue}
        setModalClose={setSuccessValue}
        isFrom={"CreateAssessmentSuccess"}
        dataToPass={successData}
      />
      <ModalView
        modalTitle={"Question Creation"}
        isModalOpen={successValueQ}
        setModalClose={setSuccessValueQ}
        isFrom={"CreateAssessmentSuccessQ"}
        dataToPass={successData}
      />
    </>
  );
};

export default CreateAssessment;
