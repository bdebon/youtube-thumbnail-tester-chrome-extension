chrome.runtime.onInstalled.addListener(() => {
    //I wanted to factorize the code with a named function but it doesn't seem to work with the system of extension
    //Event listener when we go to another tab (already open)
    chrome.tabs.onActivated.addListener(async (info) => {
        const tab = await chrome.tabs.get(info.tabId);
        toggleExtensionUsability(tab)
    });

    //Event listener when a tab is updated
    chrome.tabs.onUpdated.addListener(async (tabId) => {
        const tab = await chrome.tabs.get(tabId);
        toggleExtensionUsability(tab)
    });
});

function toggleExtensionUsability(tab) {
    const isYoutube = tab.url.startsWith("https://www.youtube.com/");

    //Disable actions on the extension if the url retrieved is not https://www.youtube.com/
    isYoutube
        ? chrome.action.enable(tab.tabId)
        : chrome.action.disable(tab.tabId);
}
