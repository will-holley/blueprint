//* React Core
import React from "react";
//* Routing
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import routes from "client/routes";
//* GraphQL
import { ApolloProvider } from "@apollo/client";
import client from "client/graphql";
//* Styles + Transitions
import styled, { ThemeProvider } from "styled-components";
import { dark, light } from "client/styles/styledThemes";
import GlobalStyle from "client/styles/globalStyles";
//* Components
import Head from "client/components/Head";

const theme =
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? dark
    : light;

const AppContainer = styled.div`
  position: relative;
  height: 100vh;
  width: 100vw;
  // DEV:
  //background: conic-gradient(#fff 90deg, #000 2turn);
`;

const isAuthenticated = true;

const App = () => (
  <>
    <Head />
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <ApolloProvider client={client}>
        <Router basename="/">
          <AppContainer>
            <Switch>
              {Object.entries(
                routes
              ).map(([path, { Component, exact, requiresAuth }]) =>
                requiresAuth && !isAuthenticated ? (
                  <Redirect to="/" />
                ) : (
                  <Route
                    key={`route-${path}`}
                    path={path}
                    exact={exact}
                    component={Component}
                  />
                )
              )}
              <Route status={404}>
                <Redirect to="/" />
              </Route>
            </Switch>
          </AppContainer>
        </Router>
      </ApolloProvider>
    </ThemeProvider>
  </>
);

export default App;
