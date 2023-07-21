import React from "react";

export const SidebarData = [
  {
    title: "Dashboard",
    roles: ["admin", "companyAdmin", "member"],
    path: "/dashboard",
    icon: <i className="fad fa-fw fa-home-lg-alt  mr-3" aria-hidden="true"></i>,
  },

  {
    title: "Assessments",
    roles: ["admin", "companyAdmin", "member"],
    path: "/assessments",
    icon: <i className="fad fa-graduation-cap mr-3"></i>,
  },

  {
    title: "Projects",
    roles: ["companyAdmin", "member"],
    path: "/projects",
    icon: <i className="fad fa-fw fa-home-lg-alt  mr-3" aria-hidden="true"></i>,
  },
  {
    title: "Results",
    roles: ["companyAdmin", "member"],
    path: "/results",
    icon: <i className="fad fa-fw fa-poll-h mr-3" aria-hidden="true"></i>,
  },

  {
    title: "Question Library",
    roles: ["admin", "companyAdmin", "member"],
    path: "/questionLibrary",
    icon: <i className="fad fa-fw fa-address-book mr-3" aria-hidden="true"></i>,
  },

  {
    title: "Users",
    roles: ["admin"],
    path: "/users",
    icon: <i className="fad fa-fw fa-users mr-3" aria-hidden="true"></i>,
  },
  {
    title: "Members",
    roles: ["companyAdmin"],
    path: "/users",
    icon: <i className="fad fa-fw fa-users mr-3" aria-hidden="true"></i>,
  },
];
