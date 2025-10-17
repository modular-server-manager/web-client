// Simple entry point for the web app

import { App } from "./scripts/app";


document.addEventListener("DOMContentLoaded", () => {
    const app = new App();
    app.start();
});