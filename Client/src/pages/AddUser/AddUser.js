import React, { Fragment, useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import Validator from "email-validator";
import Loader from "../../components/loader/Loader";
import { post } from "../../services/ApiServices";
import { addUserUrl } from "../../services/ServiceUrls";
import { getUserRole, getUserToken } from "../../services/AuthServices";

const AddUser = (props) => {
  const Token = getUserToken();
  const role = getUserRole();
  const [imgFile, setFile] = useState({});
  const [companyLogo, setCompanyLogo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    firstName: "",
    lastName: "",
    email: "",
  });

  const [errors, setError] = useState({});

  useEffect(() => {
    setFormData({
      companyName: "",
      firstName: "",
      lastName: "",
      email: "",
    });
  }, []);

  useEffect(() => {
    let temp = { ...formData };
    if (role === "companyAdmin") {
      temp["companyName"] = Token.companyName;
      setFormData(temp);
    }
  }, []);

  const { email, companyName, firstName, lastName } = formData;
  const onChange = (e) => {
    if (e.target.name === "firstName" || e.target.name === "lastName") {
      const input =
        e.target.value
          .charAt(0)
          .toUpperCase()
          .replace(/[^a-zA-Z\s]/, "") +
        e.target.value.slice(1).replace(/[^a-zA-Z\s]/, "");
      setFormData({ ...formData, [e.target.name]: input });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const validatorFunction = () => {
    let formIsValid = true;
    let errorData = {};

    if (formData.firstName === "") {
      formIsValid = false;
      errorData["firstName"] = "Please enter the first name";
    }
    if (formData.lastName === "") {
      formIsValid = false;
      errorData["lastName"] = "Please enter the last name";
    }
    if (formData.email === "") {
      formIsValid = false;
      errorData["email"] = "Please enter the email";
    }
    if (formData.email) {
      if (!Validator.validate(email)) {
        formIsValid = false;
        errorData["email"] = "Please enter valid email";
      }
    }
    if (formData.companyName === "") {
      formIsValid = false;
      errorData["companyName"] = "Please enter company name";
    }
    setError(errorData);
    return formIsValid;
  };

  // Call Action Invite
  const onSubmit = async (e) => {
    e.preventDefault();
    const isValid = validatorFunction();
    if (isValid) {
      setLoading(true);
      const generateCompanyId = () => {
        let length = 6,
          charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
          retVal = "";
        for (let i = 0, n = charset.length; i < length; ++i) {
          retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
      };

      let companyId =
        role === "companyAdmin" ? Token.companyId : generateCompanyId();
      let user = {
        companyName: companyName,
        createdBy: Token.id,
        createdByEmail: Token.email,
        createdByName: Token.firstName,
        createdByCompany: Token.companyName,
        companyId: companyId,
        firstName: firstName,
        lastName: lastName,
        email: email,
        createdByRole: Token.role,
        companyLogo:
          role === "admin"
            ? companyLogo && imgFile?.base64?.length > 10
              ? {
                  fileName: imgFile.fileName.split(".")[0],
                  base64: imgFile.base64,
                  fileType: imgFile.fileType,
                }
              : ""
            : Token.companyLogo,
      };

      post(addUserUrl, {
        ...user,
      })
        .then((res) => {
          setLoading(false);

          toast.success(`${formData.firstName} has been invited successfully`);
          props.setShowAddUserModal(false);
          props.getAllUsersData();
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
          toast.error(err.response.data.message);
        });
    }
  };

  const onClickUpdateUser = async (e) => {
    e.preventDefault();
    // const id = props.userData._id;
    // const data = {
    //   companyName: formData.companyName,
    //   name: formData.name,
    // };
  };

  const onUploadHandler = async (e) => {
    setCompanyLogo(true);
    const { name } = e[0];
    let type = name.split(".")[1];
    const reader = new FileReader();
    reader.readAsDataURL(e[0]);
    reader.onload = (event) => {
      setFile({
        fileName: name,
        base64: event.target.result,
        fileType: type,
      });
    };
  };

  return (
    <Fragment>
      {loading && <Loader />}

      <Modal
        show={props.showAddUserModal || props.editUser}
        size="lg"
        className="modal fade"
        data-backdrop="static"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >
        <div className="modal-header" id="EditQuestionModal">
          <h6 className="modal-title" id="EditQuestionModalLabel">
            {props.userData
              ? "Update user details"
              : role === "companyAdmin"
              ? "Invite member"
              : "Invite user"}
          </h6>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            onClick={() => {
              props.setShowAddUserModal(false);
              props.setEditUser(false);
            }}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <Modal.Body>
          <div className="container">
            <div className="d-flex  align-items-center">
              <label className="ml-auto mr-4">*Denotes mandatory field</label>
            </div>
            <div className="row justify-content-center">
              <div className="col-xl-12 col-lg-12">
                <div className=" section-sm px-4 pb-3">
                  <form className=" login-form mt-3 ">
                    <div className="row g-2 p-2 rounded-3 card">
                      <div className="col-md form-floating">
                        <input
                          type="text"
                          className="form-control"
                          name="firstName"
                          aria-describedby="emailHelp"
                          placeholder="First name"
                          value={firstName}
                          style={{
                            border: errors["firstName"] && "2px solid #ff0000",
                          }}
                          onChange={(e) => {
                            e.target.value = e.target.value.replace(
                              /^[ \t]+|[ \t]+$/gm,
                              ""
                            );
                            onChange(e);
                          }}
                          autoComplete="new-email"
                        />
                        <label>First name*</label>
                        <small className="validation">
                          {errors["firstName"]}
                        </small>
                      </div>
                      <div className="col-md form-floating">
                        <input
                          type="text"
                          className="form-control"
                          name="lastName"
                          aria-describedby="emailHelp"
                          placeholder="Last name"
                          style={{
                            border: errors["lastName"] && "2px solid #ff0000",
                          }}
                          value={lastName}
                          onChange={(e) => {
                            e.target.value = e.target.value.replace(
                              /^[ \t]+|[ \t]+$/gm,
                              ""
                            );
                            onChange(e);
                          }}
                          autoComplete="new-email"
                        />
                        <label>Last name*</label>
                        <small className="validation">
                          {errors["lastName"]}
                        </small>
                      </div>
                      <div className="form-floating ">
                        <input
                          type="text"
                          className="form-control"
                          name="email"
                          aria-describedby="emailHelp"
                          placeholder="Email"
                          style={{
                            border: errors["email"] && "2px solid #ff0000",
                          }}
                          value={email}
                          onChange={(e) => {
                            e.target.value = e.target.value.replace(
                              /^[ \t]+|[ \t]+$/gm,
                              ""
                            );
                            onChange(e);
                          }}
                          autoComplete="new-email"
                          disabled={props.userData ? true : false}
                        />
                        <label>Email address*</label>
                        <small className="validation">{errors["email"]}</small>
                      </div>
                      <div className="col-12 form-floating">
                        <input
                          type="text"
                          className="form-control"
                          name="companyName"
                          aria-describedby="emailHelp"
                          placeholder="Company name"
                          disabled={role === "companyAdmin"}
                          style={{
                            border:
                              errors["companyName"] && "2px solid #ff0000",
                          }}
                          value={companyName}
                          onChange={(e) => {
                            e.target.value = e.target.value.replace(
                              /^[ \t]+|[ \t]+$/gm,
                              ""
                            );
                            onChange(e);
                          }}
                          autoComplete="new-email"
                        />
                        <label>Company name*</label>
                        <small className="validation">
                          {errors["companyName"]}
                        </small>
                      </div>

                      {role === "admin" && (
                        <div className="col-12 form-floating">
                          <div className="border rounded-3 p-2">
                            {companyLogo ? (
                              <div className="mr-2">
                                <span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setCompanyLogo(false);
                                    }}
                                    className="btn btn-icon"
                                    title="Delete"
                                  >
                                    <i className="fa fa-trash mr-2"></i>
                                  </button>
                                  Logo Uploaded Successfully
                                  <i
                                    className="fas ml-1 fa-check-circle"
                                    style={{
                                      color: "green",
                                      fontSize: 20,
                                    }}
                                  ></i>
                                </span>
                              </div>
                            ) : (
                              <div className="d-flex align-items-center">
                                <p className="mr-2">
                                  Do you want to upload the Company logo?
                                </p>
                                <Dropzone
                                  onDrop={(file) => onUploadHandler(file)}
                                  multiple={false}
                                >
                                  {({ getRootProps, getInputProps }) => (
                                    <div {...getRootProps()} className="">
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-secondary"
                                      >
                                        <i className="far fa-cloud-upload mr-1 fa-fw"></i>
                                        Upload
                                      </button>
                                      <input
                                        type="file"
                                        {...getInputProps()}
                                        accept=".jpg, .png, .jpeg"
                                      />
                                    </div>
                                  )}
                                </Dropzone>
                                <div className="ml-3">
                                  <small>
                                    Accepted file types: JPG, JPEG, PNG <br />{" "}
                                    File size: upto 2 MB
                                  </small>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer mt-4 mb-0">
            {props.userData ? (
              <div className="d-flex justify-content-end">
                <i className="fal fa-user-plus mr-2" aria-hidden="true"></i>
                <button onClick={(e) => onClickUpdateUser(e)}>
                  <i className="fal fa-user-plus mr-2" aria-hidden="true"></i>
                  Invite
                </button>
              </div>
            ) : (
              <div className="text-right mb-2 mr-2">
                <button
                  className="btn  btn-secondary mr-2"
                  onClick={(e) => {
                    props.setShowAddUserModal(false);
                    e.preventDefault();
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn  btn-primary"
                  onClick={(e) => onSubmit(e)}
                >
                  <i className="fal fa-user-plus mr-2" aria-hidden="true"></i>
                  Invite
                </button>
              </div>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </Fragment>
  );
};

export default AddUser;
