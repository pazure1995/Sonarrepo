import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Dropzone from "react-dropzone";
import { toast } from "react-toastify";
import { post } from "../../services/ApiServices";
import { getUserId } from "../../services/AuthServices";
import { questionValidation } from "../../pages/questionLibrary/validation/validation";
import { getSkillsData } from "../../redux/actions/skills/skills";
import Modal from "react-bootstrap/Modal";
import Loader from "../loader/Loader";
import {
  createQuestionUrl,
  updateQuestionUrl,
} from "../../services/ServiceUrls";

const CreateQuestion = (props) => {
  const dispatch = useDispatch();
  const userId = getUserId();
  const [queImg, setQueImg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [optionCount, setOptionCount] = useState([1, 2]);
  const [count, setCount] = useState(3);
  const [options, setOptions] = useState([]);
  const [answer, setAnswer] = useState("");
  const [util, setUtil] = useState(false);
  const [imgRemoveConfirmation, setImgRemoveConfirmation] = useState(false);
  const [questionData, setquestionData] = useState({
    question: props.questionData?.question || "",
    type:
      props.testCategory?.length > 0
        ? props.testCategory
        : props?.questionData?.type || "",
    difficulty: props.questionData?.difficulty || "",
    answer: props.questionData?.answer || [],
    options: props.questionData?.options || [],
    skill: props.questionData?.skill || "",
    remark: props.questionData?.remark || "",
    imageUrl: props.questionData?.imageUrl || "",
    createdBy: userId,
    modifiedBy: userId,
    uploadedFileInfo: props.questionData?.uploadedFileInfo || "",
    deleted: props.questionData?.deleted || false,
    id: props.questionData?._id || "",
  });

  const queType = ["MCQ", "OneWay", "Multiline"];
  const queDifficulty = ["Simple", "Medium", "Advanced"];

  //get skills
  const { skillsData, skillsDataLoading } = useSelector(
    (state) => ({
      skillsData: state.getSkillsDataReducer.skillsData,
      skillsDataLoading: state.getSkillsDataReducer?.skillsDataLoading,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (!skillsData) {
      dispatch(getSkillsData());
    }
    // eslint-disable-next-line
  }, [skillsData]);

  //window width
  const [matches, setMatches] = useState(
    window.matchMedia("(max-width: 1200px)").matches
  );
  useEffect(() => {
    window
      .matchMedia("(max-width: 1200px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);

  const [validationError, setValidationError] = useState({
    question: false,
    type: false,
    difficulty: false,
    skill: false,
    answer: false,
    options: false,
  });

  const isValid = (field, value) => {
    if (value?.length > 0)
      setValidationError((state) => ({
        ...state,
        [field]: false,
      }));
    else
      setValidationError((state) => ({
        ...state,
        [field]: true,
      }));
  };

  //creating question
  const onSubmit = async (e) => {
    e.preventDefault();
    let res = questionValidation(questionData);
    if (res.validation?.fromError?.length > 0) {
      setValidationError({
        question: true,
        type: true,
        difficulty: true,
        skill: true,
      });
    } else {
      Object.keys(res.validation).map((x) =>
        res.validation[x].length > 0
          ? setValidationError((state) => ({ ...state, [x]: true }))
          : ""
      );
    }
    if (res.validationObj?.length > 0) {
      return toast.error(res.validationObj[0]);
    }
    setLoading(true);
    try {
      if (props.parent === "questionUpdate") {
        const res = await post(updateQuestionUrl, questionData);
        if (res.status === 200) {
          toast.success("Question updated successfully");
          props.setShowAddQuestionModal(false);
          props.setFetchQueData((state) => !state);
          props.setShowEditQuestionModal(false);
          props.close(false);
          setLoading(false);
        }
      } else {
        const res = await post(createQuestionUrl, questionData);
        if (res.status === 200) {
          props.setShowAddQuestionModal(false);
          props?.setQuestionList &&
            props?.setQuestionList((state) => [...state, res.data.data]);
          toast.success("New question added.");
          props.setFetchQueData((state) => !state);
          setLoading(false);
        }
      }
      return res;
    } catch (err) {
      setLoading(false);
      console.log("Error___", err);
    }
  };

  // Uploading image
  const onUploadHandler = async (e) => {
    setQueImg(true);
    const { name } = e[0];
    let type = name.split(".")[1];
    const reader = new FileReader();
    reader.readAsDataURL(e[0]);
    reader.onload = (event) => {
      setquestionData((state) => ({
        ...state,
        uploadedFileInfo: {
          fileName: name,
          base64: event.target.result,
          fileType: type,
        },
      }));
    };
  };

  const getAnswer = (data) => {
    setquestionData((state) => ({
      ...state,
      answer: [data],
    }));
  };
  const getOptions = (data) => {
    setquestionData((state) => ({
      ...state,
      options: data,
    }));
  };

  const insert = (arr, index, newItem) => {
    arr[index] = newItem;
    return arr;
  };

  useEffect(() => {
    if (props.parent === "questionUpdate") {
      const res = questionData?.options?.map((x, i) => i + 1);
      setOptionCount(res);
      setOptions(questionData?.options);
      setAnswer(questionData?.answer[0]);
    }
    // eslint-disable-next-line
  }, []);

  const onChangeOptions = (e) => {
    let id = e.target.id;
    // if()
    setOptions((prev) => insert(prev, id, e.target.value));
    setUtil(!util);
  };

  useEffect(() => {
    getOptions(options);
    // eslint-disable-next-line
  }, [options]);

  const moreOptionsBtn = (e) => {
    e.preventDefault();
    setOptionCount([...optionCount, count]);
    setCount(count + 1);
  };

  const cancelBtn = (e) => {
    e.preventDefault();
    setOptionCount((optionCount) =>
      optionCount.filter((_, index) => index !== optionCount.length - 1)
    );
    setOptions((options) =>
      options.filter((_, index) => index !== optionCount.length - 1)
    );
  };

  return (
    <>
      {loading && <Loader />}
      {skillsDataLoading && <Loader />}
      <div style={{ width: "90%", margin: "5% auto" }}>
        <form onSubmit={(e) => onSubmit(e)}>
          <div
            className={
              !matches
                ? "d-flex flex-row mb-3 card card-flat bg-gray4 "
                : "d-flex flex-column mb-3 card card-flat bg-gray4 "
            }
          >
            <div className={!matches ? "mr-2 p-2 w-75" : " p-2 w-100"}>
              <div className="d-flex flex-column ">
                <label className="mb-2 pt-0">What is your question?*</label>
                <div className="form-floating ">
                  <textarea
                    type="text"
                    className="form-control"
                    name="question"
                    aria-describedby="emailHelp"
                    placeholder="Type your question."
                    value={questionData.question}
                    rows={3}
                    onChange={(e) => {
                      isValid("question", e.target.value);
                      setquestionData((state) => ({
                        ...state,
                        question:
                          e.target.value.charAt(0).toUpperCase() +
                          e.target.value.slice(1),
                      }));
                    }}
                  />
                  <label>Question</label>
                </div>
              </div>
              {validationError.question && (
                <small style={{ color: "#ff0000" }}> Required field* </small>
              )}
            </div>
            <div className="mb-3 p-2">
              <div
                className="d-flex flex-column  "
                style={{ textAlign: "center" }}
              >
                <label className="pt-1 ">Upload image</label>
                <div className="d-flex my-2 justify-content-between">
                  {(queImg || questionData.imageUrl !== "") && (
                    <div style={{ margin: "auto" }}>
                      <i
                        onClick={() => {
                          setImgRemoveConfirmation(true);
                        }}
                        style={{ cursor: "pointer", fontSize: 20 }}
                        className=" fas fa-trash-alt mr-1 fa-fw"
                      ></i>
                    </div>
                  )}
                  <div className="form-floating m-auto  w-100">
                    <Dropzone
                      onDrop={onUploadHandler}
                      multiple={false}
                      disabled={
                        questionData?.uploadedFileInfo !== "" ? true : false
                      }
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div {...getRootProps()}>
                          <button
                            type="button"
                            className="btn  w-85 btn-secondary"
                            disabled={
                              questionData?.uploadedFileInfo !== ""
                                ? true
                                : false
                            }
                          >
                            <i className="far fa-cloud-upload mr-1 fa-fw"></i>
                            {questionData?.uploadedFileInfo !== ""
                              ? "Uploaded"
                              : "Upload"}
                          </button>
                          <input type="file" {...getInputProps()} />
                        </div>
                      )}
                    </Dropzone>
                  </div>
                  {(queImg || questionData.imageUrl !== "") && (
                    <div style={{ margin: "auto " }}>
                      <i
                        className="fas ml-1 fa-check-circle"
                        style={{
                          color: "green",
                          fontSize: 20,
                        }}
                      ></i>
                    </div>
                  )}
                </div>
                <small>Accepted file types: JPG, JPEG, PNG</small>
              </div>
            </div>

            <Modal show={imgRemoveConfirmation} style={{ zIndex: 999999 }}>
              <div>
                <div className="bl-modal-body text-center">
                  <div className="avatar avatar-lg avatar-red2 mr-3">
                    <i class="fas fa-exclamation-triangle fa-fw"></i>
                  </div>
                  <p className="text-center lead mt-3">
                    Are you sure you want to delete this image?
                    <small className="m-2 bold">
                      {questionData?.uploadedFileInfo?.fileName}
                    </small>
                  </p>
                  <div class="text-center my-4">
                    <button
                      type="button"
                      className="btn btn-secondary mr-3"
                      data-dismiss="modal"
                      onClick={() => setImgRemoveConfirmation(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="close p-0 bl-modal-close-btn"
                      data-dismiss="modal"
                      aria-label="Close"
                      onClick={() => setImgRemoveConfirmation(false)}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        setImgRemoveConfirmation(false);
                        setQueImg(false);
                        setquestionData({
                          ...questionData,
                          uploadedFileInfo: "",
                        });
                      }}
                    >
                      Confirm Delete
                    </button>
                  </div>
                </div>
              </div>
            </Modal>
          </div>

          <div
            className={
              !matches
                ? "d-flex card mb-3  card-flat bg-gray4 flex-row"
                : "d-flex card mb-3  card-flat bg-gray4 flex-column"
            }
          >
            <div className={!matches ? "w-50 mr-2 p-2" : "w-100 mr-2 p-2"}>
              <div className="d-flex form-floating flex-column">
                <select
                  value={questionData.type}
                  onChange={(e) => {
                    isValid("type", e.target.value);
                    setquestionData((state) => ({
                      ...state,
                      type: e.target.value,
                    }));
                  }}
                  className="form-select font-14"
                  disabled={
                    props?.testCategory !== "General" &&
                    props.parent === "createAssessment"
                      ? true
                      : false
                  }
                >
                  <option value="">Select a question category</option>
                  {queType.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <label className="mb-2">Question category*</label>
              </div>
              {validationError.type && (
                <small style={{ color: "#ff0000" }}> Required field* </small>
              )}
            </div>

            <div className={!matches ? " w-50 p-2" : "w-100 p-2"}>
              <div className="d-flex flex-column form-floating">
                <select
                  onChange={(e) => {
                    isValid("difficulty", e.target.value);
                    setquestionData((state) => ({
                      ...state,
                      difficulty: e.target.value,
                    }));
                  }}
                  className="form-select font-14"
                  disabled={props.parent === "addQuestion"}
                  value={questionData.difficulty}
                >
                  <option value="">Select a difficulty</option>
                  {queDifficulty.map((x) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </select>
                <label className="mb-2">Difficulty*</label>
              </div>
              {validationError.difficulty && (
                <small style={{ color: "#ff0000" }}> Required field* </small>
              )}
            </div>
          </div>
          {questionData.type === "MCQ" && (
            <>
              <div className="card card-flat bg-gray4 mb-3 p-2">
                <label className="mb-2">Options (Maximum 4)*</label>
                {optionCount?.map((elem, idx) => (
                  <div className="mb-3" key={idx}>
                    <div className="form-floating d-flex">
                      <input
                        type="text"
                        className="form-control"
                        name="option"
                        placeholder="Type an answer"
                        id={idx}
                        value={options[idx]}
                        onChange={(e) => {
                          isValid("options", e.target.value);
                          onChangeOptions(e);
                        }}
                      />
                      <label>Enter a possible answer</label>
                    </div>
                  </div>
                ))}

                {validationError?.options && (
                  <small style={{ color: "#ff0000" }}> Required field* </small>
                )}
                {options.filter((x) => x.length > 0)?.length < 2 && (
                  <small style={{ color: "#ff0000" }}>
                    At least 2 options are Required*
                  </small>
                )}

                <div style={{ textAlign: "center" }}>
                  <button
                    className="btn btn-primary"
                    onClick={moreOptionsBtn}
                    disabled={optionCount?.length >= 4 ? true : false}
                  >
                    {!matches ? "+ Add options" : "+"}
                  </button>
                  <button
                    className="btn btn-coral ml-2"
                    disabled={optionCount?.length <= 2 ? true : false}
                    onClick={(e) => cancelBtn(e)}
                  >
                    {!matches ? "- Remove options" : "-"}
                  </button>
                </div>
              </div>
              <div className="card card-flat bg-gray4 mb-3 p-2">
                <div className="form-floating ">
                  <select
                    value={answer}
                    onChange={(e) => {
                      isValid("answer", e.target.value);
                      setAnswer(e.target.value);
                      getAnswer(e.target.value);
                    }}
                    className="form-select"
                  >
                    <option value="">Select a correct answer</option>
                    {options?.map((elem, idx) => (
                      <option value={options[idx]} key={idx}>
                        {options[idx]}
                      </option>
                    ))}
                  </select>
                  <label>Select correct answer. *</label>
                </div>
                <small>
                  From the entered option select one correct answer.
                </small>
                {validationError.answer && (
                  <small style={{ color: "#ff0000" }}> Required field* </small>
                )}
              </div>
            </>
          )}

          <div className="card card-flat bg-gray4 mb-3 p-2">
            <div className="form-floating ">
              <select
                value={questionData.skill}
                onChange={(e) => {
                  isValid("skill", e.target.value);
                  setquestionData((state) => ({
                    ...state,
                    skill: e.target.value,
                  }));
                }}
                className="form-select font-14"
              >
                <option value="">Select a skill</option>
                {props.parent === "addQuestion"
                  ? skillsData?.map((item) => (
                      <option key={item._id} value={item.skill}>
                        {item.skill}
                      </option>
                    ))
                  : skillsData?.map((item) => (
                      <option key={item._id} value={item.skill}>
                        {item.skill}
                      </option>
                    ))}
              </select>
              <label className="mb-2">Select a skill*</label>
            </div>
            {validationError.skill && (
              <small style={{ color: "#ff0000" }}> Required field* </small>
            )}
          </div>
          <div className="card card-flat bg-gray4 mb-3 p-2">
            <div className="d-flex flex-column ">
              <label className="mb-2 pt-0">Hint</label>
              <div className="form-floating">
                <textarea
                  type="text"
                  className="form-control"
                  name="remark"
                  aria-describedby="emailHelp"
                  placeholder="Type your question."
                  value={questionData.remark}
                  onChange={(e) =>
                    setquestionData((state) => ({
                      ...state,
                      remark: e.target.value,
                    }))
                  }
                />
                <label>Want to provide any hints?</label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            style={{ float: "right", width: 90 }}
            className=" mb-4 btn btn-sm"
          >
            Save
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateQuestion;
