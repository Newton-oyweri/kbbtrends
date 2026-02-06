import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import './index.css';

// 1. Import the CSS (Styles)
import 'bootstrap/dist/css/bootstrap.min.css';

// 2. Import the JS Bundle (Functionality for dropdowns, collapse, etc.)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);