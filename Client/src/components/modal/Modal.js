import React from "react";
import Modal from "react-bootstrap/Modal";
import AddQuestionInAssessment from "../createQuestion/AddQuestionInAssessment";
import FormSubmitSuccess from "../../components/FormSubmitSuccess";
const ModalView = (props) => {
  const {
    modalSize,
    modalTitle,
    isModalOpen,
    setModalClose,
    isFrom,
    dataToPass,
    setShowAddQuestionModal,
    setQuestionList,
  } = props;

  const onClose = () => {
    setModalClose(false);
  };

  return (
    <>
      <Modal size={modalSize} show={isModalOpen}>
        <div class="bl-modal-header">
          <h6 class="bl-modal-title">{modalTitle}</h6>
          <button
            type="button"
            data-dismiss="modal"
            aria-label="Close"
            onClick={onClose}
            class="close p-0 bl-modal-close-btn"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <Modal.Body>
          {isFrom === "Assessments" && <div>"Render the View here"</div>}
          {isFrom === "QuestionLibrary" && (
            <div>"Render question library View here"</div>
          )}
          {(isFrom === "CreateAssessmentSuccessQ" ||
            isFrom === "CreateAssessmentSuccess") && (
            <FormSubmitSuccess
              successData={dataToPass}
              closeModal={setModalClose}
            />
          )}

          {isFrom === "addQuestionInAssessment" && (
            <AddQuestionInAssessment
              parent={isFrom}
              tags={props.tags}
              testCategory={props.testCategory}
              setAddPathQModal={props.setAddPathQModal}
              difficulty={props.difficulty}
              questionsAlready={props.questionList}
              close={props.close}
              setShowAddQuestionModal={setShowAddQuestionModal}
              setQuestionList={setQuestionList}
            />
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};
export default ModalView;
