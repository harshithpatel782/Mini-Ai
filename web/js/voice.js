
/* =====================================
   MINI-AI VOICE CONTROLLER
   Version 1.0
===================================== */

"use strict";

const MiniVoice = {
  recognition: null,
  listening: false,

  init() {
    this.setupRecognition();
    this.setupButtons();

    console.log("MINI-AI voice controller initialized.");
  },

  setupRecognition() {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech recognition is not supported.");
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = "en-IN";
    this.recognition.continuous = false;
    this.recognition.interimResults = false;

    this.recognition.onstart = () => {
      this.listening = true;
      this.updateStatus("Listening...");
    };

    this.recognition.onresult = (event) => {
      const transcript =
        event.results[0][0].transcript;

      const input = document.querySelector("#chat-input");

      if (input) {
        input.value = transcript;
        input.focus();
      }

      this.updateStatus("Speech recognized.");
    };

    this.recognition.onerror = (event) => {
      this.listening = false;
      this.updateStatus(
        "Microphone error: " + event.error
      );
    };

    this.recognition.onend = () => {
      this.listening = false;
    };
  },

  setupButtons() {
    const startButton = document.querySelector(
      "[data-voice-start]"
    );

    const stopButton = document.querySelector(
      "[data-voice-stop]"
    );

    const speakButton = document.querySelector(
      "[data-voice-speak]"
    );

    if (startButton) {
      startButton.addEventListener("click", () => {
        this.startListening();
      });
    }

    if (stopButton) {
      stopButton.addEventListener("click", () => {
        this.stopListening();
      });
    }

    if (speakButton) {
      speakButton.addEventListener("click", () => {
        const input = document.querySelector("#voice-text");

        if (input) {
          this.speak(input.value);
        }
      });
    }
  },

  startListening() {
    if (!this.recognition) {
      this.updateStatus(
        "Speech recognition is unavailable in this browser."
      );
      return;
    }

    try {
      this.recognition.start();
    } catch (error) {
      this.updateStatus(
        "Could not start microphone. Try again."
      );
    }
  },

  stopListening() {
    if (this.recognition && this.listening) {
      this.recognition.stop();
    }

    this.listening = false;
    this.updateStatus("Listening stopped.");
  },

  speak(text) {
    if (!("speechSynthesis" in window)) {
      this.updateStatus(
        "Text-to-speech is not supported."
      );
      return;
    }

    const settings = this.getSettings();

    if (settings.voice === false) {
      this.updateStatus(
        "Voice output is disabled in Settings."
      );
      return;
    }

    const message = String(text || "").trim();

    if (!message) {
      this.updateStatus("There is no text to speak.");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "en-IN";
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onend = () => {
      this.updateStatus("Speech completed.");
    };

    utterance.onerror = () => {
      this.updateStatus("Speech playback failed.");
    };

    window.speechSynthesis.speak(utterance);
  },

  getSettings() {
    try {
      return JSON.parse(
        localStorage.getItem("mini-ai-settings-v1") || "{}"
      );
    } catch (error) {
      return {};
    }
  },

  updateStatus(message) {
    const status = document.querySelector(
      "#voice-status"
    );

    if (status) {
      status.textContent = message;
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  MiniVoice.init();
});

window.MiniVoice = MiniVoice;

