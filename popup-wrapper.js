chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    if (tabs[0] === undefined || !tabs[0].url.startsWith('https://www.youtube.com/')) {
        const errorMessageSpan = document.querySelector('#extErrorMessage')
        errorMessageSpan.textContent = 'You need to be on YouTube!'
        return
    }

    chrome.scripting.executeScript({
        target: {tabId: tabs[0].id},
        // showPopup acutally toggles popup here
        func: () => window.__PREVYOU_LOADED ? (showPopup(), true) : false,
    }, results => {
        if (!results[0].result) {
            chrome.scripting.executeScript({
                target: {tabId: tabs[0].id},
                files: ['/content.js']
            });

            chrome.scripting.insertCSS({
                target: {tabId: tabs[0].id},
                files: ['/content.css']
            })
        }

        window.close();
    });
});
