import moment from "moment";
import React, { useState, useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getMailSubjectData } from "../../redux/actions/notificationCentre/notificationSubject";
import Loader from "../../components/loader/Loader";

function NotificationFilter(props) {
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [memberFrom, setMemberFrom] = useState(["", ""]);
  const [memberFromType, setMemberFromType] = useState("");
  const [statusEnabled, setStatusEnabled] = useState(false);
  const [memberFromEnabled, setMemberFromEnabled] = useState(false);
  const [subjectEnabled, setSubjectEnabled] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState([]);
  const [searchedSubjectValue, setSearchedSubjectValue] = useState("");
  const [searchSubject, setSearchSubject] = useState([]);
  const statusData = [
    { SourceName: "Delivered", value: 16 },
    { SourceName: "Pending", value: 15 },
  ];

  const dispatch = useDispatch();

  const { mailSubjectData, mailSubjectDataLoading } = useSelector(
    (state) => ({
      mailSubjectData: state.getMailSubjectDataReducer?.mailSubjectData,
      mailSubjectDataLoading:
        state.getMailSubjectDataReducer.mailSubjectDataLoading,
    }),
    shallowEqual
  );
  useEffect(() => {
    if (!mailSubjectData) {
      dispatch(getMailSubjectData({}));
    }
    // eslint-disable-next-line
  }, [mailSubjectData]);

  useEffect(() => {
    setSelectedStatus([...props.filterInfo?.selectedStatus]);
    setSelectedSubject([...props.filterInfo?.selectedSubject]);
    setMemberFromType(props.filterInfo?.memberFromType);
    setMemberFrom([...props.filterInfo?.memberFrom]);
    // eslint-disable-next-line
  }, []);

  const clearAll = () => {
    setSelectedStatus([]);
    setMemberFrom(["", ""]);
    setMemberFromType("");
    props.resetFilter();
  };

  const statusHandler = (checked, value) => {
    if (checked) {
      setSelectedStatus([...selectedStatus, value]);
    } else {
      setSelectedStatus(selectedStatus.filter((t) => t !== value));
    }
  };

  const applyFilter = () => {
    let startDate = moment(new Date(memberFrom[0])).format("MM/DD/YYYY");
    let endDate = moment(new Date(memberFrom[1])).format("MM/DD/YYYY");
    if (
      (memberFromType === "after" && memberFrom[0] === "") ||
      (memberFromType === "before" && memberFrom[1] === "")
    ) {
      toast.error(`Please select a valid date`);
    } else if (
      memberFromType === "between" &&
      (memberFrom[0] === "" || memberFrom[1] === "")
    ) {
      if (memberFrom[0] === "" && memberFrom[1] === "") {
        toast.error(`Please select valid 'From' and 'To' dates`);
      } else if (memberFrom[0] === "") {
        toast.error(`Please select a valid 'From' date`);
      } else if (memberFrom[1] === "") {
        toast.error(`Please select a valid 'To' date`);
      } else {
        toast.error(`Please select a valid date`);
      }
    } else if (
      new Date(startDate) > new Date() &&
      (memberFromType === "after" || memberFromType === "before")
    ) {
      toast.error(`'Date' cannot be future date`);
    } else if (new Date(startDate) > new Date()) {
      toast.error(`'From Date' cannot be future date`);
    } else if (new Date(endDate) > new Date()) {
      toast.error(`'To Date' cannot be future date`);
    } else if (new Date(startDate) > new Date(endDate)) {
      toast.error(`'From Date' should not be greater than 'To Date'`);
    } else {
      const filterInfo = {
        selectedStatus: selectedStatus,
        selectedSubject: selectedSubject,
        memberFromType: memberFromType,
        memberFrom: memberFrom,
      };
      props.setFilterInfo(filterInfo);
      props.applyFilter(filterInfo);
    }
  };

  const subjectHandler = (checked, subject) => {
    if (checked) {
      setSelectedSubject([...selectedSubject, subject]);
    } else {
      setSelectedSubject(selectedSubject.filter((t) => t !== subject));
    }
  };

  const handleSearch = (e, parent) => {
    if (parent === "subjects") {
      setSearchedSubjectValue(e.target.value);
      setSearchSubject(
        mailSubjectData?.filter((item) =>
          item.toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
    }
  };

  const splitMatchedText = (str) => {
    let regExp;
    if (searchSubject) {
      regExp = new RegExp(searchedSubjectValue, "gi");
    }
    return str.replace(regExp, (match) => `<a href=''>${match}</a>`);
  };

  return (
    <>
      {mailSubjectDataLoading && <Loader />}
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
                Filter /{" "}
                {selectedStatus.length +
                  selectedSubject.length +
                  (memberFrom[0] || memberFrom[1] ? 1 : 0)}
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
              onClick={() => setStatusEnabled(!statusEnabled)}
            >
              <i
                className={
                  statusEnabled
                    ? "fal fa-angle-down fa-fw"
                    : "fal fa-angle-up fa-fw"
                }
              />
              <span className="p-relative">
                <small>Status</small>
                {selectedStatus.length > 0 && <span className="jewel"></span>}
              </span>
            </button>
            {statusEnabled &&
              (statusData.length > 0 ? (
                <div className="mb-4 ml-4 pl-1 pt-1">
                  {statusData.map((i, index) => (
                    <div key={index} className="d-flex align-items-center m-1">
                      <div>
                        <span>{i.SourceName}</span>
                      </div>
                      <div className="ml-auto">
                        <div className="form-check form-switch">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={selectedStatus.includes(i.value)}
                            onChange={(e) =>
                              statusHandler(e.target.checked, i.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="d-flex justify-content-end mt-2 px-1">
                    <button
                      className="btn btn-text"
                      onClick={() => setSelectedStatus([])}
                    >
                      <small>Clear status</small>
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
              onClick={() => setSubjectEnabled(!subjectEnabled)}
            >
              <i
                className={
                  subjectEnabled
                    ? "fal fa-angle-down fa-fw"
                    : "fal fa-angle-up fa-fw"
                }
              />
              <span className="p-relative">
                <small>Subject</small>
                {selectedSubject.length > 0 && <span className="jewel"></span>}
              </span>
            </button>
            {subjectEnabled &&
              (mailSubjectData?.length > 0 ? (
                <div className="mb-4 ml-4 pl-1 pt-1">
                  <input
                    type="text"
                    placeholder="Type to filter list"
                    className="form-control form-control-filter mt-2"
                    value={searchedSubjectValue}
                    onChange={(e) => handleSearch(e, "subjects")}
                  />
                  <div style={{ maxHeight: "350px", overflowY: "auto" }}>
                    {searchedSubjectValue.length > 0
                      ? searchSubject.map((i, index) => (
                          <div
                            className="d-flex align-items-center m-1"
                            key={index}
                          >
                            <div>
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: splitMatchedText(i),
                                }}
                              ></span>
                            </div>
                            <div className="ml-auto">
                              <div className="form-check form-switch">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  checked={selectedSubject.includes(i)}
                                  onChange={(e) =>
                                    subjectHandler(e.target.checked, i)
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        ))
                      : mailSubjectData?.map((i, index) => (
                          <div
                            className="d-flex align-items-center m-1"
                            key={index}
                          >
                            <div>
                              <span>{i}</span>
                            </div>
                            <div className="ml-auto">
                              <div className="form-check form-switch">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  checked={selectedSubject.includes(i)}
                                  onChange={(e) =>
                                    subjectHandler(e.target.checked, i)
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                  </div>
                  <div className="d-flex justify-content-end mt-2 px-1">
                    <button
                      className="btn btn-text"
                      onClick={() => {
                        setSelectedSubject([]);
                        setSearchedSubjectValue("");
                      }}
                    >
                      <small>Clear subject</small>
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
              onClick={() => setMemberFromEnabled(!memberFromEnabled)}
            >
              <i
                className={
                  memberFromEnabled
                    ? "fal fa-angle-down fa-fw"
                    : "fal fa-angle-up fa-fw"
                }
              />
              <span className="p-relative">
                <small>Created on</small>
                {(memberFrom[0] || memberFrom[1]) && (
                  <span className="jewel"></span>
                )}
              </span>
            </button>
            {memberFromEnabled && (
              <div>
                <div className="d-flex mt-2">
                  <select
                    onChange={(e) => {
                      setMemberFromType(e.target.value);
                      setMemberFrom(["", ""]);
                    }}
                    className="form-select w-50 m-3"
                  >
                    <option disabled selected={!memberFromType}>
                      Select Range
                    </option>
                    <option value="after" selected={memberFromType === "after"}>
                      After
                    </option>
                    <option
                      value="before"
                      selected={memberFromType === "before"}
                    >
                      Before
                    </option>
                    <option
                      value="between"
                      selected={memberFromType === "between"}
                    >
                      Between
                    </option>
                  </select>
                  {memberFromType !== "" ? (
                    memberFromType === "after" ||
                    memberFromType === "before" ? (
                      <input
                        type="date"
                        onChange={(e) => {
                          let a = ["", ""];
                          memberFromType === "before"
                            ? (a[1] = e.target.value)
                            : (a[0] = e.target.value);
                          setMemberFrom(a);
                        }}
                        style={{ maxHeight: "41px", margin: "14px 0px" }}
                        className="form-control date"
                        value={
                          memberFromType === "before"
                            ? memberFrom[1]
                            : memberFrom[0]
                        }
                        required
                      />
                    ) : (
                      <>
                        <input
                          type="date"
                          style={{ maxHeight: "41px", margin: "14px 0px" }}
                          className="form-control date mr-2"
                          onChange={(e) => {
                            let a = [...memberFrom];
                            a[0] = e.target.value;
                            setMemberFrom(a);
                          }}
                          value={memberFrom[0]}
                        />
                        <input
                          type="date"
                          style={{ maxHeight: "41px", margin: "14px 0px" }}
                          className="form-control date"
                          onChange={(e) => {
                            let a = [...memberFrom];
                            a[1] = e.target.value;
                            setMemberFrom(a);
                          }}
                          value={memberFrom[1]}
                        />
                      </>
                    )
                  ) : null}
                </div>
                <div className="d-flex justify-content-end py-2 px-1">
                  <button
                    className="btn btn-text"
                    onClick={() => {
                      setMemberFromType("");
                      setMemberFrom(["", ""]);
                    }}
                  >
                    <span className="font-12">
                      <small>Clear created on</small>
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
}

export default NotificationFilter;
