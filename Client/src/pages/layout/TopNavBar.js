import React, { useState, useRef, useEffect } from "react";
import Avatar from "react-avatar";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import useOutsideClick from "../../functions/useOutsideClick";
import OutsideClickHandler from "react-outside-click-handler";
import { getUserRole, getUserToken } from "../../services/AuthServices";
import SupportModal from "../../components/SupportModal";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getAllSupports } from "../../redux/actions/supports/supports";
import Loader from "../../components/loader/Loader";

function TopNavBar(props) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userToken"));
  const [toggle, setToggle] = useState(false);
  const [toggleProfile, setToggleProfile] = useState(false);
  const [toggleHelp, setToggleHelp] = useState(false);
  const [supportModal, setSupportModal] = useState(false);
  const [enableSupportSearch, setEnableSupportSearch] = useState(false);
  const [supportSearchValue, setSupportSearchValue] = useState("");
  const [selectedSupportQue, setSelectedSupportQue] = useState({});
  const ref1 = useRef();

  const dispatch = useDispatch();

  const { supportData, supportDataLoading } = useSelector(
    (state) => ({
      supportData: state.getSupportsDataReducer?.supportData,
      supportDataLoading: state.getSupportsDataReducer?.supportDataLoading,
    }),
    shallowEqual
  );

  useEffect(() => {
    dispatch(getAllSupports());
    // eslint-disable-next-line
  }, []);

  useOutsideClick(ref1, () => {
    setToggleProfile(false);
  });

  const toglleDiv = () => {
    if (toggle === false) {
      props.handleToggle(true);
      setToggle(true);
    } else {
      props.handleToggle(false);
      setToggle(false);
    }
  };

  const onClickLogout = (e) => {
    e.preventDefault();
    localStorage.clear();
    if ("caches" in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
        });
      });
      window.location.reload(true);
    }
    navigate("/");
  };

  const toggleProfileDropdown = () => {
    setToggleProfile(!toggleProfile);
  };

  const openSupportModal = (e) => {
    setSelectedSupportQue(e);
    setSupportModal(true);
  };

  const splitMatchedText = (str) => {
    const regExp = new RegExp(supportSearchValue, "gi");
    return str.replace(
      regExp,
      (match) => `<span style='background: blue; color: white'>${match}</span>`
    );
  };

  const closeSupportModal = () => {
    setSupportModal(false);
  };

  const [supportSearchData, setSupportSearchData] = useState([]);

  useEffect(() => {
    setSupportSearchData(supportData);
  }, [supportData]);

  const handleSupportSearch = (e) => {
    if (e.target.value.length <= 0) setSupportSearchData(supportData);
    setSupportSearchValue(e.target.value);
    setEnableSupportSearch(true);
    let res = supportData.filter((i) =>
      i.supportQue.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setSupportSearchData(res);
  };

  const role = getUserRole();

  return (
    <>
      <div id="TopBar">
        {supportDataLoading && <Loader />}
        {/* **** toggle div for main menu  ***** */}
        <div className="nav-toggle-wrap">
          <button
            id="MainMenuToggle"
            onClick={toglleDiv}
            type="button"
            className="btn btn-icon nav-toggle btn-nav"
          >
            <i className="fal fa-angle-left"></i>
          </button>
          <div className="divider"></div>
        </div>
        <div className=" d-flex justify-content-end  extras ml-auto text-right">
          <div className="mr-3" style={{ marginTop: 2 }}>
            <button
              type="button"
              title="Support"
              className="btn btn-action-panel btn-icon btn-nav ml-3"
              onClick={() => setToggleHelp(!toggleHelp)}
            >
              <i className="fal fa-fw fa-life-ring"></i>
            </button>
          </div>
          {toggleHelp && (
            <div
              className="action-panel"
              style={{
                display: "revert",
                right: "0px",
                top: "50px",
                textAlign: "left",
              }}
            >
              <OutsideClickHandler
                onOutsideClick={() => !supportModal && setToggleHelp(false)}
              >
                <div></div>
                <div
                  className="action-panel"
                  style={{
                    display: "revert",
                    right: "0px",
                    top: "50px",
                    textAlign: "left",
                  }}
                >
                  <div className="py-3 px-4">
                    <p className="lead mb-0">
                      Hello {getUserToken().firstName}
                    </p>
                    <strong>What can we help you with today?</strong>
                    <div className="search-field mb-3 mt-2">
                      <div className="field-wrap">
                        <input
                          type="text"
                          onChange={handleSupportSearch}
                          placeholder="Search Support"
                        />
                        <span className="icon">
                          <i aria-hidden="true" className="fas fa-search"></i>
                        </span>
                      </div>
                    </div>
                    <strong>
                      <small>Common Questions</small>
                    </strong>

                    <ul className="mt-1 ml-0 list-unstyled">
                      {supportSearchData?.length !== 0
                        ? supportSearchData?.map((s, i) => (
                            <li className="mb-1">
                              <a
                                key={i}
                                onClick={() => openSupportModal(s)}
                                href
                                style={{
                                  color: "#ff5f57",
                                  fontWeight: 700,
                                  cursor: "pointer",
                                }}
                                dangerouslySetInnerHTML={{
                                  __html: splitMatchedText(s?.supportQue),
                                }}
                              ></a>
                            </li>
                          ))
                        : "No Questions available "}
                    </ul>
                  </div>
                </div>
              </OutsideClickHandler>
            </div>
          )}

          {supportModal && (
            <SupportModal
              supportData={selectedSupportQue}
              closeSupportModal={closeSupportModal}
            />
          )}

          <div className="dropdown ms-1 mr-3">
            <button
              className="btn btn-icon dropdown-toggle"
              ref={ref1}
              onClick={toggleProfileDropdown}
              type="button"
            >
              <Avatar
                className="avatar avatar-sm"
                name={user.firstName + " " + user.lastName}
                round="80px"
              />
            </button>
            <div>
              {toggleProfile && (
                <div
                  className="dropdown-menu"
                  style={{ display: "revert", right: "-14px", top: "30px" }}
                >
                  <span>
                    <a href="/profile" className="dropdown-item">
                      <i className="fal fa-user-circle mr-3"></i>Profile
                    </a>
                  </span>
                  <hr />
                  {role === "admin" && (
                    <>
                      <span className="">
                        <Link
                          to={"/notificationCentre"}
                          className="dropdown-item"
                        >
                          <i class="fal fa-mail-bulk mr-2"></i> Notification
                          Center
                        </Link>
                      </span>
                      <hr />
                    </>
                  )}
                  <a
                    href="#top"
                    className="dropdown-item"
                    onClick={onClickLogout}
                  >
                    <i className="fal fa-sign-out mr-3"></i> Logout
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TopNavBar;
