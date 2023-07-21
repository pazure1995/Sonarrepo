// import React, { useState } from "react";
// import Modal from "react-bootstrap/Modal";

// const CandidateResultScreen = () => {
//   const [showResult, setShowResult] = useState(true);
//   const [showOptions, setShowOptions] = useState(false);
//   return (
//     <div>
//       <Modal
//         show={showResult}
//         size="lg"
//         className="modal fade"
//         data-backdrop="static"
//         tabIndex={-1}
//         role="dialog"
//         aria-hidden="true"
//       >
//         <div className="modal-header" id="EditQuestionModal">
//           <h6 className="modal-title" id="EditQuestionModalLabel">
//             {/* Result */}
//           </h6>
//           <button
//             type="button"
//             className="close"
//             data-dismiss="modal"
//             aria-label="Close"
//             onClick={() => setShowResult(false)}
//           >
//             <span aria-hidden="true">&times;</span>
//           </button>
//         </div>
//         <Modal.Body>
//           <div className="col-lg-12">
//             <div className="card card-flat card-borderless p-0 p-0-600 mb-3">
//               <div className="border-bottom-gray2 ">
//                 {/* <div className="d-flex align-items-center justify-content-between ">
//                 <Link to="/assessment">
//                   <button className="btn btn-sm ms-2">Back</button>
//                 </Link>
//                 <Link to={`/candidate`} state={{ test: data }}>
//                   <button className="btn btn-sm me-2">Test Preview</button>
//                 </Link>
//               </div> */}
//                 <div className="d-flex align-items-center justify-content-between ">
//                   <h4 className="modal-title mx-2" id="exampleModalLabel">
//                     yogesh kumar
//                   </h4>
//                   <ul className="nav nav-tabs pt-1">
//                     <li className="nav-item">
//                       <button
//                         type="button"
//                         //   onClick={() => setShowModal(true)}
//                         className="nav-link pb-3 "
//                       >
//                         {" "}
//                         Share
//                       </button>
//                     </li>
//                     {/* <li className="nav-item">
//                     <button
//                       type="button"
//                       onClick={() => setShowInviteModal(true)}
//                       className="nav-link pb-3 "
//                     >
//                       {" "}
//                       Share Link
//                     </button>
//                   </li> */}
//                   </ul>
//                 </div>
//                 <div className="font-regular font-primary font-gray1 text-truncate mx-2">
//                   <div className="my-2">Test : React</div>
//                   <div className="my-2">Solved : 05/10</div>
//                   <div className="my-2">Finished on : 06/06/22</div>
//                   {/* <div className="mt-1 d-flex">
//                   <div className="mb-1">
//                     <div className=" mr-2">
//                       Role: <strong>{data?.role}</strong>
//                     </div>
//                   </div>
//                 </div> */}
//                 </div>
//                 <div className="d-flex justify-content-between mx-2 pb-2">
//                   <div className="d-flex flex-row ">
//                     <label className="m-0">
//                       Duration: <strong>120 mins</strong>
//                     </label>
//                     <label className="m-0 ml-3">
//                       Questions: <strong>30</strong>
//                     </label>
//                   </div>
//                 </div>
//                 <table className="table table-sortable  table-hoverable">
//                   <thead>
//                     <tr>
//                       <th className="no-hover pt-0">
//                         <div className="d-flex align-items-center">
//                           <h5>S.no</h5>
//                         </div>
//                       </th>
//                       <th className="no-hover pt-0">
//                         <div className="d-flex align-items-center">
//                           <h5>Question</h5>
//                         </div>
//                       </th>
//                       <th className="no-hover pt-0">
//                         <div className="d-flex align-items-center">
//                           <h5>Score</h5>
//                         </div>
//                       </th>
//                       <th className="no-hover pt-0">
//                         <div className="d-flex align-items-center">
//                           <h5>Status</h5>
//                         </div>
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     <tr onClick={() => setShowOptions(!showOptions)}>
//                       <td>
//                         {/* <i className="fal fa-caret-down" onClick={() => setShowOptions(!showOptions)}></i> */}
//                         1
//                       </td>
//                       <td>What is react ?</td>
//                       <td>7/10</td>
//                       <td>Passed</td>
//                     </tr>
//                     {showOptions && (
//                       <ul>
//                         <li>option1</li>
//                         <li>option2</li>
//                         <li>option3</li>
//                         <li>option4</li>
//                       </ul>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// };

// export default CandidateResultScreen;
