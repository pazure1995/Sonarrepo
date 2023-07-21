import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import SideNavBar from "../layout/SideNavBar";
import TopNavBar from "../layout/TopNavBar";
import Loader from "../../components/loader/Loader";
import Dropzone from "react-dropzone";
import { AsYouType } from "libphonenumber-js";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { getUserEmail } from "../../services/AuthServices";
import { getProfileData } from "../../redux/actions/profile/profile";
import { post } from "../../services/ApiServices";
import { updateProfileUrl } from "../../services/ServiceUrls";
import HereMap from "../../components/HereMap/HereMap";

const Profile = () => {
  const dispatch = useDispatch();
  const userEmail = getUserEmail();
  const { profileData, profileDataLoading } = useSelector(
    (state) => ({
      profileData: state.getProfileDataReducer.profileData,
      profileDataLoading: state.getProfileDataReducer.profileDataLoading,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (!profileData) {
      dispatch(getProfileData({ email: userEmail }));
    }
  }, [profileData]);

  const [toggle, setToggle] = useState(false);
  const [isFormInValid, setIsFormInValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imgFile, setFile] = useState({});
  const [editPswd, setEditPswd] = useState(false);
  const [onCLickEdit, setOnCLickEdit] = useState(false);
  const [phoneCode, setPhoneCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordValidation, setPasswordValidation] = useState(false);
  const [phoneValidation, setPhoneValidation] = useState(true);
  const [companyLogo, setCompanyLogo] = useState(
    profileData?.companyLogo === "" ? false : true
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  const [profileInfo, setProfileInfo] = useState({
    email: profileData?.email,
    firstName: "",
    lastName: "",
    companyName: "",
    companyLogo: "",
    address: "",
    city: "",
    state: "",
    country: "",
    phoneNumber: "",
    role: profileData?.role,
  });
  const [tempProfileInfo, setTempProfileInfo] = useState({});

  useEffect(() => {
    setCompanyLogo(profileData?.companyLogo === "" ? false : true);
  }, [onCLickEdit]);

  useEffect(() => {
    if (profileData) {
      let tempData = { ...profileInfo };
      tempData["firstName"] = profileData?.firstName;
      tempData["lastName"] = profileData?.lastName;
      tempData["companyName"] = profileData?.companyName;
      tempData["companyLogo"] = profileData?.companyLogo;
      tempData["address"] = profileData?.address;
      tempData["city"] = profileData?.city;
      tempData["state"] = profileData?.state;
      tempData["country"] = profileData?.country;
      tempData["email"] = profileData?.email;
      tempData["phoneNumber"] = profileData?.phoneNumber;
      tempData["role"] = profileData?.role;
      setProfileInfo(tempData);
    }
  }, [profileData]);

  const toggleDiv = (type) => {
    if (type === true) {
      setToggle(true);
    } else {
      setToggle(false);
    }
  };

  const saveChanges = async () => {
    if (
      !profileInfo.firstName ||
      !profileInfo.lastName ||
      !profileInfo.city ||
      !profileInfo.country ||
      !profileInfo.state ||
      (!phoneValidation && profileInfo?.phoneNumber?.length > phoneCode?.length)
    ) {
      !phoneValidation && toast.error("Please enter valid phone number");
      return setIsFormInValid(true);
    }

    const data = {
      firstName: profileInfo.firstName,
      lastName: profileInfo.lastName,
      companyLogo:
        companyLogo && imgFile?.base64?.length > 10
          ? {
              fileName: imgFile.fileName.split(".")[0],
              base64: imgFile.base64,
              fileType: imgFile.fileType,
            }
          : "",
      address: profileInfo?.address,
      city: profileInfo?.city,
      state: profileInfo?.state,
      country: profileInfo?.country,
      email: profileInfo.email,
      phoneNumber: profileInfo.phoneNumber,
      id: profileData?._id,
    };

    setLoading(true);
    await post(updateProfileUrl, { ...data })
      .then((resp) => {
        setOnCLickEdit(!onCLickEdit);
        dispatch(getProfileData({ email: userEmail }));
        toast.success("Profile Updated successfully");
        setIsFormInValid(false);
        setLoading(false);
      })
      .catch((err) => {
        setOnCLickEdit(!onCLickEdit);
        toast.error(err.message);
        setIsFormInValid(false);
        setLoading(false);
      });
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

  const handleChange = (e) => {
    setProfileInfo({ ...profileInfo, [e.target.id]: e.target.value });
  };

  const _onChangeText = (value, code, name) => {
    const asYouType = new AsYouType(code);
    asYouType.input(value);
    setPhoneValidation(asYouType.isValid());
    setProfileInfo({
      ...profileInfo,
      phoneNumber: value,
    });
  };

  const findFormErrors = () => {
    const newErrors = {};
    if (!password || password === "")
      newErrors.password = "Password Cannot Be Blank";
    else if (password.length < 8)
      newErrors.password = "Please Enter Minimum 8 Characters";
    else if (!confirmPassword || confirmPassword === "")
      newErrors.password = "Confirm Password Cannot Be Blank";
    else if (confirmPassword.length < 8)
      newErrors.password = "Please Enter Minimum 8 Characters";
    else if (!passwordValidation)
      newErrors.password = "Atleast 1 Number Or Special Character Is Required";
    else if (password && confirmPassword) {
      if (password !== confirmPassword)
        newErrors.password = "Password Do Not Match";
    }
    return newErrors;
  };

  const showPasswordClick = () => {
    setShowPassword(!showPassword);
  };
  const showCPasswordClick = () => {
    setShowCPassword(!showCPassword);
  };

  const onCreatePassword = async (e) => {
    e.preventDefault();
    const newErrors = findFormErrors();
    if (Object.keys(newErrors).length === 0) {
      await post(updateProfileUrl, {
        password: password,
        id: profileData?._id,
      });
      toast.success("Password Updated Successfully.");
      setEditPswd(false);
    } else {
      toast.error(newErrors.password);
    }
  };

  return (
    <>
      {(profileDataLoading || loading) && <Loader />}
      <body
        className={
          toggle === true ? "layout1 layout1-closed close-menu" : "layout1"
        }
      >
        <div className="body-decorator body-decorator-top"></div>
        <div className="body-decorator body-decorator-bottom"></div>
        <SideNavBar />
        <TopNavBar isFrom="profile" handleToggle={toggleDiv} />
        <div id="Content">
          <section className="section section-sm">
            <div className="hero">
              <div className="section pt-5">
                <div className="container">
                  <div className="row">
                    <div className="col-12">
                      <div className="d-flex flex-column align-items-center">
                        <div className="d-flex align-items-center justify-content-center mb-3">
                          <button
                            type="button"
                            className="btn btn-text-accent avatar avatar-lg  avatar-edit"
                          >
                            <div
                              className=" sb-avatar sb-avatar--text"
                              style={{
                                display: "inline-block",
                                verticalAlign: "middle",
                                width: 55,
                                height: 55,
                                borderRadius: 80,
                                fontFamily: "Helvetica, Arial, sans-serif",
                              }}
                            >
                              <div
                                className=" sb-avatar__text"
                                title={
                                  profileInfo.firstName +
                                  " " +
                                  profileInfo.lastName
                                }
                                style={{
                                  width: 55,
                                  height: 55,
                                  lineHeight: "initial",
                                  textAlign: "center",
                                  color: "rgb(255, 255, 255)",
                                  borderRadius: 80,
                                  background: "rgb(215, 61, 50)",
                                }}
                              >
                                <div
                                  style={{
                                    display: "table",
                                    tableLayout: "fixed",
                                    width: "100%",
                                    height: "100%",
                                    fontSize: 18.3333,
                                  }}
                                >
                                  <span
                                    style={{
                                      display: "table-cell",
                                      verticalAlign: "middle",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    <span>
                                      {onCLickEdit
                                        ? `${tempProfileInfo.firstName.charAt(
                                            0
                                          )}${tempProfileInfo.lastName.charAt(
                                            0
                                          )}`
                                        : `${profileInfo.firstName.charAt(
                                            0
                                          )}${profileInfo.lastName.charAt(0)}`}
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </button>
                          <span className="ms-3">
                            <h6 className="font-white">
                              {onCLickEdit
                                ? `${tempProfileInfo.firstName} ${tempProfileInfo.lastName}`
                                : profileInfo.firstName +
                                  " " +
                                  profileInfo.lastName}
                            </h6>
                            <span className="tag tag-brandblue">
                              {profileData?.role === "admin"
                                ? "Super Admin"
                                : profileData?.role === "companyAdmin"
                                ? "Company Admin"
                                : "Member"}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="translate-up-100">
              <div className="d-flex justify-content-center">
                <ul className="nav nav-tabs nav-tabs-white mt-3 flex-wrap flex-nowrap-md justify-content-center">
                  <li className="nav-item">
                    <button type="button" className="nav-link pb-3">
                      Account Details
                    </button>
                  </li>
                </ul>
              </div>
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-lg-6">
                    <div>
                      <form
                        action="/"
                        method="POST"
                        onSubmit={() => ""}
                        className={onCLickEdit ? "" : "read-only"}
                      >
                        <div className="card card-lg">
                          <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between">
                              <h6 className="mb-0">Contact Info</h6>
                              {onCLickEdit ? (
                                <div>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-secondary mr-3"
                                    onClick={() => {
                                      setOnCLickEdit(!onCLickEdit);
                                      setProfileInfo({
                                        ...tempProfileInfo,
                                        companyLogo: profileData?.companyLogo,
                                      });
                                      setIsFormInValid(false);
                                      setPhoneValidation(false);
                                      setCompanyLogo(true);
                                    }}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-primary"
                                    onClick={() => saveChanges()}
                                  >
                                    <span>Save Changes</span>
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  className="btn btn-text"
                                  onClick={() => {
                                    setOnCLickEdit(!onCLickEdit);
                                    setTempProfileInfo(profileInfo);
                                  }}
                                >
                                  <i
                                    className="fas fa-pencil-alt mr-1"
                                    aria-hidden="true"
                                  ></i>{" "}
                                  Edit
                                </button>
                              )}
                            </div>
                            <hr />
                            <div className="col-lg-12 col-md-12 col-sm-12">
                              <div className="row">
                                <div className="col-xl-6 col-lg-12 col-md-12 col-sm-12">
                                  <div className="form-floating mb-2">
                                    <input
                                      type="text"
                                      id="firstName"
                                      aria-describedby="FirstName"
                                      placeholder="First name"
                                      name="firstName"
                                      className="form-control"
                                      disabled={onCLickEdit ? false : true}
                                      onChange={(e) =>
                                        setProfileInfo({
                                          ...profileInfo,
                                          firstName: e.target.value,
                                        })
                                      }
                                      value={profileInfo.firstName}
                                    />
                                    <label for="firstName">First name*</label>
                                    {isFormInValid &&
                                      profileInfo.firstName === "" && (
                                        <small className="validation">
                                          *Required Field
                                        </small>
                                      )}
                                  </div>
                                </div>
                                <div className="col-xl-6 col-lg-12 col-md-12 col-sm-12">
                                  <div className="form-floating mb-2">
                                    <input
                                      type="text"
                                      id="lastName"
                                      name="lastName"
                                      aria-describedby="LastName"
                                      placeholder="Last name"
                                      className="form-control"
                                      disabled={onCLickEdit ? false : true}
                                      onChange={(e) =>
                                        setProfileInfo({
                                          ...profileInfo,
                                          lastName: e.target.value,
                                        })
                                      }
                                      value={profileInfo.lastName}
                                    />
                                    <label for="lastName">Last name*</label>
                                    {isFormInValid &&
                                      profileInfo.lastName === "" && (
                                        <small className="validation">
                                          *Required Field
                                        </small>
                                      )}
                                  </div>
                                </div>

                                <div className="col-12">
                                  <div className="form-floating mb-2">
                                    <input
                                      type="email"
                                      id="hmEmail"
                                      name="email"
                                      aria-describedby="hiringMangerEmail"
                                      placeholder="Email"
                                      className="form-control"
                                      disabled
                                      onChange={(e) =>
                                        setProfileInfo({
                                          ...profileInfo,
                                          email: e.target.value,
                                        })
                                      }
                                      value={profileInfo.email}
                                    />
                                    <label for="hmEmail">Email*</label>
                                  </div>
                                </div>

                                {onCLickEdit && (
                                  <div
                                    className="col-lg-12"
                                    style={{ height: 100, width: "100vw" }}
                                  >
                                    <div
                                      className="form-floating"
                                      style={{
                                        display: !onCLickEdit
                                          ? "none"
                                          : "block",
                                      }}
                                    >
                                      <HereMap
                                        setProfileInfo={setProfileInfo}
                                        profileInfo={profileInfo}
                                      />
                                    </div>
                                  </div>
                                )}

                                {profileInfo.address !== "" && (
                                  <label for="" className="mb-2 ms-2">
                                    Address
                                  </label>
                                )}

                                <div className="col-lg-12">
                                  <div className="form-floating mb-2">
                                    <input
                                      type="text"
                                      id="hmAddress"
                                      name="address"
                                      aria-describedby="hiringMangerAddress"
                                      placeholder="Address"
                                      className="form-control"
                                      disabled={onCLickEdit ? false : true}
                                      onChange={(e) =>
                                        setProfileInfo({
                                          ...profileInfo,

                                          address: e.target.value,
                                        })
                                      }
                                      value={profileInfo.address}
                                    />
                                    <label for="hmAddress">Address</label>
                                  </div>
                                </div>

                                <div className="col-xl-4 col-lg-12 col-md-12 col-sm-12">
                                  <div className="form-floating mb-2">
                                    <input
                                      type="text"
                                      id="hmCity"
                                      name="city"
                                      aria-describedby="hiringManagerCity"
                                      placeholder="City"
                                      className="form-control"
                                      disabled={onCLickEdit ? false : true}
                                      onChange={(e) =>
                                        setProfileInfo({
                                          ...profileInfo,

                                          city: e.target.value,
                                        })
                                      }
                                      value={profileInfo.city}
                                    />
                                    <label for="hmCity">City*</label>{" "}
                                    {isFormInValid &&
                                      profileInfo.city === "" && (
                                        <small className="validation">
                                          *Required Field
                                        </small>
                                      )}
                                  </div>
                                </div>

                                <div className="col-xl-4 col-lg-12 col-md-12 col-sm-12">
                                  <div className="form-floating mb-2">
                                    <input
                                      type="text"
                                      id="hmState"
                                      name="state"
                                      aria-describedby="hiringManagerState"
                                      placeholder="State"
                                      className="form-control"
                                      disabled={onCLickEdit ? false : true}
                                      onChange={(e) =>
                                        setProfileInfo({
                                          ...profileInfo,

                                          state: e.target.value,
                                        })
                                      }
                                      value={profileInfo.state}
                                    />
                                    <label for="hmState">State*</label>{" "}
                                    {isFormInValid &&
                                      profileInfo.state === "" && (
                                        <small className="validation">
                                          *Required Field
                                        </small>
                                      )}
                                  </div>
                                </div>

                                <div className="col-xl-4 col-lg-12 col-md-12 col-sm-12">
                                  <div className="form-floating mb-2">
                                    <input
                                      type="text"
                                      id="hmCountry"
                                      name="country"
                                      aria-describedby="hiringManagerCountry"
                                      placeholder="Country"
                                      className="form-control"
                                      disabled={onCLickEdit ? false : true}
                                      onChange={(e) =>
                                        setProfileInfo({
                                          ...profileInfo,

                                          country: e.target.value,
                                        })
                                      }
                                      value={profileInfo.country}
                                    />
                                    <label for="hmCountry">Country*</label>{" "}
                                    {isFormInValid &&
                                      profileInfo.country === "" && (
                                        <small className="validation">
                                          *Required Field
                                        </small>
                                      )}
                                  </div>
                                </div>

                                <div className="col-12 mb-2 mt-3">
                                  <label className="ms-2 mb-2 p-0" for="">
                                    Phone number
                                  </label>
                                  <PhoneInput
                                    inputStyle={{
                                      width: "100%",
                                      height: 60,
                                    }}
                                    required="true"
                                    placeholder="Phone number"
                                    country={"us"}
                                    id="phoneNumber"
                                    value={profileInfo.phoneNumber}
                                    name="phoneNumber"
                                    onChange={(value, country) => {
                                      setPhoneCode(country.dialCode);
                                      _onChangeText(
                                        value.replace(country.dialCode, ""),
                                        country.countryCode.toUpperCase()
                                      );
                                      handleChange({
                                        target: {
                                          id: "phoneNumber",
                                          value: value,
                                        },
                                      });
                                    }}
                                    disabled={!onCLickEdit}
                                  />
                                  {!phoneValidation &&
                                    isFormInValid &&
                                    profileInfo?.phoneNumber?.length >
                                      phoneCode?.length && (
                                      <small className="validation">
                                        Invalid phone number
                                      </small>
                                    )}
                                </div>
                                {profileData?.role !== "member" && (
                                  <div className="col-12 form-floating">
                                    {onCLickEdit ? (
                                      <div className="border rounded-3 mb-3 p-2">
                                        {companyLogo ? (
                                          <div className="mr-2 p-3">
                                            <span>
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  setCompanyLogo(false);
                                                  setProfileInfo({
                                                    ...profileInfo,
                                                    companyLogo: "",
                                                  });
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
                                            <p className="m-0 mr-2">
                                              Do you want to upload the Company
                                              logo?
                                            </p>
                                            <Dropzone
                                              onDrop={(file) =>
                                                onUploadHandler(file)
                                              }
                                              multiple={false}
                                            >
                                              {({
                                                getRootProps,
                                                getInputProps,
                                              }) => (
                                                <div
                                                  {...getRootProps()}
                                                  className=""
                                                >
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
                                                Accepted file types: JPG, JPEG,
                                                PNG <br /> File size: upto 2 MB
                                              </small>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <img
                                        src={profileInfo.companyLogo}
                                        alt=""
                                        width={100}
                                      />
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                      {/* className="read-only" */}
                      <form action="/" method="POST" className="">
                        <div className="card card-lg mt-3">
                          <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between">
                              <h6 className="mb-0">Security</h6>
                              {editPswd ? (
                                <div>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-secondary mr-3"
                                    onClick={() => {
                                      setEditPswd(false);
                                      setPasswordValidation(false);
                                    }}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-primary"
                                    onClick={(e) => {
                                      onCreatePassword(e);
                                    }}
                                  >
                                    <span>Save Changes</span>
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  v-if="form.security.readOnly"
                                  className="btn btn-text"
                                  onClick={() => {
                                    setEditPswd(true);
                                    setPassword("");
                                    setConfirmPassword("");
                                  }}
                                >
                                  <i
                                    className="fas fa-pencil-alt mr-1"
                                    aria-hidden="true"
                                  ></i>
                                  Change password
                                </button>
                              )}
                            </div>

                            {editPswd && (
                              <div>
                                <hr />
                                <div className="mb-3">
                                  <p className="mt-2">
                                    <small>
                                      <strong className="mr-2 mb-1 d-block">
                                        Password requirements
                                      </strong>
                                    </small>
                                    <span
                                      className={
                                        password?.length < 8
                                          ? "tag mr-2"
                                          : "tag mr-2 tag-green2"
                                      }
                                    >
                                      Min 8 Characters
                                      {password?.length < 8 ? (
                                        <i className="ml-1 far fa-circle"></i>
                                      ) : (
                                        <i className="ml-1 fas fa-check-circle"></i>
                                      )}
                                    </span>
                                    <span
                                      className={
                                        passwordValidation !== true
                                          ? "tag mr-2"
                                          : "tag mr-2 tag-green2"
                                      }
                                    >
                                      1 Number Or Special Character
                                      {passwordValidation !== true ? (
                                        <i className="ml-1 far fa-circle"></i>
                                      ) : (
                                        <i className="ml-1 fas fa-check-circle"></i>
                                      )}
                                    </span>
                                  </p>
                                </div>
                                <div className="form-floating mb-2 form-password">
                                  <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-control"
                                    name="password"
                                    placeholder="password"
                                    value={password}
                                    onChange={(e) => {
                                      setPassword(e.target.value);
                                      let specialCharacterPresent =
                                        /^(?=.*[!@#$%^&*])/;
                                      let numberPresent = /^(?=.*[0-9])/;
                                      if (
                                        numberPresent.test(e.target.value) ||
                                        specialCharacterPresent.test(
                                          e.target.value
                                        )
                                      ) {
                                        setPasswordValidation(true);
                                      } else {
                                        setPasswordValidation(false);
                                      }
                                    }}
                                    autoComplete="new-password"
                                  />
                                  <label>Password*</label>
                                  {password.length > 0 && (
                                    <button
                                      onClick={showPasswordClick}
                                      type="button"
                                      className="btn btn-sm btn-text btn-text-accent h-100"
                                    >
                                      <i
                                        className={
                                          showPassword
                                            ? "fa fa-eye"
                                            : "fa fa-eye-slash"
                                        }
                                        aria-hidden="true"
                                      ></i>
                                    </button>
                                  )}
                                </div>
                                <div className="form-floating mb-2 form-password">
                                  <input
                                    type={showCPassword ? "text" : "password"}
                                    className="form-control"
                                    name="password"
                                    placeholder="password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                      setConfirmPassword(e.target.value)
                                    }
                                    autoComplete="new-password"
                                    disabled={
                                      password?.length < 8 ||
                                      !passwordValidation
                                    }
                                  />
                                  <label>Confirm Password*</label>
                                  {confirmPassword.length > 0 && (
                                    <button
                                      onClick={showCPasswordClick}
                                      type="button"
                                      className="btn btn-sm btn-text btn-text-accent h-100"
                                    >
                                      <i
                                        className={
                                          showCPassword
                                            ? "fa fa-eye"
                                            : "fa fa-eye-slash"
                                        }
                                        aria-hidden="true"
                                      ></i>
                                    </button>
                                  )}
                                </div>{" "}
                                {password !== confirmPassword &&
                                  confirmPassword.length > 1 &&
                                  password.length > 1 && (
                                    <small className="validation">
                                      Password do not match
                                    </small>
                                  )}
                              </div>
                            )}
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </body>
    </>
  );
};

export default Profile;
