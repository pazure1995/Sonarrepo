import React, { Fragment, useEffect, useState } from "react";
import Validator from "email-validator";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoginAppLogo } from "../../constants/constants";
import { authData } from "../../redux/actions/auth/auth";
import Loader from "../../components/loader/Loader";
import { post } from "../../services/ApiServices";
import { getUserToken } from "../../services/AuthServices";
import { loginUrl } from "../../services/ServiceUrls";

const Login = () => {
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const token = getUserToken();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  }, [token]);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Call Action Login
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!Validator.validate(formData.email)) {
      toast.error("Please Enter Valid Email ID");
      setLoading(false);
    } else if (formData.email !== "" && formData.password === "") {
      toast.error("Please Enter Your Password");
      setLoading(false);
    } else {
      post(loginUrl, formData)
        .then(async (res) => {
          if (res.data) {
            localStorage.setItem("userToken", JSON.stringify(res.data));
            dispatch(authData(res.data));
            navigate("/dashboard");
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log("err caught", err);
          toast.error(err.response?.data?.message);
          setLoading(false);
          if (err.response?.data?.message === "Incorrect Password!")
            setFormData({ ...formData, password: "" });
        });
    }
  };

  const showPasswordClick = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Fragment>
      {loading && <Loader />}
      <div id="Login" className="login-layout">
        <div className="col-left d-flex align-items-center">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xl-6 col-lg-8">
                <a className="logo" href="/" style={{ marginTop: "6rem" }}>
                  <img src={LoginAppLogo} alt="Login logo" />
                </a>
                <div
                  className="section section-sm"
                  style={{ paddingTop: "50px" }}
                >
                  <h1>Sign In.</h1>
                  <p>Welcome! Sign in to get started </p>
                  <form className="login-form" onSubmit={(e) => onSubmit(e)}>
                    <div className="form-floating mb-2">
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        aria-describedby="emailHelp"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={(e) => onChange(e)}
                        autoComplete="new-email"
                      />
                      <label>Email</label>
                    </div>
                    <div className="form-floating mb-2 form-password">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => onChange(e)}
                        autoComplete="new-password"
                      />
                      <label>Password</label>

                      {formData.password.length > 0 && (
                        <button
                          onClick={showPasswordClick}
                          type="button"
                          className="btn btn-sm btn-text btn-text-accent h-100"
                        >
                          <i
                            className={
                              showPassword ? "fa fa-eye" : "fa fa-eye-slash"
                            }
                            aria-hidden="true"
                          ></i>
                        </button>
                      )}
                    </div>
                    <p className="text-right mb-4">
                      <a
                        href="/forgot-password"
                        className=""
                        style={{ color: "red" }}
                      >
                        Forgot Password?
                      </a>
                    </p>
                    <button type="submit" className="btn btn-dark w-100">
                      Login
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-right"></div>
      </div>
    </Fragment>
  );
};

export default Login;
