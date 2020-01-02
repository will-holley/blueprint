import Documents from "client/views/Documents";
import Document from "client/views/Document";
import Join from "client/views/Authentication/Join";
import Login from "client/views/Authentication/Login";

const routes = {
  //$ Documents
  "/": {
    exact: true,
    Component: Documents,
    authenticated: false,
    label: "Dashboard"
  },
  //$ Document
  "/d/:humanId": {
    exact: true,
    Component: Document,
    authenticated: false,
    label: "Document"
  },
  "/join": {
    exact: true,
    Component: Join,
    authenticated: false,
    label: "Join"
  },
  "/login": {
    exact: true,
    Component: Login,
    authenticated: false,
    label: "Login"
  }
};

export default routes;
