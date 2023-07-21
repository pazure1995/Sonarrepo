import React from "react";
import moment from "moment";

const NotificationTable = ({
  emailData,
  setOpenFullViewEmail,
  setSelectedMail,
}) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th className="p-relative">Email</th>
          <th scope="col">Subject</th>
          <th scope="col">Status</th>
          <th scope="col" style={{ width: 100 }}>
            Date
          </th>
          <th scope="col " style={{ width: 50 }}>
            Action
          </th>
        </tr>
      </thead>
      <tbody>
        {emailData?.map((mail, index) => (
          <tr key={index}>
            <td>
              <span className="font-primary font-regular">{mail.mailTo}</span>
            </td>

            <td>
              <span className="font-primary font-regular">
                {mail.mailSubject}
              </span>
            </td>

            <td>
              <span
                className={
                  mail.mStatus === 16 ? "tag tag-green1" : "tag tag-orange1"
                }
              >
                {mail.mStatus === 16 ? "Delivered" : "Pending"}
              </span>
            </td>

            <td>
              <span className="font-primary font-regular">
                {moment(mail.createdAt).format("MM/DD/YYYY")}
              </span>
            </td>

            <td className="text-right mr-4">
              <span className="font-primary font-regular">
                <button
                  style={{ color: "#000" }}
                  onClick={() => {
                    setOpenFullViewEmail(true);
                    setSelectedMail(mail);
                  }}
                  className="btn btn-text"
                >
                  <i className="fad fa-eye"></i>
                </button>
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default NotificationTable;
