
/* =====================================
   MINI-AI AUTHENTICATION MANAGER
   Frontend prototype only
===================================== */

"use strict";

const MiniAuth = {
  sessionKey: "mini-ai-session-v1",

  getSession() {
    try {
      return JSON.parse(
        sessionStorage.getItem(this.sessionKey) || "null"
      );
    } catch (error) {
      return null;
    }
  },

  isLoggedIn() {
    return Boolean(this.getSession());
  },

  setSession(email) {
    sessionStorage.setItem(
      this.sessionKey,
      JSON.stringify({
        email: email,
        createdAt: new Date().toISOString()
      })
    );
  },

  logout() {
    sessionStorage.removeItem(this.sessionKey);
    window.location.href = "login.html";
  },

  validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  validatePassword(password) {
    return typeof password === "string" &&
      password.length >= 8;
  },

  showMessage(element, message, isError = false) {
    if (!element) return;

    element.textContent = message;
    element.style.color = isError ? "#ff7777" : "#35d69a";
  },

  setupLogin() {
    const form = document.querySelector("#login-form");
    if (!form) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const email = form.querySelector(
        '[name="email"]'
      )?.value.trim();

      const password = form.querySelector(
        '[name="password"]'
      )?.value;

      const message = document.querySelector(
        "#auth-message"
      );

      if (!this.validateEmail(email)) {
        this.showMessage(
          message,
          "Enter a valid email address.",
          true
        );
        return;
      }

      if (!this.validatePassword(password)) {
        this.showMessage(
          message,
          "Password must contain at least 8 characters.",
          true
        );
        return;
      }

      this.showMessage(
        message,
        "Demo login only. Secure authentication is not connected.",
        true
      );
    });
  },

  setupSignup() {
    const form = document.querySelector("#signup-form");
    if (!form) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const email = form.querySelector(
        '[name="email"]'
      )?.value.trim();

      const password = form.querySelector(
        '[name="password"]'
      )?.value;

      const confirmPassword = form.querySelector(
        '[name="confirm-password"]'
      )?.value;

      const message = document.querySelector(
        "#auth-message"
      );

      if (!this.validateEmail(email)) {
        this.showMessage(
          message,
          "Enter a valid email address.",
          true
        );
        return;
      }

      if (!this.validatePassword(password)) {
        this.showMessage(
          message,
          "Password must contain at least 8 characters.",
          true
        );
        return;
      }

      if (password !== confirmPassword) {
        this.showMessage(
          message,
          "Passwords do not match.",
          true
        );
        return;
      }

      this.showMessage(
        message,
        "Form validated. Account creation requires a secure backend.",
        true
      );
    });
  },

  setupPasswordVisibility() {
    document.querySelectorAll(
      "[data-password-toggle]"
    ).forEach((button) => {
      button.addEventListener("click", () => {
        const targetId = button.dataset.passwordToggle;
        const input = document.getElementById(targetId);

        if (!input) return;

        input.type =
          input.type === "password" ? "text" : "password";

        button.setAttribute(
          "aria-label",
          input.type === "password"
            ? "Show password"
            : "Hide password"
        );
      });
    });
  },

  init() {
    this.setupLogin();
    this.setupSignup();
    this.setupPasswordVisibility();

    console.log("MINI-AI auth manager initialized.");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  MiniAuth.init();
});

window.MiniAuth = MiniAuth;

