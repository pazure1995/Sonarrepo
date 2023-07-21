import React, { useState } from "react";
import SideNavBar from "../layout/SideNavBar";
import TopNavBar from "../layout/TopNavBar";
import { Outlet } from "react-router";
import "react-pagination-js/dist/styles.css";

function AssessmentsIndex(props) {
  const [toggle, setToggle] = useState(false);

  const toggleDiv = (type) => {
    if (type === true) {
      setToggle(true);
    } else {
      setToggle(false);
    }
  };

  return (
    <body
      className={
        toggle === true ? "layout1 layout1-closed close-menu" : "layout1"
      }
    >
      <div className="body-decorator body-decorator-top"></div>
      <div className="body-decorator body-decorator-bottom"></div>
      <SideNavBar />
      <TopNavBar handleToggle={toggleDiv} />

      <div id="Content">
        <div className="section section-sm pt-0-768">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-12">
                <div className="card card-flat card-borderless  p-4 p-2-600 mb-3 ">
                  <Outlet />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
  );
}
export default AssessmentsIndex;
