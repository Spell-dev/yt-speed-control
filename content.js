const storage = typeof browser !== "undefined" ? browser.storage.sync : chrome.storage.sync;

function setSpeed(speed) {
  const video = document.querySelector("video");
  if (video) {
    video.playbackRate = parseFloat(speed);
  }
  // Always update the badge via message to the background service worker
  chrome.runtime.sendMessage({ speed: parseFloat(speed).toFixed(2) });
}

// On script load, get saved speed and apply it
storage.get("speed", (data) => {
  const speed = data.speed ? parseFloat(data.speed).toFixed(2) : "1.00";
  setSpeed(speed);
});

// Observe for new video elements (e.g., when navigating on YouTube)
const observer = new MutationObserver(() => {
  storage.get("speed", (data) => {
    if (data.speed) {
      setSpeed(data.speed);
    }
  });
});
observer.observe(document.body, { childList: true, subtree: true });

// Handle keyboard shortcuts for increasing/decreasing speed
document.addEventListener("keydown", (event) => {
  storage.get(["speed"], (data) => {
    let speed = parseFloat(data.speed) || 1.00;
    if (event.ctrlKey && event.key === "ArrowUp") {
      speed = Math.min(speed + 0.1, 3.0);
    } else if (event.ctrlKey && event.key === "ArrowDown") {
      speed = Math.max(speed - 0.1, 0.1);
    } else {
      return; // Not a relevant key press
    }
    speed = parseFloat(speed.toFixed(2));
    setSpeed(speed);
    storage.set({ speed: speed.toFixed(2) });
  });
});
