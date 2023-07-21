import React, { useEffect, useState } from "react";

function Details(props) {
  const [qRandom, setQRandom] = useState(false);
  const [oRandom, setORandom] = useState(false);
  const [passScore, setPassScore] = useState("45");

  useEffect(() => {
    var data = {
      passScore: passScore,
      qRandom: qRandom,
      oRandom: oRandom,
    };
    props.updateForm(data);
    // eslint-disable-next-line
  }, [passScore, qRandom, oRandom]);

  useEffect(() => {
    if (!!Object.keys(props.data).length) {
      setPassScore(props.data.passScore);
      setQRandom(props.data.qRandom);
      setORandom(props.data.oRandom);
    }
  }, []);

  return (
    <div className="row justify-content-center">
      <div className="col-lg-12">
        <div className="card card-flat card-borderless p-0 p-0-600 mb-2">
          <div className="row pt-3 justify-content-start">
            {/* <div className="col-sm-4">
              <div className="form-floating">
                <div className="card card-flat p-1">
                  <div className="d-flex align-items-center justify-content-between m-2">
                    <h6 className="pt-1 font-regular font-primary font-gray1 ">
                      <div className="d-flex">Question randomize</div>
                    </h6>
                    <div className="form-check form-switch">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={qRandom}
                        disabled={props?.disable_Q_R}
                        onChange={(e) => setQRandom(e.target.checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
            {/* props.testCategory === "MCQ"  */}
            {/* <>
              <div className="col-sm-4">
                <div className="form-floating">
                  <div className="card card-flat p-1">
                    <div className="d-flex align-items-center justify-content-between m-2">
                      <h6 className="pt-1 font-regular font-primary font-gray1 text-truncate">
                        <div className="d-flex text-wrap">Option randomize</div>
                      </h6>
                      <div className="form-check form-switch">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={oRandom}
                          onChange={(e) => setORandom(e.target.checked)}
                          // disabled={true}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </> */}
            <div className="col-sm-4">
              <div className="form-floating">
                <input
                  type="number"
                  className={`form-control`}
                  placeholder="Min. Passing Score"
                  min="45"
                  max="100"
                  value={passScore}
                  onChange={(e) =>
                    e.target.value >= 0 &&
                    e.target.value <= 100 &&
                    setPassScore(e.target.value <= 0 ? "" : e.target.value)
                  }
                />
                <label>
                  <h6 className="pt-1 font-regular font-primary font-gray1 text-truncate">
                    Min. Passing Score
                  </h6>
                </label>
              </div>
              <small className="ml-1">Passing score in Percentage.</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Details;
