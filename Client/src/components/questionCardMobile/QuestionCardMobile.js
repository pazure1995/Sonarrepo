import React, { useState, useEffect } from "react";
// import EditQuestion from "../EditQuestion/EditQuestion";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const QuestionCardMobile = (props) => {
  const [ShowEditQuestionModal, setShowEditQuestionModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [iLoader, setILoader] = useState(false);
  //   const userProfile = useSelector((state) => state.userProfile.userProfile);

  useEffect(() => {
    if (
      props.current.parent === "super" ||
      props?.current?.id === props?.questionData
    ) {
      props.update(props.questionData, props.current.type, "child");
    }
    // eslint-disable-next-line
  }, [props.current]);

  const update = (modal, questionData) => {
    setShowEditQuestionModal(modal);
    if (props.parent === "questionViewTemplate") {
      props.updateQuestion(questionData);
    } else if (props.parent === "createTest") {
      props.updateQuestion(questionData);
    }
  };

  const deactivate = async () => {
    setILoader(true);
    if (
      props.parent === "questionViewTemplate" ||
      props.parent === "createTest"
    ) {
      props.remove(props.questionData._id);
      setILoader(false);
      setShowConfirmation(false);
    } else {
      let id = props.questionData._id;
      //   axios
      //     .put(
      //       `/question/${id}`,
      //       {
      //         ...props.questionData,
      //         deleted: true,
      //       },
      //       { headers: { token: userProfile.accessToken } }
      //     )
      //     .then((res) => {
      //       setILoader(false);
      //       setShowConfirmation(false);
      //       toast.success("Question removed.");
      //       props.getQuestions();
      //     })
      //     .catch((err) => {
      //       setILoader(false);
      //       toast.error("Question could not be deleted.");
      //     });
    }
  };

  return (
    <>
      {props.parent === "addQuestion" && props.checkbox === true && (
        <div className="d-flex flex-row">
          {" "}
          <input
            className="form-check-input p-2 mb-2  mr-2"
            type="checkbox"
            id="flexCheckDefault"
            checked={props.checkedQuestions.includes(props.questionData)}
            onChange={(event) => {
              // if (props.superChecked) {
              //   props.setCheckedQuestions([
              //     ...props.checkedQuestions,
              //     props.questionData._id,
              //   ]);
              // } else
              if (event.target.checked) {
                props.setCheckedQuestions([
                  ...props.checkedQuestions,
                  props.questionData,
                ]);
              } else {
                props.setCheckedQuestions(
                  props.checkedQuestions.filter(
                    (item) => item !== props.questionData
                  )
                );
              }
            }}
          />{" "}
          <span className="pt-1">Select</span>
        </div>
      )}
      <div className=" d-flex mb-4">
        <a
          onClick={(e) => {
            e.preventDefault();
          }}
          style={{ fontWeight: 400 }}
          href
          className="card col card-tag-bottom mr-2 card-lg p-2"
        >
          <div className="card-body pb-0">
            <div className="d-flex align-items-center">
              <span className="font-primary no-hover my-2 ">
                {props.questionData?.question}
              </span>
            </div>

            <hr />
            <div className="d-flex">
              <div className="w-75">
                <div className="d-flex mb-1 mt-1 ">
                  <span className="font-primary no-hover mb-2 ">
                    <span> Category :</span>
                    <span
                      className={
                        props.questionData.type === "MCQ"
                          ? "ml-2 tag tag-red1"
                          : props.questionData.type === "General"
                          ? "ml-2 tag tag-orange1"
                          : "ml-2 tag tag-blue1"
                      }
                    >
                      {" "}
                      <span style={{ fontWeight: 600 }}>
                        {" "}
                        {props.questionData?.type}
                      </span>
                    </span>
                  </span>
                </div>{" "}
                <div className="d-flex mb-1 mt-1">
                  <span className="font-primary no-hover my-2 ">
                    <span>
                      Difficulty :{" "}
                      <span
                        className={
                          props.questionData.difficulty === "Simple"
                            ? "tag tag-blue3"
                            : props.questionData.difficulty === "Medium"
                            ? "tag tag-green2"
                            : "tag tag-red2"
                        }
                      >
                        {props.questionData?.difficulty}
                      </span>
                    </span>
                  </span>
                </div>
                <div className=" mb-1 mt-1">
                  <span className="font-primary no-hover my-2 ">
                    <span>
                      Skill : <span>{props.questionData?.skill}</span>
                    </span>
                  </span>
                </div>
              </div>
              <div className="w-25">
                <div className="d-flex mb-1 mt-1">
                  <span className="font-primary no-hover mb-2 ">
                    {" "}
                    <button
                      type="button"
                      className="btn btn-text-accent"
                      onClick={(e) => {
                        e.preventDefault();
                        props.setPreQ(true, props.questionData);
                      }}
                    >
                      <div className="d-flex">
                        <span>
                          <i
                            className="far fa-link mr-1"
                            aria-hidden="true"
                          ></i>
                        </span>
                        <span>View</span>
                      </div>
                    </button>
                  </span>
                </div>{" "}
                {/* {(props.parent === "createTest" ||
                  userProfile.role === "admin" ||
                  (userProfile.role === "user" &&
                    props?.questionData?.createdBy?.companyId ===
                      userProfile.companyId)) &&
                  !props.editButton && (
                    <div className="d-flex mb-1 mt-1">
                      <span className="font-primary no-hover my-2 ">
                        <span>
                          <button
                            type="button"
                            className="btn btn-text-accent"
                            onClick={(e) => {
                              e.preventDefault();
                              setShowEditQuestionModal(true);
                            }}
                          >
                            <div className="d-flex ">
                              <span>
                                <i
                                  aria-hidden="true"
                                  className="fas fa-pencil-alt mr-1 fa-fw"
                                ></i>
                              </span>
                              <span>Edit</span>
                            </div>
                          </button>
                        </span>
                      </span>
                    </div>
                  )} */}
                {/* {(props.parent === "createTest" ||
                  userProfile.role === "admin" ||
                  (userProfile.role === "user" &&
                    props?.questionData?.createdBy?.companyId ===
                      userProfile.companyId)) &&
                  !props.editButton && (
                    <div className=" mb-1 mt-1">
                      <span className="font-primary no-hover my-2 ">
                        <span>
                          <button
                            type="button"
                            className="btn btn-text-accent"
                            onClick={(e) => {
                              e.preventDefault();
                              setShowConfirmation(true);
                            }}
                          >
                            <div className="d-flex">
                              <span>
                                <i
                                  aria-hidden="true"
                                  className="fas fa-trash-alt mr-1 fa-fw"
                                ></i>
                              </span>
                              <span>Remove</span>
                            </div>
                          </button>
                        </span>
                      </span>
                    </div>
                  )} */}
              </div>
            </div>
          </div>
        </a>
      </div>

      <Modal
        show={ShowEditQuestionModal}
        size="lg"
        className="modal fade"
        data-backdrop="static"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >
        <div className="modal-header" id="EditQuestionModal">
          <h6 className="modal-title" id="EditQuestionModalLabel">
            Want to edit questionppppp?
          </h6>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            onClick={() => setShowEditQuestionModal(false)}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <Modal.Body>
          {/* <EditQuestion
            close={update}
            parent={props.parent}
            questionData={props.questionData}
            editQuestionInQuesLib={props.editQuestionInQuesLib}
            templateData={props.templateData}
            getQuestions={props.getQuestions}
            testCategory={props.testCategory}
          /> */}
        </Modal.Body>
      </Modal>

      <Modal
        show={showConfirmation}
        onHide={showConfirmation === false}
        size="delete"
      >
        <div className="bl-modal-header">
          <button
            type="button"
            data-dismiss="modal"
            aria-label="Close"
            onClick={() => setShowConfirmation(false)}
            className="close p-0 bl-modal-close-btn"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <Modal.Body>
          <div className="bl-modal-body  text-center">
            <div className="avatar avatar-lg avatar-red2 mr-3">
              <i className="fas fa-exclamation-triangle fa-fw"></i>
            </div>
            <p className="text-center lead mt-3">
              Are you sure you want to remove this question?
            </p>
            <div className="text-center my-4">
              <button
                type="button"
                className="btn btn-secondary mr-3"
                data-dismiss="modal"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                style={{ width: 86 }}
                className="btn btn-primary"
                onClick={deactivate}
              >
                {iLoader ? (
                  <>
                    <i className="fa fa-spinner fa-spin"></i>
                  </>
                ) : (
                  "Remove"
                )}
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default QuestionCardMobile;
