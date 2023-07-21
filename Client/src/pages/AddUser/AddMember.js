// import React, { useState } from "react";
// import { FE_URL } from "../../../services/constants";
// import Modal from "react-bootstrap/Modal";
// import { useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import Validator from "email-validator";
// import axios from "../../../services/axios";
// import Loader from "../Loader";

// const AddMember = (props) => {
//   const userProfile = useSelector(
//     (state) => state.userProfileReducer.userProfile
//   );
//   const [formData, setFormData] = useState({
//     companyName: "",
//     firstName: "",
//     lastName: "",
//     email: "",
//   });
//   const { email, firstName, lastName } = formData;
//   const [loading, setLoading] = useState(false);
//   const userName = userProfile.firstName + " " + userProfile.lastName;

//   const onChange = (e) => {
//     if (e.target.name !== "email") {
//       const input =
//         e.target.value
//           .charAt(0)
//           .toUpperCase()
//           .replace(/[^a-zA-Z\s]/, "") +
//         e.target.value.slice(1).replace(/[^a-zA-Z\s]/, "");
//       setFormData({ ...formData, [e.target.name]: input });
//     } else {
//       setFormData({ ...formData, [e.target.name]: e.target.value });
//     }
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();

//     const generatePassword = () => {
//       let length = 8,
//         charset =
//           "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
//         retVal = "";
//       for (let i = 0, n = charset.length; i < length; ++i) {
//         retVal += charset.charAt(Math.floor(Math.random() * n));
//       }
//       return retVal;
//     };

//     const password = generatePassword();

//     const user = {
//       firstName: formData.firstName?.trim(),
//       lastName: formData.lastName?.trim(),
//       email: formData.email?.trim(),
//       companyName: userProfile.companyName?.trim(),
//       companyLogo: userProfile.companyLogo,
//       companyId: userProfile.companyId,
//       password: password,
//       subRole: "member",
//       role: "user",
//       createdBy: {
//         role: userProfile.role,
//         id: userProfile.id,
//         firstName: userProfile.firstName,
//         lastName: userProfile.lastName,
//         companyId: userProfile.companyId,
//       },
//       modifiedBy: {
//         role: userProfile.role,
//         id: userProfile.id,
//         firstName: userProfile.firstName,
//         lastName: userProfile.lastName,
//         companyId: userProfile.companyId,
//       },
//     };
//     if (
//       formData.email === "" &&
//       formData.firstName === "" &&
//       formData.lastName === ""
//     ) {
//       toast.error("Please fill the required fields");
//     } else if (Validator.validate(email) && formData.firstName === "") {
//       toast.error("Please enter the first name");
//     } else if (Validator.validate(email) && formData.lastName === "") {
//       toast.error("Please enter the last name");
//     } else if (formData.email === "" && formData.firstName !== "") {
//       toast.error("Please enter the email address");
//     } else if (!Validator.validate(email)) {
//       toast.error("Please Enter Valid Email");
//     } else if (!formData.email || !formData.firstName) {
//       toast.error("Fill all the required data to invite a member.");
//     } else {
//       setLoading(true);
//       await axios
//         .post(`/user/signup`, user)
//         .then((res) => {
//           axios.post(
//             `/email/send`,
//             {
//               to: formData.email,
//               subject:
//                 userProfile.subRole === "companyAdmin"
//                   ? "Add Member"
//                   : "Add User",
//               body: `
//               <p>Hello ${formData.firstName},</p>
//               <br/>
//               <br/>
//               <p>Welcome to High5 vetting! </p>
//               <br/>
//               <div>
//               <p>We would be pleased to inform you that you have been added to ${userProfile.companyName}. Kindly get the username and password below. Once you log in to vetting application, can access all the vetting features at a place.</p>
//               </div>
//               </br>
//               </br>
//               <div>
//                <div> Username: ${user.email} </div>
//                <div> Password: ${user.password} </div>
//               </div>
//               <p> Click below to login into the application and officially get started: </p>
//               <a href="${FE_URL}"style="background: #0c99d5; color: #fff; text-decoration: none; border: 10px solid #0c99d5; border-left-width: 20px; border-right-width: 20px; text-transform: uppercase; display: inline-flex;"> CLICK HERE</a>
//               <br/>
//               <br/>
//               <p style="margin-top:20px;line-height: 1.5;">For any queries, please get in touch with alerts@high5hire.com</p>
//               <br/>
//               <div>Regards</div>
//               <div>Team ${userProfile.companyName}</div>
//             `,
//             },
//             { headers: { token: userProfile.accessToken } }
//           );
//           axios
//             .post(
//               `/email/send`,
//               {
//                 to: userProfile.email,
//                 subject:
//                   userProfile.subRole === "companyAdmin"
//                     ? "Add Member"
//                     : "Add User",
//                 body: `

