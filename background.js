let color = "#3aa757";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log("Default background color set to %cgreen", `color: ${color}`);

  //disable actions on the extension if the url retrieved is not https://www.youtube.com/
  chrome.tabs.onActivated.addListener(async (info) => {
    const tab = await chrome.tabs.get(info.tabId);
    const isYoutube = tab.url.startsWith("https://www.youtube.com/");

    isYoutube
      ? chrome.action.enable(tab.tabId)
      : chrome.action.disable(tab.tabId);
  });
});
