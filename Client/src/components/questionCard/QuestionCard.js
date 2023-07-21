import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";

const QuestionCard = (props) => {
  const [score, setScore] = useState();

  useEffect(() => {
    if (
      props.current.parent === "super" ||
      props?.current?.id === props?.questionData
    ) {
      props.update(props.questionData, props.current.type, "child");
    }
    // eslint-disable-next-line
  }, [props.current]);

  useEffect(() => {
    if (!!props.updateQuestion) {
      !!score && props.updateQuestion(props.questionData, score);
    }
    // eslint-disable-next-line
  }, [score]);

  useEffect(() => {
    props.questionData.marks ? setScore(props.questionData.marks) : setScore();
  }, [props.questionData]);

  const [onImgHover, setOnImgHover] = useState(false);

  function MouseOver() {
    setOnImgHover(true);
  }

  return (
    <>
      <tr style={{ lineHeight: "25px" }}>
        {props.checkbox === true && (
          <td className="p-relative " style={{ width: 70 }}>
            <input
              className="form-check-input w-40 mb-1"
              type="checkbox"
              id="flexCheckDefault"
              checked={props.checkedQuestions.includes(props.questionData)}
              onChange={(event) => {
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
            />
          </td>
        )}

        <td
          className="p-relative"
          style={{
            maxWidth: 270,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          onClick={() => props.setPreQ(true, props.questionData)}
        >
          <span className="font-primary no-hover">
            {props.questionData?.question}
          </span>
        </td>
        {props.questionList?.filter((x) => x?.imageUrl?.length > 10).length >
          0 && (
          <td
            style={{ width: "80px" }}
            onClick={() => props.setPreQ(true, props.questionData?.imageUrl)}
          >
            <div>
              <span className={""}>
                <span style={{ fontWeight: 600 }}>
                  {props.questionData?.imageUrl?.length > 10 && (
                    <img
                      onMouseOver={MouseOver}
                      src={props.questionData?.imageUrl}
                      alt=""
                      className="border"
                      width={30}
                    />
                  )}
                </span>
              </span>
            </div>
          </td>
        )}
        <td
          style={{ width: "80px" }}
          onClick={() => props.setPreQ(true, props.questionData)}
        >
          <div>
            <span
              className={
                props.questionData.type === "MCQ"
                  ? "tag tag-red1"
                  : props.questionData.type === "OneWay"
                  ? "tag tag-blue1"
                  : "tag tag-orange1"
              }
            >
              <span style={{ fontWeight: 600 }}>
                {" "}
                {props.questionData?.type}
              </span>
            </span>
          </div>
        </td>
        <td
          style={{ width: "80px" }}
          onClick={() => props.setPreQ(true, props.questionData)}
        >
          <div>
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
          </div>
        </td>
        <td
          style={{ width: "80px" }}
          onClick={() => props.setPreQ(true, props.questionData)}
        >
          <div>{props.questionData?.skill}</div>
        </td>
        {/* {props.marks === true && (
          <td className="" style={{ width: "150px" }}>
            <div className="col-sm-5 w-100">
              <input
                type="number"
                value={score}
                className="form-control"
                id="templateTitle"
                placeholder="Marks"
                min="1"
                max="5"
                onChange={(e) => setScore(e.target.value)}
              />
            </div>
          </td>
        )} */}
      </tr>

      <Modal
        show={onImgHover}
        size="lg"
        className="modal fade"
        data-backdrop="static"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >
        <div
          onMouseOut={() => setOnImgHover(false)}
          className="modal-header"
          id="CreateQuestionModal"
        >
          <div></div>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            onClick={() => setOnImgHover(false)}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <Modal.Body>
          <div className="container" onMouseOut={() => setOnImgHover(false)}>
            <div className="m-0 p-0 ">
              <img
                src={props.questionData?.imageUrl}
                alt="Question Img"
                className="img-fluid m-0 p-0"
                width={"100%"}
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default QuestionCard;
