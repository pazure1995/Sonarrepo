import { post } from "../../services/ApiServices";
import React, { useState } from "react";
import SideNavBar from "../../pages/layout/SideNavBar";
import TopNavBar from "../../pages/layout/TopNavBar";

function ChatGPT() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [toggle, setToggle] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Send a request to the server with the prompt
    post("/api/chatGPT/chat", { prompt })
      .then((res) => {
        // Update the response state with the server's response
        setResponse(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const toggleDiv = (type) => {
    if (type === true) {
      setToggle(true);
    } else {
      setToggle(false);
    }
  };

  const handleClear = () => {
    setResponse("");
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
      <TopNavBar isFrom="dashboard" handleToggle={toggleDiv} />
      <div id="Content">
        <div className="section section-sm pt-0-768">
          <div className="container">
            <div className="row justify-content-center">
              <div
                style={{
                  "margin-top": "30px",
                  width: "50%",
                  marginLeft: "10px",
                }}
              >
                <div
                  style={{
                    marginBottom: "20px",
                  }}
                >
                  <textarea
                    style={{
                      "margin-bottom": "30px",
                      border: "2px solid rgba(0, 0, 0, 0.09)",
                    }}
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    multiline={true}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    onClick={handleSubmit}
                  >
                    {loading ? "Generating results ..." : "Submit"}
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    onClick={handleClear}
                    style={{
                      "margin-left": "30px",
                    }}
                  >
                    Clear
                  </button>
                </div>

                {response &&
                  response?.map((item, index) => {
                    return (
                      <div
                        key={index}
                        style={{
                          border: "2px solid rgba(0, 0, 0, 0.09)",
                          borderColor: "#fff",
                        }}
                      >
                        <p>
                          <b>Question:</b> {item.question}
                        </p>
                        <p>
                          {/* <b>Options:</b> {item.options} */}
                          <b>Options:</b>
                          {item.options.length > 0 &&
                            item.options.map((options) => {
                              return <li>{options}</li>;
                            })}
                        </p>
                        <p>
                          <b>Answer:</b>
                          {item.answer}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
  );
}

export default ChatGPT;
