import Dashboard from "client/views/Dashboard";
//import Document from "client/views/Document";
import Authentication from "client/views/Authentication";

export default {
  "/": {
    exact: true,
    Component: Dashboard,
    requiresAuth: false,
    label: "Dashboard"
  },
  // "/d/:humanId": {
  //   exact: true,
  //   Component: Document,
  //   requiresAuth: false,
  //   label: "Document"
  // },
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
