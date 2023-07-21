import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import QuestionTable from "../questionTable/QuestionTable";
import CreateQuestion from "./CreateQuestion";
import Loader from "../loader/Loader";
import { getUserCompanyId, getUserRole } from "../../services/AuthServices";
import { getQuestionData } from "../../redux/actions/questions/questions";
import { getSkillsData } from "../../redux/actions/skills/skills";
import QuestionFilter from "./QuestionFilter";

function AddQuestionInAssessment(props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [addPath, setAddPath] = useState("");
  const [sortArray, setSortArray] = useState([]);
  const [countPerPage, setCountPerPage] = useState(10);
  const [fetchQueData, setFetchQueData] = useState(false);
  const dispatch = useDispatch();
  const companyId = getUserCompanyId();
  const role = getUserRole();

  const [filterInfo, setFilterInfo] = useState({
    selectedTypes: [],
    selectedSkills: [],
    selectedDifficulties: [],
  });

  const { questionData, questionDataLoading, queCount } = useSelector(
    (state) => ({
      questionData: state.getQuestionDataReducer?.questionData?.data,
      questionDataLoading: state.getQuestionDataReducer?.questionDataLoading,
      queCount: state.getQuestionDataReducer?.questionData?.total,
    }),
    shallowEqual
  );

  //get skills
  const { skillsData, skillsDataLoading } = useSelector(
    (state) => ({
      skillsData: state.getSkillsDataReducer.skillsData,
      skillsDataLoading: state.getSkillsDataReducer?.skillsDataLoading,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (!skillsData) {
      dispatch(getSkillsData());
    }
    // eslint-disable-next-line
  }, [skillsData]);

  useEffect(() => {
    let testCategory = props.testCategory;
    let params = {
      deleted: false,
      parent: "createAssessment",
      companyId: companyId,
      currentPage: currentPage,
      limit: countPerPage,
      role: role,
      testCategory: testCategory === "General" ? "" : testCategory,
      filterParams: {
        type: testCategory === "General" ? [] : [testCategory],
        skill: [],
        difficulty: [],
      },
    };

    params.sortParams = {
      sortOrder: sortArray[0]?.order,
      sortBy: sortArray[0]?.sortValue,
    };

    params.filterParams = {
      type: filterInfo.selectedTypes,
      skill: filterInfo.selectedSkills,
      difficulty: filterInfo.selectedDifficulties,
    };

    dispatch(getQuestionData(params));
    // eslint-disable-next-line
  }, [countPerPage, currentPage, fetchQueData, filterInfo]);

  const addPathHandle = (value) => {
    props.setAddPathQModal(value);
    setAddPath(value);
  };

  return (
    <>
      {skillsDataLoading && <Loader />}

      <div className="row">
        <div
          className="col-12 d-flex flex-column flex-lg-row"
          style={{ padding: "25px 30px 30px 40px" }}
        >
          <button
            type="button"
            onClick={() => {
              addPathHandle("fromLibrary");
            }}
            className={
              addPath === "fromLibrary"
                ? "card card-flat p-0 mr-2 mb-2 mb-lg-0  selected"
                : "card card-flat p-0 mr-2 mb-2 mb-lg-0"
            }
          >
            <div className="card-body text-left">
              <div className="d-flex">
                {addPath === "fromLibrary" ? (
                  <div className="mr-3 font-green font-16">
                    <i className="fad fa-check-circle"></i>
                  </div>
                ) : (
                  <div className="mr-3 font-muted font-16">
                    <i className="fad fa-circle"></i>
                  </div>
                )}
                <div>
                  <div>
                    <strong className="font-blue_primary">
                      Question Library
                    </strong>
                  </div>
                  <p className="mb-0">
                    Select questions from question library.
                  </p>
                </div>
              </div>
            </div>
          </button>
          <button
            onClick={() => {
              addPathHandle("fromScratch");
            }}
            type="button"
            className={
              addPath === "fromScratch"
                ? "card card-flat p-0 mr-2 mb-2 mb-lg-0  selected"
                : "card card-flat p-0 mr-2 mb-2 mb-lg-0"
            }
          >
            <div className="card-body text-left">
              <div className="d-flex">
                {addPath === "fromScratch" ? (
                  <div className="mr-3 font-green font-16">
                    <i className="fad fa-check-circle"></i>
                  </div>
                ) : (
                  <div className="mr-3 font-muted font-16">
                    <i className="fad fa-circle"></i>
                  </div>
                )}
                <div>
                  <div>
                    <strong className="font-blue_primary">New Question</strong>
                  </div>
                  <p className="mb-0">Create a question from scratch.</p>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>

      <div className="px-5 py-3">
        {addPath === "fromLibrary" && (
          <>
            {/* WIP */}
            <div
              className="d-flex justify-content-end col-12"
              style={{
                position: "absolute",
                right: 25,
                // width: 800,
                zIndex: 999,
              }}
            >
              <QuestionFilter
                skills={skillsData}
                setFilterInfo={setFilterInfo}
                setCurrentPage={setCurrentPage}
              />
            </div>

            {questionDataLoading && <Loader />}
            <div className="mt-5">
              <QuestionTable
                data={questionData}
                editQuestionInQuesLib={true}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                queCount={queCount}
                countPerPage={countPerPage}
                setFetchQueData={setFetchQueData}
                close={props.close}
                parent={props.parent}
                checkbox={true}
                dataSize={10}
                testCategory={props.testCategory}
              />
            </div>
          </>
        )}
        {addPath === "fromScratch" && (
          <CreateQuestion
            parent={"createAssessment"}
            close={props.close}
            id={props.id}
            difficulty={props.difficulty}
            testCategory={props.testCategory}
            tags={props.tags}
            setShowAddQuestionModal={props.setShowAddQuestionModal}
            setQuestionList={props.setQuestionList}
          />
        )}
      </div>
    </>
  );
}
export default AddQuestionInAssessment;
