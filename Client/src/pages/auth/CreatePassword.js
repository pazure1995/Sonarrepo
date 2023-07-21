import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { SetPasswordSideImage, LoginAppLogo } from "../../constants/constants";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import { post } from "../../services/ApiServices";
import { resetPasswordUrl } from "../../services/ServiceUrls";

import jwt_decode from "jwt-decode";
import moment from "moment";
import expiredImg from "../../assets/images/expired.png";
import Loader from "../../components/loader/Loader";

const CreatePassword = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [password, setPassword] = useState("");
  const [passwordValidation, setPasswordValidation] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({});
  const [isExpired, setIsExpired] = useState(false);
  // const [loading, setLoading] = useState(true);

  let errors = "";

  const findFormErrors = () => {
    const newErrors = {};

    if (!password || password === "")
      newErrors.password = "Password cannot be blank";
    else if (password.length < 8)
      newErrors.password = "Please enter minimum 8 characters";
    else if (!confirmPassword || confirmPassword === "")
      newErrors.password = "Confirm password cannot be blank";
    else if (confirmPassword.length < 8)
      newErrors.password = "Please enter minimum 8 characters";
    else if (!passwordValidation)
      newErrors.password = "Atleast 1 Number Or Special Character is required";
    else if (password && confirmPassword) {
      if (password !== confirmPassword)
        newErrors.password = "Password does not match";
    }
    return newErrors;
  };

  const onCreatePassword = (e) => {
    e.preventDefault();
    const newErrors = findFormErrors();

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      post(resetPasswordUrl, { id: params.id, password: password })
        .then(async (res) => {
          if (res.data) {
            toast.success("Password updated successfully.");
            localStorage.clear();
            navigate("/");
          }
        })
        .catch((err) => {
          console.log("err caught", err);
          toast.error(err.response?.data?.message);
          setLoading(false);
        });
    } else {
      toast.error(newErrors.password);
      console.log("newErrors", newErrors);
    }
  };
  return (
    <>
      {loading && <Loader />}
      <>
        <div id="PasswordSetup" className="login-layout">
          <div className="col-left d-flex align-items-center">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-7">
                  <div className="success-animation"></div>
                  <div className="{ 'd-none': formComplete }">
                    <a className="logo" href="/">
                      <img src={LoginAppLogo} alt="" />
                    </a>
                    <div className="section section-sm">
                      <h2>Set Your New Password</h2>
                      <p>
                        Enter the password you would like to set for your
                        account.
                      </p>
                      <div className="mb-3">
                        <p className="mt-2">
                          <small>
                            <strong className="mr-2 mb-1 d-block">
                              Password Requirements
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
                      <div className="form-floating mb-2">
                        <input
                          type="password"
                          className="form-control"
                          name="password"
                          placeholder="password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            let specialCharacterPresent = /^(?=.*[!@#$%^&*])/;
                            let numberPresent = /^(?=.*[0-9])/;
                            if (
                              numberPresent.test(e.target.value) ||
                              specialCharacterPresent.test(e.target.value)
                            ) {
                              setPasswordValidation(true);
                            } else {
                              setPasswordValidation(false);
                            }
                          }}
                          autoComplete="new-password"
                        />
                        <label>Password *</label>
                        <small className="validation">{errors.email}</small>
                      </div>
                      <div className="form-floating mb-2">
                        <input
                          type="password"
                          className="form-control"
                          name="password"
                          placeholder="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          autoComplete="new-password"
                          disabled={password?.length < 8 || !passwordValidation}
                        />
                        <label>Confirm Password *</label>
                        <small className="validation">{errors.email}</small>
                      </div>
                      <button
                        type="submit"
                        className="btn btn-dark w-100"
                        // disabled={loading}
                        onClick={(e) => onCreatePassword(e)}
                      >
                        <span>Create Password</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="col-right bg-cover bg-center"
            style={{
              backgroundImage: `url(${SetPasswordSideImage})`,
              height: "auto",
            }}
          ></div>
        </div>
      </>
      {/* {loading && <Loader />}
      {user?.token && !isExpired ? (
        
      ) : loading ? (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            backgroundColor: "lightGray",
            color: "#00404a",
          }}
          className="d-flex justify-content-center align-items-center pb-5"
        >
          <div>
            <h4>Loading...</h4>
          </div>
        </div>
      ) : (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            backgroundColor: "lightGray",
            color: "#00404a",
          }}
          className="d-flex justify-content-center align-items-center pb-5"
        >
          <img src={expiredImg} alt="" width={200} />
          <div>
            <h1>Oops, this link is expired </h1>
            <h4>This URL is not valid anymore.</h4>
          </div>
        </div>
      )} */}
    </>
  );
};

export default CreatePassword;
