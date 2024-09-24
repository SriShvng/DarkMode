chrome.storage.sync.get(["darkModeEnabled", "darkness"], function (data) {
  if (data.darkModeEnabled) {
    document.documentElement.style.filter = `invert(1) brightness(${
      data.darkness || 1
    }) hue-rotate(180deg)`;
    document.documentElement.style.backgroundColor = "#000";
  }
});
