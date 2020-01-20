import axios from "axios";
import jwtDecode from "jwt-decode";

class GraphQLAgent {
  tokenName = "jwt";
  httpClient = axios.create({
    baseURL: `${process.env.API_ADDRESS}/graphql`,
    timeout: 1000,
    responseType: "json"
  });

  constructor() {
    if (this.token) {
      // Check if token has expired
      const { exp } = jwtDecode(this.token);
      if (Date.now() >= exp * 1000) {
        this.deAuthenticate();
      }
    }
  }

  get token() {
    const token = window.localStorage.getItem(this.tokenName);
    return token ? token : null;
  }

  get user() {
    return this.token ? jwtDecode(this.token) : {};
  }

  authenticate(token) {
    window.localStorage.setItem(this.tokenName, token);
  }

  deAuthenticate() {
    window.localStorage.removeItem(this.tokenName);
  }

  async request(operation, variables) {
    // Default headers
    const headers = {
      "Content-Type": "application/json"
    };

    // Determine if an auth token is present
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    try {
      const response = await this.httpClient({
        method: "POST",
        headers,
        data: {
          query: operation.text, // GraphQL text from input
          variables
        }
      });
      return response.data;
    } catch (error) {
      return error && error.response ? error.response.message : error;
    }
  }
}

export default new GraphQLAgent();
