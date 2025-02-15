document.addEventListener("DOMContentLoaded", () => {
  const speedInput = document.getElementById("speed");
  const increaseShortcut = document.getElementById("increaseShortcut");
  const decreaseShortcut = document.getElementById("decreaseShortcut");
  const saveButton = document.getElementById("save");
  const resetButton = document.getElementById("reset");
  const messageBox = document.getElementById("message");

  const storage = typeof browser !== "undefined" ? browser.storage.sync : chrome.storage.sync;

  // Load saved values
  storage.get(["speed", "increaseShortcut", "decreaseShortcut"], (data) => {
    if (data.speed) speedInput.value = parseFloat(data.speed).toFixed(2);
    if (data.increaseShortcut) increaseShortcut.value = data.increaseShortcut;
    if (data.decreaseShortcut) decreaseShortcut.value = data.decreaseShortcut;
  });

  function showMessage(message, type = "success") {
    messageBox.textContent = message;
    messageBox.className = type;
    messageBox.style.display = "block";
    setTimeout(() => {
      messageBox.style.display = "none";
    }, 3000);
  }

  saveButton.addEventListener("click", () => {
    const newSpeed = parseFloat(speedInput.value).toFixed(2);
    storage.set({
      speed: newSpeed,
      increaseShortcut: increaseShortcut.value,
      decreaseShortcut: decreaseShortcut.value
    }, () => {
      showMessage("Settings saved!", "success");
      // Update badge via background script
      chrome.runtime.sendMessage({ speed: newSpeed });
    });
  });

  resetButton.addEventListener("click", () => {
    storage.set({
      speed: "1.00",
      increaseShortcut: "Ctrl+Up",
      decreaseShortcut: "Ctrl+Down"
    }, () => {
      speedInput.value = "1.00";
      increaseShortcut.value = "Ctrl+Up";
      decreaseShortcut.value = "Ctrl+Down";
      showMessage("Settings reset to default!", "success");
      // Update badge (badge will be cleared if speed is 1)
      chrome.runtime.sendMessage({ speed: "1.00" });
    });
  });
});
