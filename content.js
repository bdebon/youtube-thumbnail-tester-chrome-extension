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
    if (request.type == "popup") {
        //console.log(request);
        showPopup();
    } else if (request.type === 'close_popup') {
        hidePopup();
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
    let cards = activeScreen.querySelectorAll('ytd-rich-item-renderer:not(#content):not(ytd-display-ad-renderer)')
    if (cards.length === 0) {
        cards = activeScreen.querySelectorAll('ytd-rich-grid-media:not(#content):not(ytd-display-ad-renderer)')
    }
    if (cards.length === 0) {
        cards = activeScreen.getElementsByTagName('ytd-grid-video-renderer')
    }
    if (cards.length === 0) {
        cards = activeScreen.getElementsByTagName('ytd-compact-video-renderer')
    }

    chrome.storage.local.get('thumbnailProperties', (result) => {
        if (!result.thumbnailProperties) {
            console.error('No thumbnail properties found in storage')
            hidePopup()
            return
        }

        if (result.thumbnailProperties.shuffle) {
            const min = 1
            const max = Math.min(12, cards.length - 1)
            cardPositionIndex = Math.floor(Math.random() * (max - min + 1)) + min
        }
        
        let target = cards[cardPositionIndex]
        if (!target) {
            console.error('No target card found at index', cardPositionIndex)
            hidePopup()
            return
        }

        // Try multiple selectors for thumbnail - nouvelle structure YouTube
        let thumbnail = target.querySelector('.yt-thumbnail-view-model__image img.yt-core-image')
        if (!thumbnail) {
            thumbnail = target.querySelector('yt-thumbnail-view-model img')
        }
        if (!thumbnail) {
            thumbnail = target.querySelector('a[class*="content-image"] img')
        }
        if (!thumbnail) {
            thumbnail = target.querySelector('#thumbnail img')
        }
        
        if (thumbnail) {
            thumbnail.src = result.thumbnailProperties.thumbnail
        }

        // Sélecteur pour le titre - nouvelle structure
        const title = target.querySelector('.yt-lockup-metadata-view-model-wiz__title')
        if (title) {
            title.textContent = result.thumbnailProperties.title
        }

        // Sélecteur pour le nom de la chaîne - nouvelle structure
        let channelName = target.querySelector('.yt-content-metadata-view-model-wiz__metadata-text a')
        if (!channelName) {
            channelName = target.querySelector('.yt-core-attributed-string__link')
        }
        
        if (channelName) {
            // Garder seulement le texte du nom, pas les icônes
            const textNode = channelName.childNodes[0]
            if (textNode && textNode.nodeType === Node.TEXT_NODE) {
                textNode.textContent = result.thumbnailProperties.channelName
            } else {
                channelName.textContent = result.thumbnailProperties.channelName
            }
        }

        // Channel's thumbnail management
        let channelThumbnailFromExtension = result.thumbnailProperties.channelThumbnail
        let channelThumbnailFromYoutube = document.querySelector('#avatar-btn img, #avatar img')

        // By default, we get the image from the extension
        let channelThumbnailValue = channelThumbnailFromExtension

        // But if there's no image then we try to get the real YT thumbnail
        // => Thumbnail from YT is null if not logged in so we check for it
        if (channelThumbnailValue == null && channelThumbnailFromYoutube != null) {
            channelThumbnailValue = channelThumbnailFromYoutube.src
        }

        // Finally, set the channel's thumbnail in the preview - nouvelle structure
        let avatar = target.querySelector('.yt-spec-avatar-shape__image')
        if (!avatar) {
            avatar = target.querySelector('yt-avatar-shape img')
        }
        if (!avatar) {
            avatar = target.querySelector('.yt-decorated-avatar-view-model-wiz img')
        }
        
        if (avatar && channelThumbnailValue) {
            avatar.src = channelThumbnailValue
        }

        hidePopup()
    })
}

showPopup()
