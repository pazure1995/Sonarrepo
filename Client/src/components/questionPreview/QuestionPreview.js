import React, { useState } from "react";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import CreateQuestion from "../createQuestion/CreateQuestion";
import { post } from "../../services/ApiServices";
import { removeQuestionUrl } from "../../services/ServiceUrls";

const QuestionPreview = (props) => {
  const [ShowEditQuestionModal, setShowEditQuestionModal] = useState(false);
  const [iLoader, setILoader] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const close = () => {
    props.show(false, {});
  };

  const onClickRemoveQuestion = async (id) => {
    setILoader(true);
    const res = await post(removeQuestionUrl, { id });
    if (res.status === 200) {
      toast.success("Question removed successfully");
      props.setFetchQueData((state) => !state);
      setShowConfirmation(false);
      setILoader(false);
      close();
    } else {
      setShowConfirmation(false);
      setILoader(false);
      close();
    }
  };

  let index = 1;
  // if (props.questionData?.type === "MCQ")
  return (
    <>
      <div className="view-panel show">
        <div className="view-panel-header">
          <div className="px-3 py-2 overflow-auto">
            <button type="button" onClick={close} className="btn btn-icon">
              <i aria-hidden="true" className="fal fa-times"></i>
            </button>

            <div className="mt-2">
              <div style={{ marginTop: "30px" }}>
                <div className="mb-2">
                  <span className="font-14 bold">Question</span>{" "}
                  {
                    <>
                      <button
                        type="button"
                        className="btn btn-text-accent py-1"
                        style={{ float: "right" }}
                        onClick={() => {
                          setShowEditQuestionModal(true);
                        }}
                      >
                        <div className="d-flex">
                          <span>
                            <i
                              aria-hidden="true"
                              className="fas fa-pencil-alt mr-1 fa-fw"
                            ></i>
                          </span>
                          <span>Edit</span>
                        </div>
                      </button>{" "}
                      <button
                        type="button"
                        className="btn btn-text-accent py-1"
                        style={{ float: "right" }}
                        onClick={() => {
                          setShowConfirmation(true);
                        }}
                      >
                        <div className="d-flex ">
                          <span>
                            <i
                              aria-hidden="true"
                              className="fas fa-trash-alt mr-1 fa-fw"
                            ></i>
                          </span>
                          <span>Remove</span>
                        </div>
                      </button>
                    </>
                  }
                </div>
                <span className="font-primary no-hover">
                  {props.questionData?.question}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="view-panel-body">
          <div className="mx-2">
            {props?.questionData?.imageUrl && (
              <div className="py-2 m-2 ps-5 ">
                <img
                  width={450}
                  src={props.questionData?.imageUrl}
                  alt="que_img"
                />
              </div>
            )}
            <div className="d-flex justify-content-between my-4">
              <div>
                <span>Category: </span>
                <span
                  style={{ fontWeight: 600 }}
                  className={
                    props.questionData?.type === "MCQ"
                      ? "tag tag-red1"
                      : props.questionData?.type === "OneWay"
                      ? "tag tag-blue1"
                      : "tag tag-orange1"
                  }
                >
                  {props.questionData?.type}
                </span>
              </div>
              <div>
                <span>Difficulty: </span>
                <span
                  className={
                    props.questionData?.difficulty === "Simple"
                      ? "tag tag-blue3"
                      : props.questionData?.difficulty === "Medium"
                      ? "tag tag-green2"
                      : "tag tag-red1"
                  }
                >
                  {props.questionData?.difficulty}
                </span>
              </div>
              <div>
                <span>Skill: </span>
                <span className="">{props.questionData?.skill}</span>
              </div>
            </div>
            <hr />

            {props.questionData?.type === "MCQ" && (
              <div>
                <h6 className="font-14 mb-4">Options:</h6>
                {props.questionData?.options?.map((x, i) => (
                  <div key={i}>
                    <div className="mx-2">
                      <div className="d-flex justify-content-between">
                        <div className="font-14">
                          <strong className="mr-2">{index++}.</strong>
                          <span className="font-primary no-hover">{x}</span>
                        </div>
                        <div>
                          {x === props.questionData?.answer[0] && (
                            <i
                              className="fas fa-check-circle"
                              style={{ color: "green", fontSize: 20 }}
                            ></i>
                          )}
                        </div>
                      </div>
                    </div>

                    <hr />
                  </div>
                ))}
              </div>
            )}

            {props.questionData?.remark && (
              <div className="my-3">
                <h6 className="font-14 mb-4">Hint:</h6>
                <span className="font-14">{props.questionData?.remark}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      {/*  */}
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
            Edit Question
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
          <CreateQuestion
            close={close}
            parent="questionUpdate"
            questionData={props.questionData}
            setFetchQueData={props.setFetchQueData}
            setShowEditQuestionModal={setShowEditQuestionModal}
          />
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
                onClick={() => {
                  onClickRemoveQuestion(props.questionData?._id);
                }}
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

export default QuestionPreview;
