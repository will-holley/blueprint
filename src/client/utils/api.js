import axios from "axios";

class APISingleton {
  //! Statics
  tokenName = "jwt";

  constructor() {
    this.client = axios.create({
      baseURL: `${process.env.API_ADDRESS}/api/1/`,
      timeout: 1000,
      headers: {
        //$ On application load, if a token exists, use it to authenticate
        //$ requests.
        Authorization: `Bearer ${this.jwt}`
      }
    });
  }

  get jwt() {
    const token = window.localStorage.getItem(this.tokenName);
    return token ? token : "";
  }

  get isAuthenticated() {
    return Boolean(this.jwt);
  }

  authenticate(token) {
    window.localStorage.setItem(this.tokenName, token);
    this.updateAuthorizationHeader(token);
  }

  deAuthenticate() {
    //$ Erase session demarcation.
    window.localStorage.removeItem(this.tokenName);
    //$ Clear request header.
    this.updateAuthorizationHeader("");
  }

  updateAuthorizationHeader(token) {
    this.client.defaults.headers["Authorization"] = `Bearer ${token}`;
  }

  async request(url, method, headers = {}, data = {}) {
    try {
      const response = await this.client({
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
  }
}

export default new APISingleton();
