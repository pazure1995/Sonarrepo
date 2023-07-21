export const testCreationSuccess = (data) => {
  return `<div className="d-flex w-100">
                <div className="d-block w-50">
                  <div>
                    <label className="d-block font-bold pt-0">Assessment name</label>
                    <p>${data.testName}</p>
                  </div>
                    <label className="d-block font-bold pt-0">Questions</label>
                    <p>${data.questions.length}</p>
                  </div>
                </div>
              </div>`;
};
