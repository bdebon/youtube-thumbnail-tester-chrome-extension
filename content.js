var overlay = null,
    frame = null;

window.__PREVYOU_LOADED = true

// Event send by the inner `<object>` script
window.addEventListener('message', e => {
    if (e.data && e.data.type === 'find_card') {
        findCard()
    }
})

// Event send by the extension popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch(request.type) {
        case "popup":
            showPopup();
        break;

        case "close_popup":
            hidePopup();
        break;
    }
    return true;
});

function showPopup() {
    if (document.querySelector(".py-popup-overlay")) {
        hidePopup();
        return false;
    }

    overlay = document.createElement('div');
    frame = document.createElement('object');

    overlay.className = "py-popup-overlay";
    frame.className = "py-popup-container";
    frame.setAttribute("scrolling", "no");
    frame.setAttribute("frameborder", "0");

    // file need to be added in manifest web_accessible_resources
    frame.data = chrome.runtime.getURL("popup.html");
    overlay.appendChild(frame);
    document.body.appendChild(overlay);

    overlay.addEventListener("click", hidePopup);
}

function hidePopup() {
    // Remove EventListener
    overlay.removeEventListener("click", hidePopup);

    // Remove the elements:
    document.querySelector(".py-popup-overlay").remove();

    // Clean up references:
    overlay = null;
    frame = null;
}

function findCard() {
    // Select a random a card in between a range
    let cardPositionIndex = 0

    const activeScreen = document.querySelector('[role="main"]')
    // Target only ytd-rich-item-renderer element and not ytd-rich-item-renderer with id content for the main page
    let cards = activeScreen.querySelectorAll('.ytd-rich-grid-media:not(#content):not(ytd-display-ad-renderer)')
    if (cards.length === 0) {
        cards = activeScreen.getElementsByTagName('ytd-grid-video-renderer')
    }
    if (cards.length === 0) {
        cards = activeScreen.getElementsByTagName('ytd-compact-video-renderer')
    }

    chrome.storage.local.get('thumbnailProperties', (result) => {

        if (result.thumbnailProperties.shuffle) {
            const min = 1
            const max = 12
            cardPositionIndex = Math.floor(Math.random() * (max - min + 1)) + min
        }
        let target = cards[cardPositionIndex]
        const thumbnail = target.querySelector('.ytd-thumbnail > img')
        thumbnail.src = result.thumbnailProperties.thumbnail

        const title = target.querySelector('#video-title')
        let channelName = target.querySelector('.ytd-channel-name a')
        if (!channelName) {
            channelName = target.querySelector('.ytd-channel-name')
        }

        title.textContent = result.thumbnailProperties.title
        channelName.textContent = result.thumbnailProperties.channelName

        // Channel's thumbnail management
        let channelThumbnailFromExtension = result.thumbnailProperties.channelThumbnail
        let channelThumbnailFromYoutube = document.querySelector('#avatar-btn .yt-img-shadow')

        // By default, we get the image from the extension
        let channelThumbnailValue = channelThumbnailFromExtension

        // But if there's no image then we try to get the real YT thumbnail
        // => Thumbnail from YT is null if not logged in so we check for it
        if (channelThumbnailValue == null && channelThumbnailFromYoutube != null) {
            channelThumbnailValue = channelThumbnailFromYoutube.src
        }

        // Finally, set the channel's thumbnail in the preview
        let avatar = target.querySelector('#avatar-link .yt-img-shadow')
        if (avatar) {
            avatar.src = channelThumbnailValue
        }

        hidePopup()
    })
}

showPopup()
