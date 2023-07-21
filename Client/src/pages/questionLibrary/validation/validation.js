export const questionValidation = (questionInfo) => {
  const validationObj = [];
  let questionError = "";
  let typeError = "";
  let difficultyError = "";
  let skillError = "";
  let fromError = "";
  let answerError = "";
  let optionError = "";

  if (
    questionInfo?.question?.trim()?.length === 0 &&
    questionInfo?.type?.trim()?.length === 0 &&
    questionInfo?.difficulty?.trim()?.length === 0 &&
    questionInfo?.skill?.trim()?.length === 0
  ) {
    fromError = "*Required Field";
    validationObj.push("Please enter the required fields");
  }

  if (questionInfo?.question?.trim()?.length === 0 && fromError === "") {
    questionError = "*Required Field";
    validationObj.push("Please enter question");
  }

  if (questionInfo?.type?.trim()?.length === 0 && fromError === "") {
    typeError = "*Required Field";
    validationObj.push("Please select the question category");
  }

  if (questionInfo?.difficulty?.trim()?.length === 0 && fromError === "") {
    difficultyError = "*Required Field";
    validationObj.push("Please select difficulty");
  }

  if (questionInfo?.type === "MCQ" && fromError === "") {
    if (questionInfo?.options?.length === 0) {
      optionError = "*Required Field";
      validationObj.push("Please enter options");
    }
    if (
      questionInfo?.options?.length > 0 &&
      questionInfo?.options?.filter((x) => x?.length > 0)?.length < 2
    ) {
      optionError = "*Required Field";
      validationObj.push("Please enter options");
    }
    if (questionInfo?.answer?.length === 0) {
      answerError = "*Required Field";
      validationObj.push("Please select answer");
    }
    if (
      questionInfo?.answer?.length > 0 &&
      questionInfo?.answer[0]?.length === 0
    ) {
      answerError = "*Required Field";
      validationObj.push("Please select answer");
    }
  }

  if (questionInfo?.skill?.trim()?.length === 0 && fromError === "") {
    skillError = "*Required Field";
    validationObj.push("Please enter skill");
  }

  const validation = {
    fromError: fromError,
    question: questionError,
    type: typeError,
    difficulty: difficultyError,
    skill: skillError,
    options: optionError,
    answer: answerError,
  };

  return { validation, validationObj };
};
