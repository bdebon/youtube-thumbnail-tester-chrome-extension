// =============================================
// Elements from popup.html
let findCardBtn = document.querySelector(".js-find-card");
let shuffleBtn = document.querySelector(".js-shuffle");
let resetBtn = document.querySelector(".js-reset-btn");
const titleInput = document.querySelector('.js-title-input')
const channelThumbnailInput = document.querySelector('.js-channel-thumbnail-input')
const channelNameInput = document.querySelector('.js-channel-name-input')
const thumbnailInput = document.querySelector('.js-thumbnail-input')
const errorMessageSpan = document.querySelector("#extErrorMessage")
// =============================================

let videoThumbnail = null
let channelThumbnailBase64 = null
const preview = document.querySelector('.preview-channel-thumbnail');
const previewVideo = document.querySelector('.preview-video-thumbnail');

initInputs();

function initInputs() {
    chrome.storage.local.get("thumbnailProperties", (result) => {
        var storedThumbnail = result.thumbnailProperties;

        // If there's valid data stored
        if (typeof (storedThumbnail) !== "undefined") {
            console.log(storedThumbnail)
            titleInput.value = storedThumbnail.title || null
            channelNameInput.value = storedThumbnail.channelName || null

            videoThumbnail = storedThumbnail.thumbnail
            if(videoThumbnail) {
                previewVideo.src = videoThumbnail
                thumbnailInput.classList.add('loaded')
            }

            channelThumbnailBase64 = storedThumbnail.channelThumbnail
            if(channelThumbnailBase64) {
                preview.src = channelThumbnailBase64
                channelThumbnailInput.classList.add('loaded')
            }
        }
    })

    // At the beginning : clear the possible error messages
    removeError();
}

findCardBtn.addEventListener("click", async () => {
    await launchScript(false)
})

shuffleBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    await launchScript(true)
})

async function launchScript(shuffle = false) {
    let [tab] = await chrome.tabs.query({active: true, currentWindow: true});

    const title = titleInput.value
    const channelName = channelNameInput.value

    try {
        console.log(shuffle)
        chrome.storage.local.set({
            thumbnailProperties: {
                title: title,
                channelName: channelName,
                thumbnail: videoThumbnail,
                channelThumbnail: channelThumbnailBase64,
                shuffle: shuffle
            }
        });

    } catch (e) {
        console.error("Error with the Youtube thumbnail extension : " + e)
    }

    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        function: findCard,
    });


    // Display potential errors when the click is done

    // I can't get the return from findCard
    // I can't execute code directly after findCard either
    // Soooo this setTimeout of 100ms is a small hack
    // Otherwise the error doesn't display on the first click
    setTimeout(
        function () {
            checkForError();
        }, 10);
}


thumbnailInput.addEventListener('change', (e) => {
    const file = thumbnailInput.files[0];
    const reader = new FileReader();

    reader.addEventListener("load", function () {
        // convert image file to base64 string
        videoThumbnail = reader.result
        previewVideo.src = reader.result;
    }, false);

    if (file) {
        reader.readAsDataURL(file);
    }
})

channelThumbnailInput.addEventListener('change', (e) => {
    const file = channelThumbnailInput.files[0];
    const reader = new FileReader();

    reader.addEventListener("load", function () {
        // convert image file to base64 string
        channelThumbnailBase64 = reader.result
        preview.src = reader.result;
    }, false);

    if (file) {
        reader.readAsDataURL(file);
    }
})

resetBtn.addEventListener('click', (e) => {
    refreshApp()
})


function findCard(shuffle = false) {
    // Select randomly a card between a range

    let cardPositionIndex = 1

    // Target only ytd-rich-item-renderer element and not ytd-rich-item-renderer with id content
    let cards = document.querySelectorAll('.ytd-rich-item-renderer:not(#content)')

    chrome.storage.local.get("thumbnailProperties", (result) => {

        if(result.thumbnailProperties.shuffle) {
            let min = 1
            let max = 12
            cardPositionIndex = Math.floor(Math.random() * (max - min + 1)) + min
        }
        let target = cards[cardPositionIndex]

        // If the user is on another site than YT
        if (typeof (target) === "undefined") {
            chrome.storage.local.set({errorMessage: "You need to be on the Youtube homepage !"});
            return;
        }

        const thumbnail = target.querySelector('.yt-img-shadow')
        thumbnail.src = result.thumbnailProperties.thumbnail

        const title = target.querySelector('#video-title')
        const channelName = target.querySelector('.ytd-channel-name a')

        title.textContent = result.thumbnailProperties.title
        channelName.textContent = result.thumbnailProperties.channelName

        // Channel's thumbnail management
        let channelThumbnailFromExtension = result.thumbnailProperties.channelThumbnail
        let channelThumbnailFromYoutube = document.querySelector("#avatar-btn .yt-img-shadow")

        // By default, we get the image from the extension
        let channelThumbnailValue = channelThumbnailFromExtension

        // But if there's no image then we try to get the real YT thumbnail
        // => Thumbnail from YT is null if not logged in so we check for it
        if (channelThumbnailValue == null && channelThumbnailFromYoutube != null) {
            channelThumbnailValue = channelThumbnailFromYoutube.src
        }

        // Finally, set the channel's thumbnail in the preview
        target.querySelector('#avatar-link img').src = channelThumbnailValue
    });
}

// Checks if an error is stored
// If so then displays it and clears it
function checkForError() {
    chrome.storage.local.get(['errorMessage'], function (result) {
        if (typeof (result.errorMessage) !== "undefined") {
            errorMessageSpan.textContent = result.errorMessage;
            errorMessageSpan.style.display = "block";
        } else {
            // everything went smooth so we can close the popup to let the user enjoy
            window.close();
        }
    });
    chrome.storage.local.remove(['errorMessage']);
}

// Removes the errors from storage and from the display
function removeError() {
    errorMessageSpan.textContent = "";
    errorMessageSpan.style.display = "none";
    chrome.storage.local.remove(['errorMessage']);
}

function refreshApp() {
    chrome.storage.local.get("thumbnailProperties", (result) => {
        chrome.storage.local.set({
            thumbnailProperties: {
                channelName: result.thumbnailProperties.channelName,
                channelThumbnail: result.thumbnailProperties.channelThumbnail
            }
        });
    })

    titleInput.value = null
    thumbnailInput.classList.remove('loaded')
    thumbnailInput.value = null
}
