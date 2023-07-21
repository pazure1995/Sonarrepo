import React, { useState } from "react";
import logo from "../../assets/images/High5Logo.png";

const ReviewInstructions = ({ setInstruction, setLoading }) => {
  const [readInstructions, setReadInstructions] = useState(false);
  return (
    <>
      <div
        className="d-flex p-2 shadow p-3 border-bottom justify-content-between"
        style={{
          backgroundColor: "#fff",
          height: "10vh",
          minHeight: 65,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10000,
        }}
      >
        <img src={logo} alt="logo" />
      </div>

      <div
        style={{
          width: "100vw",
          flexDirection: "column",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        className="overflow-auto rounded-3 p-4 mb-4 mt-5"
      >
        <div className="container-fluid">
          <div className="row position-relative mt-5">
            <div className="offset-xxl-2 col-xxl-8 offset-xl-1 col-xl-10 col-lg-12 col-md-12 col-sm-12">
              <div className="card card-xl">
                <div className="card-body">
                  <div className="Sspace"></div>
                  <h4 className="font-bold mb-5">Instruction for reviewer</h4>
                  <p className="px-2">
                    <p>
                      High5Hire authenticates and streamlines the remarkable
                      assessment procedure for designating candidates of worthy
                      caliber. The renowned High5Hire organization puts forward
                      the operation of the "Vetting Platform" application. The
                      Vetting platform serves as a helping hand to facilitate
                      the employment procedure at every hierarchical level. The
                      employment is based upon the evaluation through one-way or
                      MCQs or a general assessment. We provide you with the best
                      authority and services to assign clients for various
                      purposes. It encompasses correspondence between the
                      recruiters, hiring managers, reviewers, interviews, and
                      job-seeking candidates, stimulation of job posting on
                      behalf of our clients. After the assessment submission
                      from the candidate's end, the evaluation will be
                      redirected to the designated reviewers. High5Hire has
                      furnished a seamlessly accessible portal for all users,
                      including every entity of the corporate hierarchy.
                    </p>
                    <p>
                      Assembling and processing data have relied on the consent
                      of the user. We serve accountability of all the info by
                      employment offered and candidates through the High5Hire
                      portal. Various modules have been delineated for
                      rationalized systems and management. Such as the Super
                      admin module, Community manager, Staffing recruiter,
                      coordinator, etc. Assessments are fabricated upon the
                      skills and difficulty level requirement for the respected
                      job posting. The details of assessment accessibility are
                      used to offer before the operation by system-generated
                      mail.{" "}
                    </p>
                    <p>
                      There are three kinds of assessment consisting of
                      questions: MCQ, OneWay, and Multiline. During the
                      evaluation period, a prime timer will begin at the
                      top-right corner. The general review comprises
                      single-attempt questions. After the final submission, you
                      won't be allowed to re-access it. In the case of MCQs, the
                      candidate needs to select the right option from the
                      multiple choices given with each question. Each question
                      has multiple (2 or more) options, and the candidate has to
                      choose the correct option. For OneWay questions, during
                      the test time allotted, will be displayed below the
                      recording screen for submission of response. The recording
                      will stop automatically after the time limit has been
                      reached. Candidates can either submit or re-take the
                      answer (if the option is available).
                    </p>
                    <p>
                      For the Multiline Question, the candidate will write the
                      descriptive answer in the text box.{" "}
                    </p>
                    <p>
                      Miscellaneous instructions for the accomplished assessment
                      are included in the points below:
                    </p>
                    <ul className=" d-flex flex-column px-5 gap-1">
                      <li>
                        ● The candidate needs to attempt each question to
                        proceed to the next question.{" "}
                      </li>
                      <li>
                        ● A reversal to the previous question isn't available.{" "}
                      </li>
                      <li>
                        ● In any case of failure of submission of the test due
                        to any hardware/software/internet failure at the
                        candidate's end, the result will not be processed, and
                        you will be marked absent.{" "}
                      </li>
                      <li>
                        ● Ensure the final submission only after completing the
                        assessment.
                      </li>
                    </ul>
                    <p>
                      High5Hire infallible data retention and privacy policy
                      share a reliable ground for all the data provided by the
                      user, including different types of assessments, reviews,
                      interviews, responses, and submissions. We put forward the
                      outcomes after thoroughly evaluating these data by the
                      responsible authority.{" "}
                    </p>
                    <p>
                      High5Hire ensures the privacy, confidentiality, and
                      security of data from any data breach for identification
                      purposes. Biometrics systems are generated for the
                      protection consequences. Although, we are sharing the
                      authority to convert raw data to other formats for
                      internal users and services. Sharing of data in
                      correspondence between clients and other users may occur.
                      The data provided by candidates or users for
                      pre-employment purposes, such as video responses, digital
                      interviews, submitted answers, user's first and last name,
                      email address, mobile numbers, resume, address, city,
                      country, submission dates, and screenings, will be
                      accessible, recorded and documented for future ambitions.
                      On the other hand, documents submitted by candidates for
                      jobs posted by clients might consist of sensitive data
                      that will be kept highly secured by privacy laws. We
                      provide you the authority to revoke or withdraw the
                      permission from the acquisition, handling, and utilization
                      of the personal database at any point. For any assistance,
                      free free to contact us at alerts@high5hire.com. After
                      processing the request, we will connect to the data
                      controller client. By taking precautions with the best
                      possible security, as requested, get information deleted
                      or removed. In the context of our services or application
                      portal, insurance for safety measures is taken. We forbid
                      the unauthorized access and manipulation of data through
                      relevant imperative technical administration and
                      compliance with corporation law.
                    </p>
                    <p>
                      By clicking ACCEPT below, I consent to the acquisition,
                      processing, and utilization of my data from my permission
                      to access and implement the High5Hire "Vetting Platform"
                      and Services depicted above.{" "}
                    </p>
                  </p>

                  <div className="Sspace"></div>
                  <div className="d-flex justify-content-center mt-3">
                    <div>
                      <input
                        type="checkbox"
                        className=" form-check-input mr-2"
                        style={{ width: "20px", margin: "auto" }}
                        value={readInstructions}
                        onChange={(e) => {
                          setReadInstructions(e.target.checked);
                        }}
                      ></input>
                    </div>
                    <span>I have read the instruction.</span>
                  </div>
                  <div className="Sspace"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          className="mt-4"
          onClick={() => {
            setInstruction(false);
            setLoading(true);
            setTimeout(() => setLoading(false), 3000);
          }}
          disabled={!readInstructions}
        >
          ACCEPT
        </button>
      </div>
    </>
  );
};

export default ReviewInstructions;
