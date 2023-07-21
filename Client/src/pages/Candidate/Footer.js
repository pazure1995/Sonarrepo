import React from "react";
import logo from "../../assets/images/High5Logo.png";

const Footer = () => {
  return (
    <div
      className="d-flex"
      style={{
        position: "absolute",
        bottom: 0,
        right: 0,
      }}
    >
      <div className="" style={{ width: 146 }}>
        <span style={{ float: "right" }}>
          <span style={{ fontWeight: 600 }} className="text-muted ">
            Powered by
          </span>
          <img
            className=" mb-3 p-1"
            style={{ height: 33 }}
            src={logo}
            alt="high5logo"
          />
        </span>
      </div>
    </div>
  );
};

export default Footer;
