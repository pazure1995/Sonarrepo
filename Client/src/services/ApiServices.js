import axios from "axios";
import { getUserToken } from "./AuthServices";
import { apiDomain } from "../constants/constants";
export const get = (url) => fetch(url, "GET", null);
export const post = (url, data, token) => fetch(url, "POST", data, token);
export const put = (url, data, token) => fetch(url, "PUT", data, token);

const fetch = async (url, method, data = null, props, token = null) => {
  let userToken;
  if (token !== null) {
    userToken = token;
  } else {
    userToken = getUserToken();
  }
  const bearer = `Bearer ${userToken.token}`;
  const headers = { Authorization: bearer };
  let body;
  let response;
  if (method !== "GET") {
    body = data ? data : null;
    response = axios.post(`${apiDomain}${url}`, body, { headers });
    return response;
  }
  response = axios.get(`${apiDomain}${url}`, { headers });
  return response;
};
