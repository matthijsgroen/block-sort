import React from "react";
import ReactDOM from "react-dom/client";

import "./ios-screen-height-patch";

import { App } from "./App";

import "./index.css";
import "./icons.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
