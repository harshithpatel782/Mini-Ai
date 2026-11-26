
/* =====================================
   MINI-AI CHAT CONTROLLER
   Version 1.0
===================================== */

"use strict";

const MiniChat = {
  storageKey: "mini-ai-chat-history-v1",
  messages: [],

  init() {
    this.loadHistory();
    this.setupForm();
    this.setupClearButton();
    this.renderMessages();

    console.log("MINI-AI chat initialized.");
  },

  loadHistory() {
    try {
      const saved = JSON.parse(
        localStorage.getItem(this.storageKey) || "[]"
      );

      this.messages = Array.isArray(saved) ? saved : [];
    } catch (error) {
      this.messages = [];
    }
  },

  saveHistory() {
    try {
      localStorage.setItem(
        this.storageKey,
        JSON.stringify(this.messages)
      );
    } catch (error) {
      console.warn("Could not save chat history.");
    }
  },

  setupForm() {
    const form = document.querySelector("#chat-form");
    if (!form) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const input = form.querySelector(
        "#chat-input"
      );

      if (!input) return;

      const text = input.value.trim();
      if (!text) return;

      this.sendMessage(text);
      input.value = "";
      input.focus();
    });

    const input = form.querySelector("#chat-input");

    if (input) {
      input.addEventListener("keydown", (event) => {
        if (
          event.key === "Enter" &&
          !event.shiftKey &&
          !event.isComposing
        ) {
          event.preventDefault();
          form.requestSubmit();
        }
      });
    }
  },

  setupClearButton() {
    const button = document.querySelector(
      "[data-clear-chat]"
    );

    if (!button) return;

    button.addEventListener("click", () => {
      if (!confirm("Clear all saved chat messages?")) return;

      this.messages = [];
      this.saveHistory();
      this.renderMessages();
    });
  },

  sendMessage(text) {
    this.messages.push({
      role: "user",
      content: text,
      timestamp: new Date().toISOString()
    });

    this.saveHistory();
    this.renderMessages();

    this.showPlaceholder();
  },

  showPlaceholder() {
    const notice = document.querySelector(
      "#chat-status"
    );

    if (notice) {
      notice.textContent =
        "AI engine not connected yet. Your message is saved locally.";
    }
  },

  renderMessages() {
    const container = document.querySelector(
      "#chat-messages"
    );

    if (!container) return;

    container.replaceChildren();

    if (this.messages.length === 0) {
      const empty = document.createElement("div");
      empty.className = "chat-empty";

      const heading = document.createElement("h2");
      heading.textContent = "Welcome to MINI-AI";

      const description = document.createElement("p");
      description.textContent =
        "Your conversation will appear here. Connect an AI engine to receive intelligent answers.";

      empty.append(heading, description);
      container.appendChild(empty);
      return;
    }

    this.messages.forEach((message) => {
      const bubble = document.createElement("div");

      bubble.className =
        message.role === "user"
          ? "message user"
          : "message assistant";

      const content = document.createElement("p");
      content.textContent = message.content;

      const time = document.createElement("span");
      time.className = "message-time";

      const date = new Date(message.timestamp);

      time.textContent = Number.isNaN(date.getTime())
        ? ""
        : date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          });

      bubble.append(content, time);
      container.appendChild(bubble);
    });

    container.scrollTop = container.scrollHeight;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  MiniChat.init();
});

window.MiniChat = MiniChat;
l
