chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    if (tabs[0] === undefined || !tabs[0].url.startsWith('https://www.youtube.com/')) {
        const errorMessageSpan = document.querySelector('#extErrorMessage')
        errorMessageSpan.textContent = 'You need to be on YouTube!'
        return
    }

    chrome.tabs.executeScript(tabs[0].id, {
        // showPopup acutally toggles popup here
        code: 'window.__PREVYOU_LOADED ? (showPopup(), true) : false'
    }, res => {
        if (!res[0]) {
            chrome.tabs.executeScript(tabs[0].id, {
                file: '/content.js'
            })

            chrome.tabs.insertCSS(tabs[0].id, {
                file: '/content.css'
            })

        }

        window.close()
    })
})
