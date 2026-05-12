import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n";
import { SITE } from "./config/siteConfig";
import { registerSW } from "virtual:pwa-register";

registerSW({ immediate: true });

// Welcome Signature
const style = "color: #22d3ee; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px #22d3ee; padding: 10px;";
const originalLog = window.console.log;
originalLog(`%cWelcome to my space -${SITE.brandHandle}`, style);

// Production hardening: Hide all console outputs for a clean black-box feel
if (import.meta.env.PROD || true) {
  const noop = () => {};
  window.console.log = noop;
  window.console.info = noop;
  window.console.warn = noop;
  window.console.error = noop;
  window.console.debug = noop;
}

document.documentElement.classList.add("dark");
createRoot(document.getElementById("root")!).render(<App />);
