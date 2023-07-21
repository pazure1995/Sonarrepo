import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import moment from "moment";

const ResultsFilter = (props) => {
  const [createdOnEnabled, setCreatedOnEnabled] = useState(false);
  const [createdOnType, setCreatedOnType] = useState("");
  const [createdOnDate, setCreatedOnDate] = useState(["", ""]);
  const [typeEnabled, setTypeEnabled] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);

  useEffect(() => {
    setSelectedTypes([...props.filterInfo?.selectedTypes]);
    setCreatedOnDate([...props.filterInfo?.createdOnDate]);
    setCreatedOnType([...props.filterInfo?.createdOnType]);
    // eslint-disable-next-line
  }, []);

  const clearAll = () => {
    setSelectedTypes([]);
    setCreatedOnDate(["", ""]);
  };

  const categoryData = [
    { SourceName: "MCQ", value: "MCQ" },
    { SourceName: "OneWay", value: "OneWay" },
    { SourceName: "General", value: "General" },
  ];

  const typeHandler = (checked, value) => {
    if (checked) {
      setSelectedTypes([...selectedTypes, value]);
    } else {
      setSelectedTypes(selectedTypes.filter((t) => t !== value));
    }
  };

  const applyFilter = () => {
    let startDate = moment(new Date(createdOnDate[0])).format("MM/DD/YYYY");
    let endDate = moment(new Date(createdOnDate[1])).format("MM/DD/YYYY");
    if (
      (createdOnType === "after" || createdOnType === "before") &&
      createdOnDate[0] === ""
    ) {
      toast.error(`Please select a valid date`);
    } else if (
      createdOnType === "between" &&
      (createdOnDate[0] === "" || createdOnDate[1] === "")
    ) {
      if (createdOnDate[0] === "" && createdOnDate[1] === "") {
        toast.error(`Please select valid 'From' and 'To' dates`);
      } else if (createdOnDate[0] === "") {
        toast.error(`Please select a valid 'From' date`);
      } else if (createdOnDate[1] === "") {
        toast.error(`Please select a valid 'To' date`);
      } else {
        toast.error(`Please select a valid date`);
      }
    } else if (
      new Date(startDate) > new Date() &&
      (createdOnType === "after" || createdOnType === "before")
    ) {
      toast.error(`'Date' cannot be future date`);
    } else if (new Date(startDate) > new Date()) {
      toast.error(`'From Date' cannot be future date`);
    } else if (new Date(endDate) > new Date()) {
      toast.error(`'To Date' cannot be future date`);
    } else if (new Date(startDate) > new Date(endDate)) {
      toast.error(`'From Date' should not be greater than 'To Date'`);
    } else {
      props.resetSort();
      const filterInfo = {
        selectedTypes: selectedTypes,
        createdOnDate: createdOnDate,
        createdOnType: createdOnType,
      };
      props.applyFilter(filterInfo);
    }
  };
  return (
    <>
      <div className="view-panel show">
        <div className="view-panel-header view-panel-header-sm">
          <div className="p-relative">
            <div className="px-3 py-3 d-flex">
              <button
                onClick={applyFilter}
                type="button"
                className="btn btn-sm btn-primary"
              >
                <i className="fal fa-check mr-2 fa-fw"></i>Done
              </button>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <div className="px-3">
              <h6>
                Filter / {selectedTypes.length + (createdOnDate[0] ? 1 : 0)}
              </h6>
            </div>
            <div className="px-3">
              <button type="button" className="btn btn-text">
                <span className="font-bold font-14" onClick={clearAll}>
                  Clear all
                </span>
              </button>
            </div>
          </div>
        </div>
        <div className="view-panel-body view-panel-body-sm">
          <div className="mb-2">
            <button
              type="button"
              className="btn btn-collapsible"
              onClick={() => setTypeEnabled(!typeEnabled)}
            >
              <i
                className={
                  typeEnabled
                    ? "fal fa-angle-down fa-fw"
                    : "fal fa-angle-up fa-fw"
                }
              />
              <span className="p-relative">
                <small>Assessment category</small>
                {selectedTypes.length > 0 && <span className="jewel"></span>}
              </span>
            </button>
            {typeEnabled &&
              (categoryData.length > 0 ? (
                <div className="mb-4 ml-4 pl-1 pt-1">
                  {categoryData.map((i, index) => (
                    <div key={index} className="d-flex align-items-center m-1">
                      <div>
                        <span>{i.SourceName}</span>
                      </div>
                      <div className="ml-auto">
                        <div className="form-check form-switch">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={selectedTypes?.includes(i.value)}
                            onChange={(e) =>
                              typeHandler(e.target.checked, i.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="d-flex justify-content-end mt-2 px-1">
                    <button
                      className="btn btn-text"
                      onClick={() => setSelectedTypes([])}
                    >
                      <small>Clear type</small>
                    </button>
                  </div>
                  <hr className="p-0" />
                </div>
              ) : (
                <div>
                  <div className="text-center p-3">
                    <div className="avatar avatar-lg">
                      <i className="fad fa-users-slash"></i>
                    </div>
                    <div className="mt-2">No Records found</div>
                  </div>
                </div>
              ))}
          </div>

          <div className="mb-2">
            <button
              type="button"
              className="btn btn-collapsible"
              onClick={() => setCreatedOnEnabled(!createdOnEnabled)}
            >
              <i
                className={
                  createdOnEnabled
                    ? "fal fa-angle-down fa-fw"
                    : "fal fa-angle-up fa-fw"
                }
              />
              <span className="p-relative">
                <small>Invited on</small>
                {createdOnDate[0] && <span className="jewel"></span>}
              </span>
            </button>
            {createdOnEnabled && (
              <div>
                <div className="d-flex mt-2">
                  <select
                    onChange={(e) => {
                      setCreatedOnType(e.target.value);
                    }}
                    className="form-select w-50 m-3"
                  >
                    <option disabled selected={!createdOnType}>
                      Select Range
                    </option>
                    <option value="after" selected={createdOnType === "after"}>
                      After
                    </option>
                    <option
                      value="before"
                      selected={createdOnType === "before"}
                    >
                      Before
                    </option>
                    <option
                      value="between"
                      selected={createdOnType === "between"}
                    >
                      Between
                    </option>
                  </select>
                  {createdOnType !== "" ? (
                    createdOnType === "after" || createdOnType === "before" ? (
                      <input
                        type="date"
                        onChange={(e) => {
                          let a = [...createdOnDate];
                          a[0] = e.target.value;
                          setCreatedOnDate(a);
                        }}
                        style={{ maxHeight: "41px", margin: "14px 0px" }}
                        className="form-control date"
                        value={createdOnDate[0]}
                        required
                      />
                    ) : (
                      <>
                        <input
                          type="date"
                          style={{ maxHeight: "41px", margin: "14px 0px" }}
                          className="form-control date mr-2"
                          onChange={(e) => {
                            let a = [...createdOnDate];
                            a[0] = e.target.value;
                            setCreatedOnDate(a);
                          }}
                          value={createdOnDate[0]}
                        />
                        <input
                          type="date"
                          style={{ maxHeight: "41px", margin: "14px 0px" }}
                          className="form-control date"
                          onChange={(e) => {
                            let a = [...createdOnDate];
                            a[1] = e.target.value;
                            setCreatedOnDate(a);
                          }}
                          value={createdOnDate[1]}
                        />
                      </>
                    )
                  ) : null}
                </div>
                <div className="d-flex justify-content-end py-2 px-1">
                  <button
                    className="btn btn-text"
                    onClick={() => {
                      setCreatedOnType("");
                      setCreatedOnDate(["", ""]);
                    }}
                  >
                    <span className="font-12">
                      <small>Clear invited on</small>
                    </span>
                  </button>
                </div>
                <hr className="p-0" />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultsFilter;
