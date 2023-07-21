export const SetUpSignIn = (userToken) => {
  localStorage.setItem("userToken", JSON.stringify(userToken));
  return true;
};

export const getUserToken = () => {
  const userTkn = JSON.parse(localStorage.getItem("userToken")) || {};
  const token = Object.entries(userTkn).length !== 0 ? userTkn : "";
  return token;
};

export const getUserEmail = () => {
  const userTkn = localStorage.getItem("userToken") || {};
  const token = Object.entries(userTkn).length !== 0 ? userTkn : "";
  return JSON.parse(token).email;
};

export const getUserCompanyId = () => {
  const userTkn = localStorage.getItem("userToken") || {};
  const token = Object.entries(userTkn).length !== 0 ? userTkn : "";
  return JSON.parse(token).companyId;
};

export const getUserCompanyName = () => {
  const userTkn = localStorage.getItem("userToken") || {};
  const token = Object.entries(userTkn).length !== 0 ? userTkn : "";
  return JSON.parse(token).companyName;
};

export const getUserRole = () => {
  const userTkn = localStorage.getItem("userToken") || {};
  const token = Object.entries(userTkn).length !== 0 ? userTkn : "";
  return JSON.parse(token).role;
};

export const getUserId = () => {
  const userTkn = localStorage.getItem("userToken") || {};
  const token = Object.entries(userTkn).length !== 0 ? userTkn : "";
  return JSON.parse(token).id;
};
