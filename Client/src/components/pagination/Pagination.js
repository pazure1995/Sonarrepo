import React, { useEffect, useState } from "react";

const Pagination = ({
  totalItemsCount,
  currentItemsCount,
  setCurrentPage,
  currentPage,
  countPerPage,
}) => {
  const [pageBoxArr, setPageBoxArr] = useState([]);
  const changePage = (event) => {
    const pageNumber = Number(event.target.textContent);
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    let c = [];
    for (let i = 1; i <= Math.ceil(totalItemsCount / countPerPage); i++)
      c.push(i);
    setPageBoxArr(c);
  }, [currentPage, countPerPage, totalItemsCount]);

  return (
    <div className="d-flex p-2 mt-2 align-items-center justify-content-between border-top">
      <div className="w-100-370 mb-point5-370">
        Showing {currentItemsCount} of {totalItemsCount}
      </div>
      <div className="ml-auto mx-auto-370 d-flex align-items-center">
        <button
          onClick={() => {
            setCurrentPage((page) => page - 1);
          }}
          type="button"
          disabled={currentPage === 1 ? true : false}
          className="btn btn-icon px-2"
        >
          <i className="fal fa-chevron-circle-left"></i>
        </button>
        {pageBoxArr.map((item, index) => (
          <button
            key={index}
            type="button"
            className={
              currentPage === item
                ? "btn btn-text px-2 bg-secondary text-white"
                : "btn btn-text px-2"
            }
            onClick={changePage}
          >
            {item}
          </button>
        ))}
        <button
          onClick={() => {
            setCurrentPage((page) => page + 1);
          }}
          type="button"
          disabled={
            currentPage === Math.ceil(totalItemsCount / countPerPage)
              ? true
              : false
          }
          className="btn btn-icon px-2"
        >
          <i className="fal fa-chevron-circle-right"></i>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
