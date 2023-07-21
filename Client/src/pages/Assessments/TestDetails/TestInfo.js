import React, { useEffect, useState } from "react";
import moment from "moment";
import TagsInput from "react-tagsinput";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import PhoneInput from "react-phone-input-2";
import { AsYouType } from "libphonenumber-js";
import QuestionTable from "../../../components/questionTable/QuestionTable";
import ExpiredInvites from "./TestInfoTabs/ExpiredInvites";
import PendingInvites from "./TestInfoTabs/PendingInvites";
import Result from "./TestInfoTabs/Result";
import { expiryData } from "../../../constants/constants";
import InviteByDocUpload from "./InviteByDocUpload";
import "react-tagsinput/react-tagsinput.css";
import "react-phone-input-2/lib/bootstrap.css";
import { getUserToken } from "../../../services/AuthServices";
import { post } from "../../../services/ApiServices";
import { inviteCandidatesUrl } from "../../../services/ServiceUrls";

const TestInfo = (props) => {
  const Token = getUserToken();
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("completed");
  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState("");
  const [phone, setPhone] = useState("");
  const [skills, setSkills] = useState([]);
  const [skill, setSkill] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobId, setJobId] = useState("");
  const [clientName, setClientName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [iLoader, setILoader] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [expiryRange, setExpiryRange] = useState(7);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [isBulkUpload, setIsBulkUpload] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [docSelected, setDocSelected] = useState(false);
  const [excelSelected, setExcelSelected] = useState(false);
  const [reviewerPresent, setReviewerPresent] = useState("false");
  const [phoneValid, setPhoneValid] = useState(false);
  const [reviewer, setReviewer] = useState({
    firstName: Token.firstName,
    lastName: Token.lastName,
    reviewerEmail: Token.email,
    instructions: "",
  });
  const [matches, setMatches] = useState(
    window.matchMedia("(max-width: 1200px)").matches
  );

  const handleChangeTag = (tags) => {
    setTags(tags);
  };

  const handleChangeInputTag = (tag) => {
    setTag(tag);
  };
  const handleChangeSkill = (skills) => {
    setSkills(skills);
  };

  const handleChangeInputSkill = (skill) => {
    setSkill(skill);
  };

  useEffect(() => {
    window
      .matchMedia("(max-width: 1200px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);

  useEffect(() => {
    let invitation = [];
    let reverseData = candidates.reverse();

    const invite = reverseData.filter((item) => {
      if (Token.role === "admin")
        return (
          item?.testAssign?._id === props?.testDetails.data._id &&
          !item?.testCompleted
        );
      return (
        item?.testAssign?._id === props?.testDetails.data._id &&
        !item?.testCompleted &&
        Token.companyId === item?.createdBy?.companyId
      );
    });

    invite.forEach((elem) => {
      let m = moment(elem.createdAt);
      let today = moment();
      let days = today.diff(m, "days");

      parseInt(days) < elem.expiryDays && (invitation = [...invitation, elem]);
    });
    // eslint-disable-next-line
  }, [candidates]);

  const handleAddButtonClick = () => {
    if (!validate(email)) {
      toast.error("Please Enter Valid Email");
    } else if (!phoneValid && phone.length > 0) {
      toast.error("Please Enter Phone Number");
    } else {
      const newItem = {
        email: email,
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phone,
        id: Math.random().toString(16).slice(2),
      };
      let result = selectedCandidates.filter((x) => x.email === newItem.email);
      if (email.length === 0 && firstName.length === 0)
        return toast.error(`First name and Email should not be empty.`);
      else if (email.length === 0 && lastName.length !== 0)
        return toast.error(`Last name should not be empty.`);
      else if (email.length === 0 && firstName.length !== 0)
        return toast.error(`Email should not be empty.`);
      else if (email.length !== 0 && firstName.length === 0)
        return toast.error(`Name should not be empty.`);
      if (result.length > 0) return toast.success(`Email is added.`);
      const newItems = [...selectedCandidates, newItem];
      setSelectedCandidates(newItems);
      setEmail("");
      setPhone("");
      setFirstName("");
      setLastName("");
    }
  };

  const validate = (email) => {
    // eslint-disable-next-line
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return email.match(mailformat) ? true : false;
  };

  const inviteCandidateForTest = () => {
    if (jobTitle === "") return toast.error("Please enter Job title");
    if (!validate(reviewer?.reviewerEmail))
      return toast.error("Please enter a valid reviewer email");

    setILoader(true);
    setLoading(true);

    let today = new Date();
    let candidateInfo = selectedCandidates.map((candidate) => {
      return {
        email: candidate.email,
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        phoneNumber: candidate.phoneNumber,
      };
    });

    const companyInfo = {
      companyName: Token.companyName,
      companyLogo: Token.companyLogo,
      companyId: Token.companyId,
      tenantId: "",
    };

    const candidDetails = {
      jobTitle: jobTitle,
      jobId: jobId,
      clientName: clientName,
      skills: skills,
      tags: tags,
      candidateInfo: candidateInfo,
      expiryDate: addDays(today, expiryRange),
      createdBy: Token.id,
      updatedBy: Token.id,
      testAssign: props.testDetails.data._id,
      testStatus: "Invited",
      reviewer: { ...reviewer },
      createdByName: Token.firstName + " " + Token.lastName,
      testName: props.testDetails.data.testName,
      testCategory: props.testDetails.data.testCategory,
      testDuration: props.testDetails.data.details.duration,
      companyName: Token.companyName,
      companyInfo: companyInfo,
    };

    post(inviteCandidatesUrl, candidDetails)
      .then((response) => {
        setIsBulkUpload(false);
        setShowModal(false);
        setILoader(false);
        setLoading(false);
        setSelectedCandidates([]);
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setJobTitle("");
        setJobId("");
        setClientName("");
        setTags([]);
        setSkills([]);
        setExpiryRange(7);
        props.setShowTestDetails(false);

        candidateInfo.length === 1
          ? toast.success(`Candidate invited successfully`)
          : toast.success(`Candidates invited successfully`);
        props.getData();
      })
      // })
      .catch((err) => {
        console.log(err);
        setILoader(false);
        setLoading(false);
      });
  };

  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  const handleReviewerChange = (e) => {
    setReviewerPresent(e.target.value);
    if (e.target.value === "true") {
      setReviewer({
        firstName: "",
        lastName: "",
        reviewerEmail: "",
        instructions: "",
      });
    } else {
      setReviewer({
        firstName: Token.firstName,
        lastName: Token.lastName,
        reviewerEmail: Token.email,
        instructions: "",
      });
    }
  };

  const onCandidateAddTypeClick = (type) => {
    if (type === "doc") {
      setDocSelected(true);
      setExcelSelected(false);
    }
    if (type === "excel") {
      setExcelSelected(true);
      setDocSelected(false);
    }
    if (type === "manual") {
      setExcelSelected(false);
      setDocSelected(false);
    }
    if (type === "") {
      setExcelSelected(false);
      setDocSelected(false);
    }
  };

  const _onChangePhone = (value, country) => {
    const asYouType = new AsYouType(country.countryCode.toUpperCase());
    asYouType.input(value.replace(country.dialCode, ""));
    const isValid = asYouType.isValid() === true ? true : false;
    setPhoneValid(isValid);
    setPhone(value.length > 1 ? `+${value}` : "");
  };

  return (
    <>
      <div className="view-panel show">
        <div className="view-panel-header mb-3">
          <div className="px-3 py-2">
            <button
              type="button"
              onClick={() => props?.handleSuccess()}
              className="btn btn-icon"
            >
              <i className="fal fa-times"></i>
            </button>
          </div>
          <div className="px-3">
            <div>
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center ml-3 mb-1">
                  <h6 className="mb-0 me-2">
                    {props?.testDetails?.data?.testName}
                  </h6>
                  <span
                    className={`tag ${
                      props?.testDetails?.data?.testCategory === "MCQ"
                        ? "tag-red1"
                        : props?.testDetails?.data?.testCategory === "General"
                        ? "tag-orange1"
                        : "tag-blue1"
                    }`}
                  >
                    <span style={{ fontWeight: 600 }}>
                      {props?.testDetails?.data?.testCategory}
                    </span>
                  </span>
                </div>
                {Token.role !== "admin" && (
                  <div>
                    <button
                      className="btn btn btn-sm"
                      onClick={() => setShowModal(true)}
                    >
                      <i
                        className="fal fa-user-plus mr-2"
                        aria-hidden="true"
                      ></i>
                      Invite Candidate
                    </button>
                  </div>
                )}
              </div>
              <div className="align-items-center ml-3 mb-1"></div>
            </div>
            <ul className="nav nav-tabs mt-3">
              <li className="nav-item">
                <button
                  className={
                    tab === "completed"
                      ? " nav-link p-3 active"
                      : "nav-link p-3"
                  }
                  onClick={() => {
                    setTab("completed");
                  }}
                  type="button"
                >
                  Results
                </button>
              </li>
              <li className="nav-item">
                <button
                  onClick={() => setTab("invited")}
                  type="button"
                  className={
                    tab === "invited" ? " nav-link p-3 active" : "nav-link p-3"
                  }
                >
                  Invited
                </button>
              </li>
              <li className="nav-item">
                <button
                  onClick={() => setTab("expired")}
                  type="button"
                  className={
                    tab === "expired" ? " nav-link p-3 active" : "nav-link p-3"
                  }
                >
                  Expired
                </button>
              </li>
              <li className="nav-item">
                <button
                  onClick={() => setTab("questions")}
                  type="button"
                  className={
                    tab === "questions"
                      ? " nav-link p-3 active"
                      : "nav-link p-3"
                  }
                >
                  Questions
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="view-panel-body">
          {tab === "completed" && (
            <Result testId={props?.testDetails.data._id} />
          )}
          {tab === "invited" && (
            <PendingInvites
              matches={matches}
              testId={props?.testDetails.data._id}
            />
          )}
          {tab === "expired" && (
            <ExpiredInvites
              matches={matches}
              testId={props?.testDetails.data._id}
            />
          )}
          {tab === "questions" && (
            <QuestionTable
              parent="testInfo"
              data={props?.testDetails?.data?.questions}
              queCount={props?.testDetails?.data?.questions.length}
              editButton={true}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              dataSize={5}
              pagination={"custom"}
              checkbox={false}
            />
          )}
        </div>
      </div>
      <Modal show={showModal} size="lg" top>
        <Modal.Header className="p-3">
          <h6>Invite Candidate</h6>
          <button
            type="button"
            data-dismiss="modal"
            aria-label="Close"
            onClick={() => {
              setShowModal(false);
              setEmail("");
              setPhone("");
              setFirstName("");
              setJobTitle("");
              setJobId("");
              setClientName("");
              setTags([]);
              setSkills([]);
              setLastName("");
              setSelectedCandidates([]);
              setIsBulkUpload(false);
              onCandidateAddTypeClick("");
              setExpiryRange(7);
              setReviewerPresent("false");
            }}
            className="close p-0 bl-modal-close-btn"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div
              className="col-12 d-flex flex-column flex-lg-row"
              style={{ padding: "25px 30px 30px 40px" }}
            >
              <button
                onClick={() => {
                  onCandidateAddTypeClick("doc");
                  setIsBulkUpload(false);
                }}
                type="button"
                className={
                  docSelected
                    ? "card card-flat p-0 mr-2 mb-2 mb-lg-0  selected"
                    : "card card-flat p-0 mr-2 mb-2 mb-lg-0"
                }
              >
                <div className="card-body text-left text-left">
                  <div className="d-flex">
                    {docSelected ? (
                      <>
                        <div className="mr-3 font-green font-16">
                          <i className="fad fa-check-circle"></i>
                        </div>
                      </>
                    ) : (
                      <div className="mr-3 font-muted font-16">
                        <i className="fad fa-circle"></i>
                      </div>
                    )}
                    <div>
                      <div>
                        <strong className="font-blue_primary">
                          Invite Candidate
                        </strong>
                      </div>
                      <p className="mb-0">
                        {" "}
                        Invite candidate manually by entering the name and email
                      </p>
                    </div>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  onCandidateAddTypeClick("excel");
                  setIsBulkUpload(true);
                }}
                className={
                  excelSelected
                    ? "card card-flat p-0 mr-2 mb-2 mb-lg-0  selected"
                    : "card card-flat p-0 mr-2 mb-2 mb-lg-0"
                }
              >
                <div className="card-body text-left">
                  <div className="d-flex">
                    {excelSelected ? (
                      <div className="mr-3 font-green font-16">
                        <i className="fad fa-check-circle"></i>
                      </div>
                    ) : (
                      <div className="mr-3 font-muted font-16">
                        <i className="fad fa-circle"></i>
                      </div>
                    )}
                    <div>
                      <div>
                        <strong className="font-blue_primary">
                          Bulk Upload With Excel
                        </strong>
                      </div>
                      <p className="mb-0">
                        Upload an excel template to invite multiple candidates
                        at once
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="card-body">
            {docSelected && (
              <>
                <div className="row ">
                  <div className="col-lg-12 d-flex ">
                    <div className="form-floating col-5">
                      <h5 className="ps-1" style={{ paddingTop: 25 }}>
                        Job
                      </h5>
                    </div>
                  </div>
                </div>
                <hr />
                <div className="card p-2">
                  <div
                    className={
                      !matches ? "d-flex  gap-2" : "d-flex  flex-column gap-2"
                    }
                  >
                    <div className={!matches ? "col-4" : "col-12"}>
                      <div className="form-floating">
                        <input
                          type="text"
                          placeholder="test"
                          className="form-control"
                          value={jobTitle}
                          onChange={(e) => {
                            const input =
                              e.target.value
                                .charAt(0)
                                .toUpperCase()
                                .replace(/^[ \t]+|[ \t]+$/gm, "") +
                              e.target.value.slice(1);

                            setJobTitle(input);
                          }}
                        />
                        <label htmlFor="">Job Title*</label>
                      </div>
                    </div>
                    <div className={!matches ? "col-4" : "col-12"}>
                      <div className="form-floating">
                        <input
                          type="text"
                          placeholder="test"
                          className="form-control"
                          value={jobId}
                          onChange={(e) => {
                            setJobId(
                              e.target.value.replace(/^[ \t]+|[ \t]+$/gm, "")
                            );
                          }}
                        />
                        <label htmlFor="">Job Id</label>
                      </div>
                    </div>
                    <div className={!matches ? "col-4 pr-3" : "col-12"}>
                      <div className="form-floating">
                        <input
                          type="text"
                          placeholder="test"
                          className="form-control"
                          value={clientName}
                          onChange={(e) => {
                            setClientName(
                              e.target.value.replace(/^[ \t]+|[ \t]+$/gm, "")
                            );
                          }}
                        />
                        <label htmlFor="">Client Name</label>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex flex-column mt-2">
                    <div className="col-12 form-floating">
                      <TagsInput
                        // renderInput={autocompleteRenderInput}
                        value={skills}
                        onChange={(e) => handleChangeSkill(e)}
                        inputValue={skill}
                        onChangeInput={(e) => handleChangeInputSkill(e)}
                        placeholder="Type a location and hit enter"
                        inputProps={{
                          placeholder: "Add a Skill",
                        }}
                      />
                    </div>

                    <div className="col-12 form-floating mt-2">
                      <TagsInput
                        // renderInput={autocompleteRenderInput}
                        value={tags}
                        onChange={(e) => handleChangeTag(e)}
                        inputValue={tag}
                        onChangeInput={(e) => handleChangeInputTag(e)}
                        placeholder="Type a location and hit enter"
                        inputProps={{
                          placeholder: "Add a Tag",
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="row ">
                  <div className="col-lg-12 d-flex ">
                    <div className="form-floating col-5">
                      <h5 className="ps-1" style={{ paddingTop: 25 }}>
                        Candidate
                      </h5>
                    </div>
                  </div>
                </div>
              </>
            )}

            {docSelected && <hr />}

            {selectedCandidates.length > 0 && isBulkUpload === false ? (
              <div className=" mb-3 px-3">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">No.</th>
                      <th scope="col">Name</th>
                      <th scope="col">Email</th>
                      <th scope="col">Phone</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCandidates.map((x, i) => (
                      <tr key={i}>
                        <td>
                          <strong>{i + 1}</strong>
                        </td>
                        <td>
                          {x.firstName} {x.lastName}{" "}
                        </td>
                        <td>{x.email}</td>
                        <td>{x.phoneNumber}</td>
                        <td style={{ cursor: "pointer", width: "100px" }}>
                          <button
                            type="button"
                            className="btn btn-text-accent"
                            onClick={() => {
                              let candidates = selectedCandidates.filter(
                                (y) => y.email !== x.email
                              );
                              setSelectedCandidates(candidates);
                            }}
                          >
                            <div className="d-flex ">
                              <span>
                                <i
                                  aria-hidden="true"
                                  className="fas fa-trash-alt fa-fw"
                                ></i>
                              </span>
                            </div>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}

            {isBulkUpload && (
              <InviteByDocUpload
                setIsBulkUpload={setIsBulkUpload}
                testDetails={props.testDetails}
                setShowModal={setShowModal}
                setShowTestDetails={props.setShowTestDetails}
                matches={matches}
                loading={loading}
                getData={props.getData}
              />
            )}
            {docSelected && (
              <>
                <div className="card p-2">
                  <div className="">
                    <div className={!matches ? "d-flex" : ""}>
                      <div className={!matches ? "col-6 mr-2" : "col-12 mb-2"}>
                        <div className="form-floating">
                          <input
                            type="text"
                            placeholder="test"
                            className="form-control"
                            value={firstName}
                            onChange={(e) => {
                              e.target.value = e.target.value.replace(
                                /^[ \t]+|[ \t]+$/gm,
                                ""
                              );
                              setFirstName(
                                e.target.value
                                  .charAt(0)
                                  .replace(
                                    /^[ \t]+|[ \t]+$/gm,

                                    ""
                                  )
                                  .toUpperCase() +
                                  e.target.value.slice(1).replace(
                                    /^[ \t]+|[ \t]+$/gm,

                                    ""
                                  )
                              );
                            }}
                          />
                          <label htmlFor="">First name*</label>
                        </div>
                      </div>
                      <div className={!matches ? "col-6 pr-2" : "col-12"}>
                        <div className="form-floating">
                          <input
                            type="text"
                            placeholder="test"
                            className="form-control"
                            value={lastName}
                            onChange={(e) => {
                              e.target.value = e.target.value.replace(
                                /^[ \t]+|[ \t]+$/gm,
                                ""
                              );
                              setLastName(
                                e.target.value
                                  .charAt(0)
                                  .replace(
                                    /^[ \t]+|[ \t]+$/gm,

                                    ""
                                  )
                                  .toUpperCase() +
                                  e.target.value.slice(1).replace(
                                    /^[ \t]+|[ \t]+$/gm,

                                    ""
                                  )
                              );
                            }}
                          />
                          <label htmlFor="">Last name*</label>
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        !matches
                          ? "d-flex gap-2 mt-2"
                          : "d-flex flex-column gap-2 mt-2"
                      }
                    >
                      <div className={!matches ? "col-6" : "col-12   "}>
                        <div className="form-floating ">
                          <input
                            type="text"
                            placeholder="test"
                            className="form-control "
                            value={email}
                            onChange={(e) => {
                              e.target.value = e.target.value.trim();
                              setEmail(e.target.value);
                            }}
                          />
                          <label htmlFor="">Email*</label>
                        </div>
                      </div>
                      <div className={!matches ? "col-6" : "col-12   "}>
                        <div className="form-floating">
                          <PhoneInput
                            style={{
                              zIndex: 99999,
                            }}
                            inputStyle={{
                              height: "100%",
                              width: "100%",
                            }}
                            // inputClass="form-control"
                            containerClass={!matches ? "pr-2" : ""}
                            containerStyle={{ height: "140px" }}
                            value={phone}
                            name="mobilePhone"
                            country={"us"}
                            onChange={(value, country) => {
                              _onChangePhone(value, country);
                            }}
                            placeholder="Phone no./Mobile no."
                          />
                          {!phoneValid && phone.length > 1 && (
                            <small className="validation">Invalid Phone</small>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <button
                      className=" mt-3 btn btn-sm btn-primary"
                      onClick={() => {
                        handleAddButtonClick();
                      }}
                      style={{ float: "right" }}
                      disabled={
                        firstName === "" || lastName === "" || email === ""
                          ? true
                          : false
                      }
                    >
                      <i className="fas fa-plus mr-2"></i> Add Candidate
                    </button>
                  </div>{" "}
                </div>

                {props?.testDetails?.data?.testCategory !== "MCQ" && (
                  <>
                    <div className="form-floating col-5">
                      <h5 className="ps-1" style={{ paddingTop: 25 }}>
                        Options
                      </h5>
                    </div>
                    <hr />
                    <div className="card p-2">
                      <div
                        className={!matches ? "d-flex" : "d-flex flex-column"}
                      >
                        <div className={!matches ? "col-12" : "col-12 mt-2"}>
                          <div className="form-floating">
                            <select
                              className="font-14 form-select"
                              id="category"
                              value={reviewerPresent}
                              onChange={(e) => {
                                handleReviewerChange(e);
                              }}
                            >
                              <option value={false}>
                                I will be the reviewer.
                              </option>
                              <option value={true}>
                                I suggest a colleague to review.
                              </option>
                            </select>
                            <label for="category">Reviewer</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {reviewerPresent === "true" && (
                  <>
                    <div className="form-floating col-5">
                      <h5 className="ps-1" style={{ paddingTop: 25 }}>
                        Reviewer
                      </h5>
                    </div>
                    <hr />{" "}
                    <div className="card p-2">
                      <div
                        className={
                          !matches
                            ? "d-flex justify-content-between "
                            : "d-flex flex-column "
                        }
                      >
                        <div
                          className={
                            !matches
                              ? "form-floating w-50 mr-2"
                              : "form-floating w-100 "
                          }
                        >
                          <input
                            type="text"
                            placeholder="test"
                            className="form-control"
                            value={reviewer.firstName}
                            onChange={(e) => {
                              setReviewer({
                                ...reviewer,
                                firstName: e.target.value.replace(
                                  /^[ \t]+|[ \t]+$/gm,

                                  ""
                                ),
                              });
                            }}
                          />
                          <label htmlFor="">First name*</label>
                        </div>
                        <div
                          className={
                            !matches
                              ? "form-floating w-50 mr-2"
                              : "form-floating w-100 mt-2"
                          }
                        >
                          <input
                            type="text"
                            placeholder="test"
                            className="form-control"
                            value={reviewer.lastName}
                            onChange={(e) => {
                              setReviewer({
                                ...reviewer,
                                lastName: e.target.value.replace(
                                  /^[ \t]+|[ \t]+$/gm,

                                  ""
                                ),
                              });
                            }}
                          />
                          <label htmlFor="">Last name*</label>
                        </div>
                        <div
                          className={
                            !matches
                              ? "form-floating w-50"
                              : "form-floating w-100 mt-2"
                          }
                        >
                          <input
                            type="text"
                            placeholder="test"
                            className="form-control"
                            value={reviewer.reviewerEmail}
                            onChange={(e) => {
                              setReviewer({
                                ...reviewer,
                                reviewerEmail: e.target.value.replace(
                                  /^[ \t]+|[ \t]+$/gm,

                                  ""
                                ),
                              });
                            }}
                          />
                          <label htmlFor="">Email*</label>
                        </div>
                      </div>
                      <div className="form-floating mt-2">
                        <textarea
                          type="text"
                          rows="3"
                          placeholder="test"
                          className="form-control"
                          value={reviewer.instructions}
                          onChange={(e) => {
                            setReviewer({
                              ...reviewer,
                              instructions: e.target.value,
                            });
                          }}
                        />
                        <label htmlFor="">Instruction to reviewer</label>
                      </div>
                    </div>
                  </>
                )}
                {/*  */}
                <div className=" py-4 px-2 d-flex justify-content-end">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEmail("");
                      setFirstName("");
                      setJobTitle("");
                      setPhone("");
                      setJobId("");
                      setClientName("");
                      setTags([]);
                      setSkills([]);
                      setLastName("");
                      setSelectedCandidates([]);
                      onCandidateAddTypeClick("");
                      setExpiryRange(7);
                      setReviewerPresent("false");
                    }}
                    type="button"
                    className="btn btn-secondary mr-2"
                  >
                    Cancel
                  </button>
                  <div>
                    <div className="d-flex">
                      <div className="">
                        <button
                          type="button"
                          onClick={inviteCandidateForTest}
                          className="btn btn-primary"
                          disabled={
                            selectedCandidates.length > 0
                              ? firstName !== "" || email !== ""
                                ? true
                                : reviewer.firstName !== "" &&
                                  reviewer.reviewerEmail !== "" &&
                                  reviewer.lastName !== ""
                                ? false
                                : true
                              : true
                          }
                        >
                          {iLoader ? (
                            <>
                              <i className="fa fa-spinner fa-spin mr-2"></i>{" "}
                              Invite
                            </>
                          ) : (
                            <>
                              <i
                                className="fal fa-user-plus mr-2"
                                aria-hidden="true"
                              ></i>
                              Invite
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default TestInfo;
