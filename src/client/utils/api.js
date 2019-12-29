import _ from "lodash";

const request = async (router, method, headers = {}, data = {}) => {
  // Build request args
  const hasBody = !["GET", "HEAD"].includes(method);
  const endpoint = `${process.env.API_ADDRESS}/api/1/${router}`;

  //$ Request Data from the API
  try {
    const response = await fetch(endpoint, {
      method,
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: Object.assign(headers, {
        "Content-Type": "application/json"
      }),
      body: hasBody ? JSON.stringify(data) : null
    });
    return response.json();
  } catch (error) {
    return new Error(error);
  }
};

export { request };
