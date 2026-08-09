import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "./auth/UserContext.jsx";

import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <App />
      <Toaster position="top-right" />
    </UserProvider>
  </StrictMode>,
);
