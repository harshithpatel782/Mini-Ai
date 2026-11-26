
/* =====================================
   MINI-AI VISION CONTROLLER
   Version 1.0
===================================== */

"use strict";

const MiniVision = {
  selectedFile: null,
  previewUrl: null,

  init() {
    this.setupFileInput();
    this.setupClearButton();

    console.log("MINI-AI vision controller initialized.");
  },

  setupFileInput() {
    const input = document.querySelector("#vision-file");

    if (!input) return;

    input.addEventListener("change", (event) => {
      const file = event.target.files?.[0];

      if (!file) return;

      this.selectImage(file);
    });
  },

  selectImage(file) {
    const status = document.querySelector("#vision-status");

    if (!file.type.startsWith("image/")) {
      this.updateStatus("Please select a valid image.");
      return;
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      this.updateStatus("Image must be smaller than 10 MB.");
      return;
    }

    this.clearPreview();

    this.selectedFile = file;
    this.previewUrl = URL.createObjectURL(file);

    const preview = document.querySelector("#vision-preview");

    if (preview) {
      preview.replaceChildren();

      const image = document.createElement("img");
      image.src = this.previewUrl;
      image.alt = "Selected image preview";
      image.style.maxWidth = "100%";
      image.style.maxHeight = "350px";
      image.style.objectFit = "contain";
      image.style.borderRadius = "14px";

      preview.appendChild(image);
    }

    this.updateStatus(
      "Image selected. AI image understanding is not connected yet."
    );
  },

  setupClearButton() {
    const button = document.querySelector(
      "[data-vision-clear]"
    );

    if (!button) return;

    button.addEventListener("click", () => {
      this.clearPreview();

      const input = document.querySelector("#vision-file");

      if (input) {
        input.value = "";
      }

      this.updateStatus("Image removed.");
    });
  },

  clearPreview() {
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
    }

    this.previewUrl = null;
    this.selectedFile = null;

    const preview = document.querySelector("#vision-preview");

    if (preview) {
      preview.replaceChildren();
    }
  },

  getSelectedFile() {
    return this.selectedFile;
  },

  updateStatus(message) {
    const status = document.querySelector("#vision-status");

    if (status) {
      status.textContent = message;
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  MiniVision.init();
});

window.MiniVision = MiniVision;

