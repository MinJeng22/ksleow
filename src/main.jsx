import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.jsx";

const root = document.getElementById("root");

const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

if (root?.hasChildNodes()) {
  hydrateRoot(root, app, {
    onRecoverableError(error, errorInfo) {
      console.error("[hydration-debug]", error.message, errorInfo?.componentStack || "");
    },
  });
} else {
  createRoot(root).render(app);
}
