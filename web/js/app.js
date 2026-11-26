
/* =====================================
   MINI-AI APPLICATION CORE
   Version 1.0
===================================== */

"use strict";

const MINI_AI = {
  name: "MINI-AI",
  version: "1.0.0",
  settingsKey: "mini-ai-settings-v1",

  init() {
    this.loadTheme();
    this.registerServiceWorker();
    this.updateConnectionStatus();
    this.setupNavigation();
    console.log("MINI-AI application initialized.");
  },

  loadTheme() {
    try {
      const settings = JSON.parse(
        localStorage.getItem(this.settingsKey) || "{}"
      );

      const theme = settings.theme || "dark";

      const selectedTheme =
        theme === "system"
          ? (
              window.matchMedia("(prefers-color-scheme: light)").matches
                ? "light"
                : "dark"
            )
          : theme;

      document.documentElement.dataset.theme = selectedTheme;
    } catch (error) {
      document.documentElement.dataset.theme = "dark";
      console.warn("Could not load theme settings.");
    }
  },

  async registerServiceWorker() {
    if (!("serviceWorker" in navigator)) {
      console.info("Service workers are not supported.");
      return;
    }

    if (
      location.protocol !== "https:" &&
      location.hostname !== "localhost" &&
      location.hostname !== "127.0.0.1"
    ) {
      console.info("Service worker requires HTTPS or localhost.");
      return;
    }

    try {
      const registration =
        await navigator.serviceWorker.register(
          "./service-worker.js"
        );

      console.log(
        "Service worker registered:",
        registration.scope
      );
    } catch (error) {
      console.error(
        "Service worker registration failed:",
        error
      );
    }
  },

  updateConnectionStatus() {
    const update = () => {
      const online = navigator.onLine;

      document.documentElement.dataset.connection =
        online ? "online" : "offline";

      const status = document.querySelector(
        "[data-connection-status]"
      );

      if (status) {
        status.textContent = online
          ? "Online"
          : "Offline";
      }
    };

    window.addEventListener("online", update);
    window.addEventListener("offline", update);

    update();
  },

  setupNavigation() {
    const menuButton = document.querySelector(
      "[data-menu-toggle]"
    );

    const menu = document.querySelector(
      "[data-navigation]"
    );

    if (!menuButton || !menu) return;

    menuButton.addEventListener("click", () => {
      const expanded =
        menuButton.getAttribute("aria-expanded") === "true";

      menuButton.setAttribute(
        "aria-expanded",
        String(!expanded)
      );

      menu.classList.toggle("is-open", !expanded);
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  MINI_AI.init();
});

window.MINI_AI = MINI_AI;

