import React, { useState, useRef, useEffect } from "react";
import useOutsideClick from "../../functions/useOutsideClick";
import moment from "moment";

const UserPreview = ({
  handleStatusChange,
  showEditUser,
  setShowEditUser,
  users,
  handleEdit,
  handleStatusConfirmation,
  setPrev,
  user,
}) => {
  const [openDropDownDiv, setOpenDropDownDiv] = useState(false);
  useEffect(() => {}, [user]);
  const ref = useRef();
  useOutsideClick(ref, () => setOpenDropDownDiv(false));
  const openDropDown = () => {
    openDropDownDiv ? setOpenDropDownDiv(false) : setOpenDropDownDiv(true);
  };

  const close = () => {
    setPrev(false, {});
  };
  const allUsers = users.filter(
    (x) => x.companyId === user.companyId && x._id !== user._id
  );

  return (
    <>
      <div className="view-panel show">
        <div className="view-panel-header">
          <div className="px-3 py-2">
            <button type="button" onClick={close} className="btn btn-icon">
              <i aria-hidden="true" className="fal fa-times"></i>
            </button>
          </div>
          <div className="px-3 mb-3">
            <div className="d-flex align-items-start flex-wrap-reverse">
              <div className="d-flex">
                <div className="ml-3">
                  <h5 className="mr-2 mb-2">
                    {user.firstName} {user?.lastName}{" "}
                  </h5>
                  <div className="mb-2">
                    <span
                      className={
                        user?.uStatus === "Deactivated"
                          ? "tag tag-red2"
                          : "tag tag-green2"
                      }
                    >
                      {user.uStatus}
                    </span>
                  </div>
                </div>
              </div>
              <div className="ml-auto d-flex align-items-center">
                {user?.uStatus === "Active" ? (
                  <div className="btn-group btn-group-sm btn-split" ref={ref}>
                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={(e) => handleEdit(user, e)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={openDropDown}
                      className="btn btn-sm dropdown-toggle dropdown-toggle-split"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <span className="sr-only">Toggle Dropdown</span>
                    </button>
                    {openDropDownDiv && (
                      <div
                        className="dropdown-menu dropdown-menu-right"
                        style={{ display: "revert", right: "0px", top: "30px" }}
                      >
                        <button
                          type="button"
                          className="dropdown-item"
                          onClick={(e) => handleStatusConfirmation(user, e)}
                        >
                          <i
                            className={`fa ${
                              user.uStatus === "Active" ? "fa-trash" : "fa-key"
                            } mr-2`}
                            aria-hidden="true"
                          ></i>{" "}
                          {user.uStatus === "Active"
                            ? "Deactivate"
                            : "Activate"}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    className="btn btn-sm"
                    onClick={(e) => handleStatusConfirmation(user, e)}
                  >
                    <i
                      className={`fa ${
                        user.uStatus === "Active" ? "fa-trash" : "fa-key"
                      } mr-2`}
                      aria-hidden="true"
                    ></i>{" "}
                    {user.uStatus === "Active" ? "Deactivate" : "Activate"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="view-panel-body">
          <div className="mb-2">
            <button
              type="button"
              className="btn btn-collapsible"
              data-bs-target="#div1"
              data-bs-toggle="collapse"
              aria-controls="#div1"
            >
              <i className="fal fa-angle-down fa-fw" aria-hidden="true"></i>
              <span>
                <small>General</small>
              </span>
            </button>
          </div>
          <div className="mb-4 ml-4 collapse multi-collapse show" id="div1">
            <div className="d-flex mb-2 pl-1">
              <div>
                <i className="fas  fa-fw fa-building" aria-hidden="true"></i>
              </div>
              <div className="ml-2">
                <p className="mb-0">
                  {user.firstName} {user?.lastName}{" "}
                </p>
                <p className="mb-0">
                  <small>Name</small>
                </p>
              </div>
            </div>

            <div className="d-flex mb-2 pl-1">
              <div>
                <i className="fas fa-fw fa-envelope" aria-hidden="true"></i>
              </div>
              <div className="ml-2">
                <p className="mb-0">{user.email} </p>
                <p className="mb-0">
                  <small>Email</small>
                </p>
              </div>
            </div>

            <div className="d-flex mb-2 pl-1">
              <div>
                <i className="fas  fa-fw fa-shapes" aria-hidden="true"></i>
              </div>
              <div className="ml-2">
                <p className="mb-0">
                  {user.role === "member" ? "Member" : "Company Admin"}{" "}
                </p>
                <p className="mb-0">
                  <small>Role</small>
                </p>
              </div>
            </div>
          </div>
          {user?.subRole === "companyAdmin" && (
            <div className="mb-2">
              <button
                type="button"
                className="btn btn-collapsible"
                data-bs-target="#div2"
                data-bs-toggle="collapse"
                aria-controls="#div2"
              >
                <i className="fal fa-angle-down fa-fw" aria-hidden="true"></i>
                <span>
                  <small>Members</small>
                </span>
              </button>
            </div>
          )}
          <div className="mb-4 ml-4 collapse multi-collapse" id="div2">
            {user?.subRole === "companyAdmin" && (
              <table className="table table-sortable table-hoverable-cells users">
                <thead>
                  <tr>
                    <th className="no-hover pt-0">
                      <div className="d-flex align-items-center">
                        <h6>Name</h6>
                      </div>
                    </th>
                    <th className="no-hover pt-0">
                      <div className="d-flex align-items-center">
                        <h6>Email</h6>
                      </div>
                    </th>{" "}
                    <th className="no-hover pt-0">
                      <div className="d-flex align-items-center">
                        <h6>Created on</h6>
                      </div>
                    </th>
                    <th className="no-hover pt-0">
                      <div className="d-flex align-items-center">
                        <h6>Status</h6>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((x) => (
                    <tr>
                      <td>
                        <span className="font-primary no-hover mr-2">
                          {x.firstName}
                        </span>
                        <span className="font-primary no-hover">
                          {x?.lastName}
                        </span>
                      </td>

                      <td>
                        <div>
                          <span className="font-primary no-hover font-regular">
                            {x?.email}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div>
                          <span className="font-primary no-hover font-regular">
                            {moment(x.createdAt).format("MM/DD/YYYY")}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div>
                          <span className="font-primary no-hover font-regular">
                            <span
                              className={
                                x?.uStatus === "Deactivated"
                                  ? "tag tag-red2"
                                  : "tag tag-green2"
                              }
                            >
                              {x?.uStatus === "Deactivated"
                                ? "Deactivated"
                                : "Active"}
                            </span>
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserPreview;
