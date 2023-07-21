import React, { useState, useEffect } from "react";
// import _ from "lodash";
import { toast } from "react-toastify";

function Sort({
  resetSort,
  sortData,
  sortObjects,
  applySort,
  sortingFor,
  orderArray,
  setSortCount,
  setSortArray,
  sortArray,
  sortType,
  setSorttype,
  setApplyCount,
}) {
  const [id, setId] = useState(0);

  useEffect(() => {
    if (sortArray.length === 0) {
      const tempArray = sortObjects.map((item) => item.value);
      setSorttype(tempArray);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setSortCount(sortObjects.length - sortType.length);
    // eslint-disable-next-line
  }, [JSON.stringify(sortType)]);

  const addSortHandle = () => {
    const tempId = id + 1;
    const sortObj = {
      id: tempId,
      sortValue: "",
      order: "asc",
    };
    setSortArray([...sortArray, sortObj]);
    setId(tempId);
  };

  const handleSortValue = (e, i) => {
    let newArray = [...sortArray];
    newArray[i] = {
      ...newArray[i],
      [e.target.id]: e.target.value,
    };
    setSortArray(newArray);
    if (!!e.target.value.length && e.target.id !== "order") {
      if (!!sortArray[i].sortValue.length) {
        let tempArray = sortType.filter((item) => item !== e.target.value);
        setSorttype([...tempArray, sortArray[i].sortValue]);
      } else {
        let tempArray = sortType.filter((item) => item !== e.target.value);
        setSorttype(tempArray);
      }
    } else if (e.target.id !== "order") {
      let tempArray = [...sortType, sortArray[i].sortValue];
      setSorttype(tempArray);
    }
  };

  const deleteSort = (data) => {
    let tempArray = sortArray.filter((item) => item.id !== data.id);
    setSortArray(tempArray);
    !!data.sortValue.length && setSorttype([...sortType, data.sortValue]);
  };

  const sortClearAll = () => {
    setSortArray([]);
    const tempArray = sortObjects.map((item) => item.value);
    setSorttype(tempArray);
    setSortCount(0);
    applySort(sortData, true);
    setApplyCount(0);
    resetSort();
  };

  const apply = () => {
    let val = sortArray.filter((item) => !item.sortValue);
    if (val.length !== 0) {
      toast.error("Please select the field");
    } else {
      setApplyCount(1);
      applySort({
        sortOrder: sortArray[0].order,
        sortBy: sortArray[0].sortValue,
      });
    }
  };

  return (
    <div className="dropdown-sort-menu dd-sort">
      <div className="dd-sort-header d-flex justify-content-between align-items-center dd-sort">
        <div>
          <h6>Sort</h6>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-text dd-sort"
            onClick={sortClearAll}
          >
            <strong className="dd-sort">Clear all</strong>
          </button>
        </div>
      </div>
      <div className="dd-sort-body">
        {sortArray.length > 0 ? (
          sortArray.map((item, i) => (
            <div
              key={i}
              className="d-flex align-items-center justify-content-end mt-3"
            >
              <div className="dropdown dropdown-select mr-2 dd-sort w-100">
                <div className="row mb-2">
                  <div className="col-lg-6">
                    <div className="form-floating-sm">
                      <select
                        className="form-select"
                        id="sortValue"
                        value={item.sortValue}
                        onChange={(e) => handleSortValue(e, i)}
                      >
                        <option value="" selected>
                          Select
                        </option>
                        {sortObjects.map((val, indx) => (
                          <option
                            key={indx}
                            value={val.value}
                            hidden={!sortType.includes(val.value)}
                          >
                            {val.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-5">
                    <div className="form-floating-sm">
                      <select
                        className="form-select"
                        id="order"
                        value={item.order}
                        onChange={(e) => handleSortValue(e, i)}
                      >
                        {orderArray.map((val, indx) => (
                          <option key={indx} value={val.value}>
                            {val.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-1" style={{ padding: "8px 0px" }}>
                    <button
                      type="button"
                      className="btn btn-text dd-sort"
                      onClick={() => deleteSort(item)}
                    >
                      <strong className="dd-sort font-muted">
                        <i className="fas fa-times-circle dd-sort"></i>
                      </strong>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="mb-0 py-3 dd-sort">{sortingFor}</p>
        )}
      </div>
      <div className="d-flex">
        {sortArray.length === 0 && (
          <button
            type="button"
            className="btn btn-text mt-4 dd-sort dd-hide-1024"
            onClick={addSortHandle}
            disabled={sortArray.length === sortObjects.length}
          >
            <i className="fal fa-plus mr-2 dd-sort" aria-hidden="true"></i>
            <strong className="dd-sort">Add Sort</strong>
          </button>
        )}

        {sortArray.length > 0 && (
          <div className="p-relative ml-auto mt-4">
            <div className="d-flex">
              <button
                onClick={apply}
                type="button"
                className="btn btn-sm btn-primary"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sort;
