import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { PartnerProvider } from "./contexts/partnerContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PartnerProvider>
      <App />
    </PartnerProvider>
  </StrictMode>
);
