import React from "react";
import PropTypes from "prop-types";
import { Route, Switch, Redirect } from "react-router-dom";
//* Route Components
import Dashboard from "client/views/Dashboard";
import Document from "client/views/Document";
import Authentication from "client/views/Authentication";

const routes = {
  //$ Dashboard
  "/": {
    exact: true,
    Component: Dashboard,
    requiresAuth: false,
    label: "Dashboard"
  },
  //$ Document
  "/d/:humanId": {
    exact: true,
    Component: Document,
    requiresAuth: false,
    label: "Document"
  },
  "/join": {
    exact: true,
    Component: Authentication,
    requiresAuth: false,
    label: "Join"
  },
  "/login": {
    exact: true,
    Component: Authentication,
    requiresAuth: false,
    label: "Login"
  }
};

const Routes = ({ isAuthenticated }) => (
  <Switch>
    {Object.entries(routes).map(([path, { Component, exact, requiresAuth }]) =>
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
);

export default Routes;
