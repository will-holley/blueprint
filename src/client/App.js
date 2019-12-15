// 3rd Party Libs
import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { ThemeProvider } from "styled-components";
// Config
import routes from "./config/routes";
import Head from "./config/Head";
import { dark, light } from "./config/styledThemes";
import GlobalStyle from "./config/globalStyles";
// Our Components
import ViewContainer from "./components/containers/ViewContainer";
import Nav from "./components/Nav";
import ContentContainer from "./components/containers/ContentContainer";

class App extends React.Component {
  get isAuthenticated() {
    // Until authentication is set up, return true by default.
    return true;
  }

  render() {
    return (
      <>
        <Head />
        <ThemeProvider theme={light}>
          <GlobalStyle />
          <BrowserRouter basename="/">
            <ViewContainer>
              <Nav />
              <ContentContainer>
                <Switch>
                  {Object.keys(routes).map(path => {
                    const { component, exact, authenticated } = routes[path];
                    // Handle authenticated Routes
                    return authenticated && !this.isAuthenticated ? (
                      <Redirect to="/" />
                    ) : (
                      <Route
                        key={`route-${path}`}
                        path={path}
                        exact={exact}
                        component={component}
                      />
                    );
                  })}
                  <Route render={() => <h1>Not Found</h1>} status={404} />
                </Switch>
              </ContentContainer>
            </ViewContainer>
          </BrowserRouter>
        </ThemeProvider>
      </>
    );
  }
}

export default App;
