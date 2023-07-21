import React from "react";
import { SidebarLogo } from "../../constants/constants";
import { Link } from "react-router-dom";
import { SidebarData } from "./SidebarData";
import { getUserRole } from "../../services/AuthServices";

// import jwt from "jwt-decode";
// import { useSelector } from "react-redux";

function SideNavBar(props) {
  let path = window.location.href.split("/").slice(-1)[0];
  const user = JSON.parse(localStorage.getItem("userToken"));

  // const role = jwt(localStorage.getItem("token")).role;
  let roletoShow = getUserRole();
  // let roletoShow =
  //   role === "admin"
  //     ? "Super Admin"
  //     : role === "user" && user.subRole === "companyAdmin"
  //     ? "Company Admin"
  //     : "Member";
  return (
    <>
      <div style={{ zIndex: 999 }} id="Nav">
        <div className="top">
          <div className="d-flex align-items-center">
            <div
              className="brand-logo"
              style={{ backgroundImage: `url(${SidebarLogo})` }}
            ></div>
            <div className="title px-2">
              <h6 className="mb-0">
                {user.firstName} {user.lastName}
              </h6>
              <small className="mb-0">
                Role:{" "}
                {roletoShow === "admin"
                  ? "Super Admin"
                  : roletoShow === "companyAdmin"
                  ? "Company Admin"
                  : "Member"}
              </small>
              <br />
              <small className="mb-0">Company: {user.companyName}</small>
            </div>
          </div>
        </div>

        <div className="body">
          <ul className="menu">
            {SidebarData.map((item, index) => {
              let checkRole = item.roles.find((x) => x === roletoShow)
                ? true
                : false;

              if (checkRole) {
                return (
                  <li key={index}>
                    <Link
                      to={item.path}
                      className={path === "high5Hire" && "active"}
                    >
                      {item.icon}
                      <span className="nav-text">{item.title}</span>
                    </Link>
                  </li>
                );
              }
            })}
          </ul>
        </div>
      </div>
    </>
  );
}

export default SideNavBar;
