import React from "react";
import { getUserToken } from "../../services/AuthServices";
import moment from "moment";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Avatar from "react-avatar";
const UsersTableView = ({
  handleEdit,
  userData,
  prev,
  setPrev,
  setPrevData,
  handleStatusConfirmation,
}) => {
  const Token = getUserToken();
  return (
    <table className="table table-sortable table-hoverable-cells users">
      <thead>
        <tr>
          <th className="no-hover pt-0">
            <div className="d-flex align-items-center">
              <h6>Name</h6>
            </div>
          </th>
          {Token.role === "admin" && (
            <th className="no-hover pt-0">
              <div className="d-flex align-items-center">
                <h6>Company</h6>
              </div>
            </th>
          )}
          {Token.role === "admin" && (
            <th className="no-hover pt-0">
              <div className="d-flex align-items-center">
                <h6>Logo</h6>
              </div>
            </th>
          )}
          <th className="no-hover pt-0">
            <div className="d-flex align-items-center">
              <h6>Email</h6>
            </div>
          </th>
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

          <th className="no-hover pt-0">
            <div className="d-flex align-items-center"></div>
          </th>
        </tr>
      </thead>
      <tbody>
        {userData?.map((user) => (
          <tr>
            <td onClick={() => setPrevData(true, user)}>
              <Avatar
                className="avatar avatar-sm"
                name={user.firstName + " " + user.lastName}
                round="80px"
              />
              <span className="font-primary no-hover ml-2 mr-2">
                {user.firstName}
              </span>
              <span className="font-primary no-hover">{user?.lastName}</span>
            </td>

            {Token.role === "admin" && (
              <td onClick={() => setPrevData(true, user)}>
                <div>
                  <span className="font-primary no-hover font-regular">
                    {user.companyName}
                  </span>
                </div>
              </td>
            )}
            {Token.role === "admin" && (
              <td onClick={() => setPrevData(true, user)}>
                <div>
                  <span className="font-primary no-hover font-regular">
                    {user.companyLogo?.length > 10 ? (
                      <img src={user.companyLogo} alt="logo" width={60} />
                    ) : (
                      "NA"
                    )}
                  </span>
                </div>
              </td>
            )}
            <td onClick={() => setPrevData(true, user)}>
              <div>
                <span className="font-primary no-hover font-regular">
                  {user.email}
                </span>
              </div>
            </td>

            <td onClick={() => setPrevData(true, user)}>
              <div>
                <span className="font-primary no-hover font-regular">
                  {moment(user.createdAt).format("MM/DD/YYYY")}
                </span>
              </div>
            </td>
            <td onClick={() => setPrevData(true, user)}>
              <div>
                <span className="font-primary no-hover font-regular">
                  <span
                    className={
                      user?.uStatus === "Deactivated"
                        ? "tag tag-red2"
                        : "tag tag-green2"
                    }
                  >
                    {user?.uStatus}
                  </span>
                </span>
              </div>
            </td>

            <td className="text-right no-hover">
              <div className="dropdown ml-4">
                <OverlayTrigger
                  trigger="click"
                  rootClose
                  placement="left"
                  overlay={
                    <div className="dropdown-menu dropdown-menu-left">
                      <div className="">
                        <ul>
                          {user?.uStatus !== "Deactivated" && (
                            <button
                              className="dropdown-item"
                              onClick={(e) => {
                                handleEdit(user, e);
                              }}
                            >
                              <i
                                className="fas fa-edit mr-2"
                                aria-hidden="true"
                              ></i>{" "}
                              Edit
                            </button>
                          )}

                          <button
                            type="button"
                            className="dropdown-item"
                            onClick={(e) => handleStatusConfirmation(user, e)}
                          >
                            <i
                              className={`fa ${
                                user.uStatus === "Active"
                                  ? "fa-trash"
                                  : "fa-key"
                              }  mr-2`}
                              aria-hidden="true"
                            ></i>{" "}
                            {user.uStatus === "Active"
                              ? "Deactivate"
                              : "Activate"}
                          </button>
                        </ul>
                      </div>
                    </div>
                  }
                >
                  <button
                    type="button"
                    className="btn btn-icon dropdown-toggle"
                  >
                    <i className="far fa-ellipsis-v"></i>
                  </button>
                </OverlayTrigger>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UsersTableView;
