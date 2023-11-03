/* @refresh reload */
import { render } from "solid-js/web";
import { Router, Route, Routes } from "@solidjs/router";

import "./index.css";
import AuthPage from "./components/authentication/AuthPage";
import App from "./components/App";

const root = document.getElementById("root");

render(
  () => (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/home" element={<App />} />
        <Route path="/login" element={<AuthPage isLogin={true} />} />
        <Route path="/register" element={<AuthPage isLogin={false} />} />
      </Routes>
    </Router>
  ),
  root!
);
