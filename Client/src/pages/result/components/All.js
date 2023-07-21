import React, { useEffect, useState } from "react";
import Completed from "./Completed";
import UnderReview from "./UnderReview";
import Invited from "./Invited";
import Expired from "./Expired";
import Pagination from "react-pagination-js";
import moment from "moment";

const All = (props) => {
  const changeCurrentPage = (n) => {
    setCurrentPage(n);
  };

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setData(getPaginatedData());
    // eslint-disable-next-line
  }, [currentPage, props?.resultData]);

  const getPaginatedData = () => {
    const startIndex = currentPage * props.dataSize - props.dataSize;
    const endIndex = startIndex + +props.dataSize;
    return props?.resultData?.slice(startIndex, endIndex);
  };

  return (
    <>
      {data?.map((item, index) => (
        <div key={index}>
          {item.testStatus === "completed" ? (
            <Completed
              scoring={props.scoring}
              parent="all"
              completed={item}
              resultData={[
                {
                  ...item,
                  candidateId: item.completed?.resultData[0]?.candidateId,
                  testAssign:
                    item?.resultData?.length > 0
                      ? item?.resultData[0]?.testAssign
                      : item?.testAssign,
                  questions:
                    item?.resultData?.length > 0
                      ? item?.resultData[0]?.questions
                      : [],
                },
              ]}
            />
          ) : item.testStatus === "underReview" ? (
            <UnderReview underReview={item} resultData={[item]} parent="all" />
          ) : item.testStatus === "Invited" &&
            moment(moment(new Date())).diff(item?.createdAt, "days") <= 7 ? (
            <Invited
              invited={[{ data: item }]}
              parent="all"
              resultData={[item]}
            />
          ) : (
            item.testStatus === "Invited" &&
            moment(moment(new Date())).diff(item?.createdAt, "days") > 7 && (
              <Expired expired={item} parent="all" resultData={[item]} />
            )
          )}
        </div>
      ))}

      {props?.resultData?.length > 0 && (
        <div className="d-flex p-2 mt-2 align-items-center justify-content-between border-top">
          <div className="ml-auto mx-auto-370 d-flex align-items-center">
            <Pagination
              currentPage={props?.currentPage}
              totalSize={props?.resultData?.length}
              sizePerPage={props.dataSize}
              firstPageText="⟨⟨"
              lastPageText="⟩⟩"
              showFirstLastPages={true}
              changeCurrentPage={changeCurrentPage}
              theme="border-bottom"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default All;
