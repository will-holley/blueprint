import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.API_ADDRESS}/api/1/`,
  timeout: 1000
});

const request = async (url, method, headers = {}, data = {}) => {
  //$ Request Data from the API
  console.log(url, method);
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

export { request };