//               <p>Hello ${userProfile.firstName},</p>
//               <br>
//               <p>
//                 This is to notify that you have just added a new member
//                  <strong> ${
//                    formData.firstName + " " + formData.lastName
//                  } </strong> to ${userProfile.companyName}
//               </p>
//               <br/><br/>
//             <div>Thank you</div>
//             <div>Team ${userProfile.companyName}</div>
//             `,
//               },
//               { headers: { token: userProfile.accessToken } }
//             )
//             .then((res) => {
//               setFormData({
//                 companyName: "",
//                 name: "",
//                 email: "",
//               });
//               setLoading(false);
//               props.setShowAddUserModal(false);
//               toast.success(
//                 `Successfully invited ${formData.firstName} ${formData.lastName} `
//               );
//             })
//             .catch((err) => {
//               console.log(err);
//               setLoading(false);
//               toast.error(err.message);
//             });
//         })
//         .catch((err) => {
//           console.log(err);
//           setLoading(false);
//           // toast.error(err.message);
//           toast.error("User already exists");
//         });
//     }
//   };

//   const closeModal = (value) => {
//     props.setShowAddUserModal(value);
//     setFormData({
//       companyName: "",
//       firstName: "",
//       lastName: "",
//       email: "",
//     });
//   };

//   return (
//     <Modal
//       show={props.showAddUserModal}
//       size="lg"
//       className="modal fade"
//       data-backdrop="static"
//       tabIndex={-1}
//       role="dialog"
//       aria-hidden="true"
//     >
//       <div className="modal-header" id="EditQuestionModal">
//         <h6 className="modal-title" id="EditQuestionModalLabel">
//           Add a member
//         </h6>
//         <button
//           type="button"
//           className="close"
//           data-dismiss="modal"
//           aria-label="Close"
//           onClick={() => props.setShowAddUserModal(false)}
//         >
//           <span aria-hidden="true">&times;</span>
//         </button>
//       </div>

//       <Modal.Body>
//         {loading && <Loader />}
//         <div className="p-3">
//           <div className="d-flex align-items-center mb-2">
//             <div className="ml-auto mr-4 mb-2">*Denotes mandatory field</div>
//           </div>
//           <div className="container">
//             <form className="login-form" onSubmit={(e) => onSubmit(e)}>
//               <div className="row g-2 card p-2">
//                 <div className="d-flex gap-2">
//                   <div className="col-md-6 col-lg-6 form-floating">
//                     <input
//                       type="text"
//                       className="form-control"
//                       placeholder="First name"
//                       name="firstName"
//                       value={firstName}
//                       onChange={(e) => {
//                         e.target.value = e.target.value.replace(
//                           /^[ \t]+|[ \t]+$/gm,
//                           ""
//                         );
//                         onChange(e);
//                       }}
//                     />
//                     <label>First name *</label>
//                   </div>
//                   <div className="col-md-6 col-lg-6 form-floating pr-2">
//                     <input
//                       type="text"
//                       className="form-control"
//                       placeholder="Last name"
//                       name="lastName"
//                       value={lastName}
//                       onChange={(e) => {
//                         e.target.value = e.target.value.replace(
//                           /^[ \t]+|[ \t]+$/gm,
//                           ""
//                         );
//                         onChange(e);
//                       }}
//                     />
//                     <label>Last name *</label>
//                   </div>
//                 </div>
//                 <div className=" form-floating mb-2">
//                   <input
//                     type="text"
//                     className="form-control"
//                     name="email"
//                     aria-describedby="emailHelp"
//                     placeholder="Email"
//                     value={email}
//                     onChange={(e) => {
//                       e.target.value = e.target.value.replace(
//                         /^[ \t]+|[ \t]+$/gm,
//                         ""
//                       );
//                       onChange(e);
//                     }}
//                     autoComplete="new-email"
//                   />
//                   <label>Email address *</label>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
//         <div className="modal-footer mt-4 mb-0">
//           <button
//             type="button"
//             className="btn btn-secondary mr-2"
//             data-dismiss="modal"
//             onClick={(e) => {
//               props.setShowAddUserModal(false);
//               e.preventDefault();
//             }}
//           >
//             Cancel
//           </button>
//           <button
//             type="button"
//             className="btn btn-primary"
//             onClick={(e) => onSubmit(e)}
//           >
//             <i className="fal fa-user-plus mr-2" aria-hidden="true"></i>
//             Invite
//           </button>
//         </div>
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default AddMember;
