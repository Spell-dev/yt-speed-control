const storage = typeof browser !== "undefined" ? browser.storage.sync : chrome.storage.sync;
const action = chrome.action; // In MV3, use chrome.action

function updateBadge(speed) {
  const s = parseFloat(speed);
  // If speed is not 1.0, display it as badge with one decimal place; otherwise clear the badge
  if (s !== 1.0) {
    action.setBadgeText({ text: `${s.toFixed(1)}x` });
    action.setBadgeBackgroundColor({ color: "#FF0000" });
  } else {
    action.setBadgeText({ text: "" });
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.speed) {
    updateBadge(message.speed);
  }
});

chrome.commands.onCommand.addListener((command) => {
  storage.get("speed", (data) => {
    let speed = parseFloat(data.speed) || 1.0;
    if (command === "increase_speed") {
      speed = Math.min(speed + 0.1, 3.0);
    } else if (command === "decrease_speed") {
      speed = Math.max(speed - 0.1, 0.1);
    }
    speed = parseFloat(speed.toFixed(2));
    storage.set({ speed: speed.toFixed(2) });
    updateBadge(speed.toFixed(1));
  });
});
