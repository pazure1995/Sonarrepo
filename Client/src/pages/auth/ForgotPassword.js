import React, { useState } from "react";
import { toast } from "react-toastify";
import { LoginAppLogo } from "../../constants/constants";
import { post } from "../../services/ApiServices";
import { EmailValidator } from "../../components/emailvalidator/EmailValidator";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  let navigate = useNavigate();
  const [email, setEmail] = useState("");
  let [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    let isEmailValid = EmailValidator(email);
    if (isEmailValid.length > 0) {
      toast.error("Please Enter Valid Email");
    } else if (email === "") {
      toast.error("Please Enter Email");
    } else {
      setLoading(true);
      await post(`/api/users/forgotPassword`, { email: email })
        .then((res) => {
          toast.success(res.data.message);
          navigate("/");
        })
        .catch((error) => {
          setLoading(false);
          toast.error(error.response.data.message);
        });
    }
  };

  return (
    <>
      <div id="ForgotPassword" className="login-layout">
        <div className="col-left d-flex align-items-center">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xl-6 col-lg-8">
                <div>
                  <a className="logo" href="/">
                    <img src={LoginAppLogo} alt="" />
                  </a>
                  <div
                    className="section section-sm"
                    style={{ paddingTop: "50px" }}
                  >
                    <h1>Forgot Password?</h1>
                    <p>
                      Enter the email address of your account and we’ll send you
                      the instructions to reset your password
                    </p>
                    <form onSubmit={onSubmit}>
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          className="form-control"
                          name="email"
                          placeholder="Enter email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <label>Email address*</label>
                      </div>
                      <button
                        type="submit"
                        className="btn btn-dark w-100"
                        disabled={loading}
                      >
                        <span>Reset Password</span>
                      </button>
                      <p className="text-center mt-5">
                        Remember Your Password? <a href="/">Login</a>
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-right"></div>
      </div>
    </>
  );
};

export default ForgotPassword;
