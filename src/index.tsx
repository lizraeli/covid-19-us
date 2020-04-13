import React from "react";
import ReactDOM from "react-dom";

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import "./index.css";
import App from "./components/App";
import { CaseDataProvider } from "./providers/CaseData";

import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <React.StrictMode>
    <CaseDataProvider>
      <App />
    </CaseDataProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
