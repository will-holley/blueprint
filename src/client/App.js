//* React Core
import React from "react";
//* Redux & Routing
import { Provider } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";
import store, { history } from "./data/store";
import routes from "./routes";
//* Styles & Meta Data
import { ThemeProvider } from "styled-components";
import { dark, light } from "./styles/styledThemes";
import GlobalStyle from "./styles/globalStyles";
//* Components
import Head from "./components/Head";
import ContentContainer from "./layout/Container";

//? Determine whether app should be in light or dark mode
const colorMode =
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? dark
    : light;

const App = () => {
  // TODO: pull from the store
  const isAuthenticated = () => {
    return true;
  };

  return (
    <>
      <Head />
      <Provider store={store}>
        <ThemeProvider theme={colorMode}>
          <GlobalStyle />
          <ConnectedRouter history={history} basename="/">
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
                <Route status={404}>
                  <Redirect to="/" />
                </Route>
              </Switch>
            </ContentContainer>
          </ConnectedRouter>
        </ThemeProvider>
      </Provider>
    </>
  );
};

export default App;
