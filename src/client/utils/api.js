import axios from "axios";
import jwtDecode from "jwt-decode";

class APISingleton {
  //! Statics
  tokenName = "jwt";
  client = axios.create({
    baseURL: `${process.env.API_ADDRESS}/api/1/`,
    timeout: 1000,
    headers: {
      Authorization: `Bearer ${this.token}`
    }
  });

  constructor() {
    // Check if there is a JWT and if it is valid.  If it's expired,
    // delete it.
    const token = this.token;
    if (!token) return;
    const { exp } = jwtDecode(token);
    if (Date.now() >= exp * 1000) this.deAuthenticate();
  }

  get token() {
    const token = window.localStorage.getItem(this.tokenName);
    return token ? token : "";
  }

  get isAuthenticated() {
    return Boolean(this.token);
  }

  /**
   * Adds token to localStorage so that it persists between client sessions
   * and, as such, indicates to the API that the user is still logged in.  Token
   * is also added to the Authorization header of the axios client in order to
   * authenticate all requests for the remainder of this session.
   * @param {string} token A JSON Web Token for the current user.
   */
  authenticate(token) {
    window.localStorage.setItem(this.tokenName, token);
    this.updateAuthorizationHeader(token);
  }

  /**
   * Removes JWT from localStorage and Authorization header.
   */
  deAuthenticate() {
    //$ Erase session demarcation.
    window.localStorage.removeItem(this.tokenName);
    //$ Clear request header.
    this.updateAuthorizationHeader("");
  }

  /**
   * Sets the axios client's Authorization header.
   * @param {string} A JWT or empty string.
   */
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
      return error && error.response ? error.response.message : error;
    }
  }
}

export default new APISingleton();
