import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { ExcelRenderer } from "react-excel-renderer";
import { toast } from "react-toastify";
import inviteCandidates from "../../../assets/docs/invite-candidates.xlsx";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import { getUserToken } from "../../../services/AuthServices";
import { post } from "../../../services/ApiServices";
import { inviteCandidatesUrl } from "../../../services/ServiceUrls";

const InviteByDocUpload = (props) => {
  const [errCount, setErrCount] = useState(0);
  const [file, setFile] = useState(false);
  const [fileName, setFileName] = useState("");
  const [uploaded, setUploaded] = useState(false);
  const [existingCandidateList, setExistingCandidateList] = useState([]);
  const [rows, setRows] = useState();
  const [data, setData] = useState([]);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [iLoader, setILoader] = useState(false);
  const [reviewerPresent, setReviewerPresent] = useState("false");
  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState("");
  const [skills, setSkills] = useState([]);
  const [skill, setSkill] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobId, setJobId] = useState("");
  const [clientName, setClientName] = useState("");
  const [expiryRange, setExpiryRange] = useState(7);

  const Token = getUserToken();
  const [reviewer, setReviewer] = useState({
    firstName: Token.firstName,
    lastName: Token.lastName,
    reviewerEmail: Token.email,
    instructions: "",
  });

  const validate = (email) => {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return email.match(mailformat) ? true : false;
  };
  const fileChange = (file) => {
    setFile(true);
    setErrCount(0);
    setFileName("");
    var re = /(?:\.([^.]+))?$/;

    var ext = re.exec(file.name)[1];

    if (ext === "xlsx") {
      setFileName(file.name);
      setErrCount(0);

      ExcelRenderer(file, (err, res) => {
        if (err) {
          setUploaded(false);
        } else {
          res.rows.splice(0, 1);
          let tempcount = 0;
          let candArr = [];
          const result = res.rows.map((eachrow, index) => {
            let err = 0;
            let errMessage = "";
            const [firstName, lastName, email] = eachrow;
            const data = {
              firstName:
                eachrow[0]?.charAt(0)?.toUpperCase() + eachrow[0]?.slice(1),
              lastName: eachrow[1],
              email: eachrow[2],
            };
            candArr.push(data);
            setExistingCandidateList([...candArr]);

            if (
              firstName === undefined ||
              lastName === undefined ||
              email === undefined
            ) {
              err = 1;
              errMessage = " Data Missing";
              tempcount += 1;
            } else if (!validate(email)) {
              err = 1;
              errMessage = "Invalid Email";
              tempcount += 1;
            } else {
              let isExists = existingCandidateList.filter(
                (row) => row.email === email
              );
              if (isExists.length > 0) {
                errMessage = "Already Exists";
                err = 1;
                tempcount += 1;
              } else {
                errMessage = "Valid";
                err = 0;
              }
            }
            return {
              err: err,
              errMessage: errMessage,
              firstName:
                firstName?.charAt(0)?.toUpperCase() + firstName?.slice(1),
              lastName: lastName,
              email: email,
            };
          });

          setErrCount(tempcount);
          setRows(result);
          setData(result);
          setUploaded(true);
        }
      });
    } else {
      toast.error("Please Upload only .xlsx Files ");
    }
  };

  let count = 0;

  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  const inviteCandidateForTest = () => {
    if (jobTitle === "") return toast.error("Please enter a Job Title");
    if (errCount !== 0) return toast.error("Data is invalid.");

    if (!validate(reviewer.reviewerEmail))
      return toast.error("Please enter a valid reviewer email");

    setILoader(true);
    setLoading(true);

    let today = new Date();
    let candidateInfo = existingCandidateList.map((candidate) => {
      return {
        email: candidate.email,
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        phoneNumber: candidate.phoneNumber,
      };
    });

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
    };

    post(inviteCandidatesUrl, candidDetails)
      .then((res) => {
        existingCandidateList.length === 1
          ? toast.success(`Candidate invited successfully`)
          : toast.success(`Candidates invited successfully`);
        setILoader(false);
        setLoading(false);
        props.setIsBulkUpload(false);
        props.setShowModal(false);
        props.setShowTestDetails(false);
        props.getData();
      })
      .catch((err) => {
        toast.error("Something went wrong");
        console.log("err", err);
        setILoader(false);
        setLoading(false);
      });
  };

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

  //
  return (
    <>
      <div className="row">
        <div className="col-12">
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
            <div className={"d-flex flex-column gap-2"}>
              <div className={"col-12"}>
                <div className="form-floating">
                  <input
                    type="text"
                    placeholder="test"
                    className="form-control"
                    value={jobTitle}
                    onChange={(e) => {
                      setJobTitle(
                        e.target.value.replace(/^[ \t]+|[ \t]+$/gm, "")
                      );
                    }}
                  />
                  <label htmlFor="">Job Title*</label>
                </div>
              </div>
              <div className={"col-12"}>
                <div className="form-floating">
                  <input
                    type="text"
                    placeholder="test"
                    className="form-control"
                    value={jobId}
                    onChange={(e) => {
                      setJobId(e.target.value.replace(/^[ \t]+|[ \t]+$/gm, ""));
                    }}
                  />
                  <label htmlFor="">Job Id</label>
                </div>
              </div>
              <div className={"col-12"}>
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

              <div className="col-12 form-floating">
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
          <div className="p-2 ml-1 mt-4 p-0-600">
            <h6>Step 1</h6>
            <p>
              <a href={inviteCandidates} download className="btn">
                Download the .xlxs template
              </a>
            </p>
            <div className="mt-2">
              <h6 className="">Step 2</h6>
              <div className="d-flex my-2 justify-content-around">
                {file && (
                  <div style={{ margin: "auto" }}>
                    <i
                      onClick={() => {
                        setFile(false);
                      }}
                      style={{ cursor: "pointer", fontSize: 20 }}
                      className=" fas fa-trash-alt mr-1 fa-fw"
                    ></i>
                  </div>
                )}
                <div className="form-floating m-auto  w-100">
                  <Dropzone
                    onDrop={(file) => fileChange(file[0])}
                    multiple={false}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <div
                        className="d-block"
                        style={{ textAlign: "center" }}
                        {...getRootProps()}
                      >
                        <div className="talentuploadmaindiv pt-2 my-2">
                          <button
                            type="button"
                            className="btn  w-25 btn-secondary"
                          >
                            <i className="far fa-cloud-upload mr-1 fa-fw"></i>
                            Upload
                          </button>
                          <input type="file" {...getInputProps()} />
                        </div>
                      </div>
                    )}
                  </Dropzone>
                </div>
                {file && (
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
            </div>

            <div className="col-sm-12 mt-4">
              {uploaded ? (
                <div className="">
                  <div className=" d-flex ">
                    <div>
                      {" "}
                      <h6>Step 3</h6> <p>Preview the data. </p>
                    </div>
                    <div className="ml-auto">
                      {" "}
                      <h6> </h6>
                      <span className="bold">
                        {" "}
                        {data.length - errCount - data.length === 0
                          ? `${data.length} valid
                        records`
                          : `${errCount} invalid records.`}
                      </span>
                    </div>
                  </div>
                  <table className="table table-hoverable ">
                    <thead>
                      <tr>
                        <th scope="col">First name</th>
                        <th scope="col">Last name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((eachvalue) => (
                        <tr
                          className={
                            eachvalue.err === 0
                              ? "table-primary"
                              : "table-danger"
                          }
                        >
                          <td>{eachvalue.firstName}</td>
                          <td>{eachvalue.lastName}</td>
                          <td>{eachvalue.email}</td>
                          <td>{eachvalue.errMessage}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {props?.testDetails?.data?.testCategory !== "MCQ" && (
                    <>
                      <div className="form-floating col-5">
                        <h5 className="ps-1" style={{ paddingTop: 25 }}>
                          Options
                        </h5>
                      </div>
                      <hr />
                      <div className="card p-2">
                        <div className="d-flex">
                          <div className="col-12 ">
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
                          </div>{" "}
                        </div>
                      </div>
                    </>
                  )}{" "}
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
                            !props.matches
                              ? "d-flex justify-content-between "
                              : "d-flex flex-column "
                          }
                        >
                          <div
                            className={
                              !props.matches
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
                              !props.matches
                                ? "form-floating w-50 mr-2"
                                : "form-floating w-100 mt-2 "
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
                              !props.matches
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
                  <div className="py-4 px-2 d-flex justify-content-end">
                    <button
                      type="button"
                      className="btn btn-secondary mr-2"
                      disabled={submitClicked}
                      onClick={() => props.setIsBulkUpload(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={inviteCandidateForTest}
                      disabled={
                        errCount === 0 &&
                        reviewer.firstName !== "" &&
                        reviewer.lastName !== "" &&
                        reviewer.reviewerEmail !== ""
                          ? false
                          : true
                      }
                    >
                      {iLoader ? (
                        <>
                          <i className="fa fa-spinner fa-spin mr-2"></i> Invite
                        </>
                      ) : (
                        <>
                          {" "}
                          <i
                            className="fal fa-user-plus mr-2"
                            aria-hidden="true"
                          ></i>{" "}
                          Invite
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InviteByDocUpload;
