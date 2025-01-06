
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";

import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <div className="main-container-splitwise">
    <App />
    <ToastContainer autoClose={2000} />
  </div>
);
