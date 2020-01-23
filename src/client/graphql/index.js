import {
  ApolloClient,
  HttpLink,
  ApolloLink,
  InMemoryCache,
  concat
} from "@apollo/client";
import jwtDecode from "jwt-decode";

const httpLink = new HttpLink({ uri: `${process.env.API_ADDRESS}/graphql` });

const authMiddleware = new ApolloLink((operation, forward) => {
  // Get the token
  const token = window.localStorage.getItem("jwt");
  // Validate the token
  if (token) {
    const { exp } = jwtDecode(token);
    if (Date.now() >= exp * 1000) {
      window.localStorage.removeItem("jwt");
    } else {
      // authenticate the request
      operation.setContext({
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }
  }
  return forward(operation);
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink),
  defaultOptions: {
    query: {
      partialRefetch: true,
      returnPartialData: false
    }
  }
});

export default client;
