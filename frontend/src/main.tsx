import { createRoot } from "react-dom/client";
import { CurrencyProvider } from "@/hooks";
import App from "./App";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <CurrencyProvider>
    <App />
  </CurrencyProvider>
);
  