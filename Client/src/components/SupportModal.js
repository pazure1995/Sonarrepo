import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/button";

function SupportModal({ supportData, closeSupportModal }) {
  const [URL, setURL] = useState();

  useEffect(() => {
    if (supportData?.ImageURL) {
      setURL(JSON.parse(supportData?.ImageURL)[0]?.ImageURL);
    }
  }, []);

  function createMarkup(html) {
    return { __html: html };
  }

  return (
    <Modal show={true} size="lg" animation={true}>
      <Modal.Header>
        <Modal.Title className="pb-0 pt-1 font-16">
          <h6>FAQ</h6>
        </Modal.Title>
        <button
          type="button"
          onClick={closeSupportModal}
          className="close p-0 bl-modal-close-btn closable"
          data-dismiss="modal"
          aria-label="Close"
        >
          <i className="fal fa-times closable"></i>
        </button>
      </Modal.Header>

      <hr />

      <Modal.Body>
        <div className="pl-5">
          <div
            dangerouslySetInnerHTML={createMarkup(supportData?.supportAns)}
          ></div>
        </div>
        <hr />
        <div className="d-flex m-3">
          For any other queries, please contact alerts@high5hire.com
          <Button
            className="ml-auto"
            variant="secondary"
            onClick={closeSupportModal}
          >
            Close
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default SupportModal;
