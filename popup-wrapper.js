chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
        type: "popup"
    },
    (response) => {
        if (response) {
            //console.log(response);
        }
    });
    window.close();
});
