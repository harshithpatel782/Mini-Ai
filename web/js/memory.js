
/* =====================================
   MINI-AI MEMORY CONTROLLER
   Version 1.0
===================================== */

"use strict";

const MiniMemory = {
  storageKey: "mini-ai-memories-v1",
  memories: [],

  init() {
    this.load();
    this.setupForm();
    this.setupClearButton();
    this.render();

    console.log("MINI-AI memory controller initialized.");
  },

  load() {
    try {
      const saved = JSON.parse(
        localStorage.getItem(this.storageKey) || "[]"
      );

      this.memories = Array.isArray(saved) ? saved : [];
    } catch (error) {
      this.memories = [];
    }
  },

  save() {
    try {
      localStorage.setItem(
        this.storageKey,
        JSON.stringify(this.memories)
      );

      return true;
    } catch (error) {
      this.updateStatus("Could not save memory.");
      return false;
    }
  },

  setupForm() {
    const form = document.querySelector("#memory-form");

    if (!form) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const input = form.querySelector("#memory-input");

      if (!input) return;

      const content = input.value.trim();

      if (!content) {
        this.updateStatus("Enter something to remember.");
        return;
      }

      this.add(content);
      input.value = "";
    });
  },

  add(content) {
    const memory = {
      id: (
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
      )
        ? crypto.randomUUID()
        : String(Date.now()) + Math.random(),

      content: String(content),
      createdAt: new Date().toISOString()
    };

    this.memories.unshift(memory);

    if (!this.save()) {
      this.memories.shift();
      return;
    }

    this.render();
    this.updateStatus("Memory saved on this device.");
  },

  remove(id) {
    const previous = this.memories;

    this.memories = this.memories.filter(
      (memory) => memory.id !== id
    );

    if (!this.save()) {
      this.memories = previous;
      return;
    }

    this.render();
    this.updateStatus("Memory deleted.");
  },

  setupClearButton() {
    const button = document.querySelector(
      "[data-memory-clear]"
    );

    if (!button) return;

    button.addEventListener("click", () => {
      if (!confirm("Delete all MINI-AI memories?")) return;

      const previous = this.memories;

      this.memories = [];

      if (!this.save()) {
        this.memories = previous;
        return;
      }

      this.render();
      this.updateStatus("All local memories cleared.");
    });
  },

  render() {
    const container = document.querySelector(
      "#memory-list"
    );

    if (!container) return;

    container.replaceChildren();

    if (this.memories.length === 0) {
      const empty = document.createElement("p");
      empty.textContent = "No saved memories yet.";
      container.appendChild(empty);
      return;
    }

    this.memories.forEach((memory) => {
      const item = document.createElement("article");
      item.className = "memory-item";

      const content = document.createElement("p");
      content.textContent = memory.content;

      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "Delete";

      button.addEventListener("click", () => {
        this.remove(memory.id);
      });

      item.append(content, button);
      container.appendChild(item);
    });
  },

  getAll() {
    return [...this.memories];
  },

  updateStatus(message) {
    const status = document.querySelector("#memory-status");

    if (status) {
      status.textContent = message;
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  MiniMemory.init();
});

window.MiniMemory = MiniMemory;

