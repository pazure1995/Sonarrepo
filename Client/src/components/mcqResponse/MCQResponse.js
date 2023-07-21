import React, { useState, useEffect } from "react";

const MCQResponse = (props) => {
  const [optionCount, setOptionCount] = useState([1, 2]);
  const [count, setCount] = useState(3);
  const [options, setOptions] = useState([]);
  const [answer, setAnswer] = useState("");
  const [util, setUtil] = useState(false); //util state is there to update the dynamic options in UI, basically just to reload the UI
  const [matches, setMatches] = useState(
    window.matchMedia("(max-width: 600px)").matches
  );
  useEffect(() => {
    window
      .matchMedia("(max-width: 600px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);

  const insert = (arr, index, newItem) => {
    arr[index] = newItem;
    return arr;
  };

  useEffect(() => {
    if (props.parent === "questionUpdate") {
      const res = props.question?.options?.map((x, i) => i + 1);
      setOptionCount(res);
      setOptions(props.question?.options);
      setAnswer(props.question?.answer[0]);
    }
    // eslint-disable-next-line
  }, []);

  const onChangeOptions = (e) => {
    let id = e.target.id;
    setOptions((prev) => insert(prev, id, e.target.value));
    setUtil(!util);
  };

  useEffect(() => {
    props.options(options);
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
      <div className="card card-flat bg-gray4 mb-3 p-2">
        <label className="mb-2">Give options. (Maximum 4)</label>
        {optionCount?.map((elem, idx) => (
          <div className="mb-3" key={idx}>
            <div className="form-floating d-flex">
              <input
                type="text"
                className="form-control"
                name="option"
                placeholder="Type an answer."
                id={idx}
                value={options[idx]}
                onChange={(e) => onChangeOptions(e)}
              />
              <label>Enter a possible answer.</label>
            </div>
          </div>
        ))}

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
              setAnswer(e.target.value);
              props.answer(e.target.value);
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
        <small>From the entered option select one correct answer.</small>
      </div>
    </>
  );
};

export default MCQResponse;
