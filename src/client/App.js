// 3rd Party Libs
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import { ThemeProvider } from "styled-components";
// Config
import routes from "./routes";
import Head from "./components/Head";
import { dark, light } from "./styles/styledThemes";
import GlobalStyle from "./styles/globalStyles";
import ContentContainer from "./layout/Container";

const App = () => {
  // TODO: make a hook (https://usehooks.com/useRequireAuth/)
  const isAuthenticated = () => {
    return true;
  };

  return (
    <>
      <Head />
      <ThemeProvider theme={light}>
        <GlobalStyle />
        <Router basename="/">
          <ContentContainer>
            <Switch>
              {Object.entries(routes).map(
                ([path, { Component, beforeMount, exact, authenticated }]) =>
                  // Handle authenticated Routes
                  authenticated && !isAuthenticated ? (
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
              <Route render={() => <h1>Not Found</h1>} status={404} />
            </Switch>
          </ContentContainer>
        </Router>
      </ThemeProvider>
    </>
  );
};

export default App;
