var overlay = null,
    frame = null

// Event send by the extension popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type == 'popup') {
        //console.log(request);
        showPopup()
    } else if (request.type === 'close_popup') {
        hidePopup()
    }
    return true
})

function showPopup() {
    if (document.querySelector('.py-popup-overlay')) {
        hidePopup()
        return false
    }

    overlay = document.createElement('div')
    frame = document.createElement('object')

    overlay.className = 'py-popup-overlay'
    frame.className = 'py-popup-container'
    frame.setAttribute('scrolling', 'no')
    frame.setAttribute('frameborder', '0')

    // file need to be added in manifest web_accessible_resources
    frame.data = chrome.runtime.getURL('html/popup.html')
    overlay.appendChild(frame)
    document.body.appendChild(overlay)

    overlay.addEventListener('click', hidePopup)
}

function hidePopup() {
    // Remove EventListener
    overlay.removeEventListener('click', hidePopup)

    // Remove the elements:
    document.querySelector('.py-popup-overlay').remove()

    // Clean up references:
    overlay = null
    frame = null
}
