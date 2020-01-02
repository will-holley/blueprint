import axios from "axios";

//! ====================
//! == User JWT Token ==
//! ====================

const userToken = () => {
  const token = window.localStorage.getItem("userToken");
  return token ? token : "";
};

const clearUserToken = () => {
  window.localStorage.removeItem("userToken");
};

//! ==================
//! == API Requests ==
//! ==================

const api = axios.create({
  baseURL: `${process.env.API_ADDRESS}/api/1/`,
  timeout: 1000,
  headers: {
    Authorization: `Bearer ${userToken()}`
  }
});

const request = async (url, method, headers = {}, data = {}) => {
  try {
    const response = await api({
      method,
      url,
      headers,
      data,
      responseType: "json"
    });
    return response.data;
  } catch (error) {
    return new Error(error);
  }
};

//! ===============
//! == API Utils ==
//! ===============

const attachBearerToAPI = () => {
  const token = `Bearer ${userToken()}`;
  axios.defaults.headers.common["Authorization"] = token;
};

//! ============
//! == Export ==
//! ============

export { request, attachBearerToAPI, userToken, clearUserToken };
