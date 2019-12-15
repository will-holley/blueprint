import Dashboard from "../views/Dashboard";

const routes = {
  "/": {
    exact: true,
    component: Dashboard,
    authenticated: false,
    label: "Dashboard",
    nav: false
  }
};

export default routes;
