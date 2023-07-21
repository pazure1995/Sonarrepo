import Validator from "email-validator";

export const EmailValidator = (email) => {
  let errorObj = [];
  if (email !== undefined && email.trim().length > 0) {
    if (!Validator.validate(email)) {
      errorObj.push("Invalid Email");
    }
  }
  return errorObj;
};
