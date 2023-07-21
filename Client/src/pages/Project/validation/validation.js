export const projectValidation = (projectInfo) => {
  const validationObj = [];

  let projectNameError = "";
  let ownerError = "";
  let formError = "";

  if (
    projectInfo?.projectName?.trim()?.length === 0 &&
    projectInfo?.owner?.id.trim()?.length === 0 &&
    projectInfo?.owner?.firstName.trim()?.length === 0 &&
    projectInfo?.owner?.lastName.trim()?.length === 0
  ) {
    projectNameError = "*Required Field";
    validationObj.push("Please enter the required fields");
  }

  if (projectInfo?.projectName?.trim()?.length === 0) {
    projectNameError = "*Required Field";
    validationObj.push("Please enter project name");
  }

  if (
    projectInfo?.owner?.id.trim()?.length === 0 &&
    projectInfo?.owner?.firstName.trim()?.length === 0 &&
    projectInfo?.owner?.lastName.trim()?.length === 0
  ) {
    ownerError = "*Required Field";
    validationObj.push("Please select owner");
  }

  const validation = {
    projectName: projectNameError,
    owner: ownerError,
    form: formError,
  };

  return { validation, validationObj };
};
