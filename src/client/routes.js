import Documents from "client/views/Documents";
import Document from "client/views/Document";

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
  }
};

export default routes;
