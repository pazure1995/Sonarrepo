import React, { useState } from "react";
import SideNavBar from "../layout/SideNavBar";
import TopNavBar from "../layout/TopNavBar";
import ProjectScreen from "./ProjectScreen";

const Project = () => {
  const [toggle, setToggle] = useState(false);

  const toggleDiv = (type) => {
    if (type === true) {
      setToggle(true);
    } else {
      setToggle(false);
    }
  };

  return (
    <>
      <body
        className={
          toggle === true ? "layout1 layout1-closed close-menu" : "layout1"
        }
      >
        <div className="body-decorator body-decorator-top"></div>
        <div className="body-decorator body-decorator-bottom"></div>
        <SideNavBar />
        <TopNavBar heading="Dashboard" handleToggle={toggleDiv} />

        <div id="Content">
          <div id="AssessmentsApp" className="section section-sm  pt-0-768">
            <div className="container">
              <div className="row justify-content-center">
                <ProjectScreen />
              </div>
            </div>
          </div>
        </div>
      </body>
    </>
  );
};

export default Project;
