import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import Control from "./Control.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename="/404wheel">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/control" element={<Control />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
