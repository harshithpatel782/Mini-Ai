
/* =====================================
   MINI-AI NAVIGATION SYSTEM
   Version 1.0
===================================== */

"use strict";

const MiniNavigation = {
  init() {
    this.setupMenu();
    this.highlightActiveLink();
    this.setupPageLinks();

    console.log("MINI-AI navigation initialized.");
  },

  setupMenu() {
    const menuButton = document.querySelector(
      "[data-menu-toggle]"
    );

    const navigation = document.querySelector(
      "[data-navigation]"
    );

    if (!menuButton || !navigation) return;

    menuButton.addEventListener("click", () => {
      const isOpen =
        menuButton.getAttribute("aria-expanded") === "true";

      menuButton.setAttribute(
        "aria-expanded",
        String(!isOpen)
      );

      navigation.classList.toggle("is-open", !isOpen);
    });

    navigation.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        navigation.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
      }
    });
  },

  highlightActiveLink() {
    const currentPage = (
      window.location.pathname.split("/").pop() || "index.html"
    ).toLowerCase();

    document.querySelectorAll("[data-navigation] a").forEach((link) => {
      const linkPage = (
        link.getAttribute("href") || ""
      ).split("/").pop().toLowerCase();

      if (linkPage && linkPage === currentPage) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      } else {
        link.classList.remove("active");
        link.removeAttribute("aria-current");
      }
    });
  },

  setupPageLinks() {
    document.querySelectorAll("[data-page-link]").forEach((link) => {
      link.addEventListener("click", (event) => {
        const destination = link.getAttribute("href");

        if (!destination || destination.startsWith("#")) {
          return;
        }

        // Allow the browser to open normal page links.
        if (
          event.ctrlKey ||
          event.metaKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }
      });
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  MiniNavigation.init();
});

window.MiniNavigation = MiniNavigation;

