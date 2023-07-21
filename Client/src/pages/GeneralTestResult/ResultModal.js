import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import Validator from "email-validator";
import Loader from "../../components/loader/Loader";
import { sendReminderMailUrl } from "../../services/ServiceUrls";
import { post } from "../../services/ApiServices";
import { FE_URL } from "../../constants/constants";

const ResultModal = (props) => {
  const [iLoader, setILoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  // member invite functionality
  const { email, name } = formData;

  const onChange = (e) => {
    if (e.target.name !== "email") {
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
  const onSubmit = async (e) => {
    e.preventDefault();
    if (formData.email === "" && formData.name === "") {
      toast.error("Please fill the required fields");
    } else if (Validator.validate(email) && formData.name === "") {
      toast.error("Please enter the name");
    } else if (formData.email === "" && formData.name !== "") {
      toast.error("Please enter the email address");
    } else if (!Validator.validate(email)) {
      toast.error("Please Enter Valid Email");
    } else if (!formData.email || !formData.name) {
      toast.error("Fill all the required data to invite a member.");
    } else {
      setILoader(true);
      setLoading(true);

      const candidateData = props.candidateData[0];
      const candidateInfo = candidateData || candidateData.candidateData;
      const companyInfo =
        candidateData.companyInfo || candidateInfo?.companyInfo;

      let mailBody = {
        companyName: companyInfo?.companyName || "High5Hire",
        candidateId: candidateInfo?._id,
        firstName: candidateInfo?.candidateInfo?.firstName,
        lastName: candidateInfo?.candidateInfo?.lastName,
        fullName: `${candidateInfo?.candidateInfo?.firstName} ${candidateInfo?.candidateInfo?.lastName}`,
        testName: candidateData?.testAssign?.testName.split("_")[0],
        testCategory: candidateData?.testAssign?.testCategory,
        email: email,
      };

      try {
        const res = await post(sendReminderMailUrl, mailBody);
        if (res.status === 200) {
          setILoader(false);
          setLoading(false);
          toast.success(`Result has been shared successfully`);
          props.setShowResultShareModal(false);
        }
      } catch (err) {
        console.log(err);
        setILoader(false);
        setLoading(false);
        toast.error(err.message);
        props.setShowResultShareModal(false);
      }
    }
  };

  let sendMailLink = `${FE_URL}/result/${props.candidateId}`;
  const handleCopy = (e) => {
    navigator.clipboard.writeText(sendMailLink);
    toast.success("Link Copied Successfully!!!");
  };

  return (
    <div>
      {loading && <Loader />}
      <div>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-12 col-lg-12">
              <div className=" section-sm px-4 pb-4">
                <h6 className="" id="CreateQuestionModalLabel">
                  Share
                </h6>
                <div className="input-group input-group-append mb-4">
                  <input
                    type="text"
                    className="form-control"
                    value={sendMailLink}
                    disabled
                    placeholder="Copy Share Link"
                    aria-label="Copy Share Link"
                    aria-describedby="button-addon2"
                  />
                  <button
                    className="btn btn-secondary"
                    onClick={handleCopy}
                    type="button"
                    id="button-addon2"
                  >
                    Copy
                  </button>
                </div>
                <h6 className="" id="CreateQuestionModalLabel">
                  Share by Email
                </h6>
                <form className="login-form ">
                  <div className="row g-2">
                    <div className="col-md form-floating">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Name"
                        name="name"
                        value={name}
                        onChange={(e) => {
                          e.target.value = e.target.value.replace(
                            /^[ \t]+|[ \t]+$/gm,
                            ""
                          );
                          onChange(e);
                        }}
                      />
                      <label>Name *</label>
                    </div>
                    <div className=" form-floating mb-2">
                      <input
                        type="text"
                        className="form-control"
                        name="email"
                        aria-describedby="emailHelp"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => {
                          e.target.value = e.target.value.replace(
                            /^[ \t]+|[ \t]+$/gm,
                            ""
                          );
                          onChange(e);
                        }}
                        autoComplete="new-email"
                      />
                      <label>Email address *</label>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="submit"
                      className="btn"
                      onClick={(e) => {
                        onSubmit(e);
                      }}
                      disabled={
                        formData.name?.length > 0 && formData.email?.length > 0
                          ? false
                          : true
                      }
                    >
                      {iLoader ? (
                        <>
                          <i className="fa fa-spinner fa-spin"></i> Share
                        </>
                      ) : (
                        "Share"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
