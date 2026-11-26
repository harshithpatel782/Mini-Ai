
/* =====================================
   MINI-AI SETTINGS CONTROLLER
   Version 1.0
===================================== */

"use strict";

const MiniSettings = {
  storageKey: "mini-ai-settings-v1",

  defaults: {
    theme: "dark",
    voiceEnabled: true,
    saveHistory: true
  },

  settings: {},

  init() {
    this.load();
    this.applyTheme();
    this.setupControls();

    console.log("MINI-AI settings initialized.");
  },

  load() {
    try {
      const saved = JSON.parse(
        localStorage.getItem(this.storageKey) || "{}"
      );

      this.settings = {
        ...this.defaults,
        ...(saved && typeof saved === "object" ? saved : {})
      };
    } catch (error) {
      this.settings = { ...this.defaults };
    }
  },

  save() {
    try {
      localStorage.setItem(
        this.storageKey,
        JSON.stringify(this.settings)
      );
      return true;
    } catch (error) {
      this.showStatus("Unable to save settings.");
      return false;
    }
  },

  update(key, value) {
    if (!Object.prototype.hasOwnProperty.call(
      this.defaults,
      key
    )) {
      return;
    }

    const previous = this.settings[key];
    this.settings[key] = value;

    if (!this.save()) {
      this.settings[key] = previous;
      return;
    }

    if (key === "theme") {
      this.applyTheme();
    }

    this.showStatus("Settings saved.");
  },

  applyTheme() {
    const theme =
      this.settings.theme === "light" ? "light" : "dark";

    document.documentElement.dataset.theme = theme;
  },

  setupControls() {
    const themeControl = document.querySelector(
      "#theme-setting"
    );

    if (themeControl) {
      themeControl.value = this.settings.theme;

      themeControl.addEventListener("change", () => {
        this.update("theme", themeControl.value);
      });
    }

    const voiceControl = document.querySelector(
      "#voice-setting"
    );

    if (voiceControl) {
      voiceControl.checked = Boolean(
        this.settings.voiceEnabled
      );

      voiceControl.addEventListener("change", () => {
        this.update(
          "voiceEnabled",
          voiceControl.checked
        );
      });
    }

    const historyControl = document.querySelector(
      "#history-setting"
    );

    if (historyControl) {
      historyControl.checked = Boolean(
        this.settings.saveHistory
      );

      historyControl.addEventListener("change", () => {
        this.update(
          "saveHistory",
          historyControl.checked
        );
      });
    }

    const resetButton = document.querySelector(
      "[data-reset-settings]"
    );

    if (resetButton) {
      resetButton.addEventListener("click", () => {
        if (!confirm("Reset all settings to defaults?")) {
          return;
        }

        const previous = this.settings;
        this.settings = { ...this.defaults };

        if (!this.save()) {
          this.settings = previous;
          return;
        }

        this.applyTheme();
        this.setupControls();
        this.showStatus("Settings reset.");
      });
    }
  },

  get(key) {
    return this.settings[key];
  },

  getAll() {
    return { ...this.settings };
  },

  showStatus(message) {
    const status = document.querySelector("#settings-status");

    if (status) {
      status.textContent = message;
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  MiniSettings.init();
});

window.MiniSettings = MiniSettings;

