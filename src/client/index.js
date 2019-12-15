// Client Entrypoint
import "@babel/polyfill";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

// Inject the rendered React app into the DOM.
ReactDOM.render(<App />, document.getElementById("root"));
