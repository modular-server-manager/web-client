// Simple entry point for the web app
import "./styles/main.scss";

function setGreeting() {
  const el = document.getElementById("greeting");
  if (!el) return;
  const now = new Date();
  el.textContent = `Hello — ${now.toLocaleString()}`;
}

document.addEventListener("DOMContentLoaded", () => {
  setGreeting();

  // Hot-reload friendly: log that app started
  // (esbuild watch + live-server will reload the page on change)
  console.log("web-client started");
});