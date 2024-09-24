document.addEventListener("DOMContentLoaded", function () {
  const toggleDarkMode = document.getElementById("toggleDarkMode");
  const darknessLevel = document.getElementById("darknessLevel");
  const autoToggle = document.getElementById("autoToggle");

  // Load saved settings from storage
  chrome.storage.sync.get(["darkModeEnabled", "darkness"], function (data) {
    toggleDarkMode.checked = data.darkModeEnabled || false;
    darknessLevel.value = data.darkness || 1;
  });

  // Toggle dark mode
  toggleDarkMode.addEventListener("change", () => {
    const enabled = toggleDarkMode.checked;
    chrome.storage.sync.set({ darkModeEnabled: enabled });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: toggleDarkModeOnPage,
        args: [enabled, parseFloat(darknessLevel.value)],
      });
    });
  });

  // Adjust darkness level
  darknessLevel.addEventListener("input", () => {
    const level = parseFloat(darknessLevel.value);
    chrome.storage.sync.set({ darkness: level });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: setDarknessLevelOnPage,
        args: [level],
      });
    });
  });

  // Auto toggle based on time
  autoToggle.addEventListener("click", () => {
    const hour = new Date().getHours();
    const darkMode = hour >= 18 || hour <= 6; // Enable between 6 PM and 6 AM
    chrome.storage.sync.set({ darkModeEnabled: darkMode });
    toggleDarkMode.checked = darkMode;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: toggleDarkModeOnPage,
        args: [darkMode, parseFloat(darknessLevel.value)],
      });
    });
  });
});

// Functions to apply dark mode on the page
function toggleDarkModeOnPage(enabled, level) {
  if (enabled) {
    document.documentElement.style.filter = `invert(1) brightness(${level}) hue-rotate(180deg)`;
    document.documentElement.style.backgroundColor = "#000";
  } else {
    document.documentElement.style.filter = "";
    document.documentElement.style.backgroundColor = "";
  }
}

function setDarknessLevelOnPage(level) {
  document.documentElement.style.filter = `invert(1) brightness(${level}) hue-rotate(180deg)`;
}
