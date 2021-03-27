// Initialize button with users's prefered color
let findCardBtn = document.querySelector(".js-find-card");
const titleInput = document.querySelector('.js-title-input')
const channelThumbnailInput = document.querySelector('.js-channel-thumbnail-input')
const channelNameInput = document.querySelector('.js-channel-name-input')
const thumbnailInput = document.querySelector('.js-thumbnail-input')

const randomButton = document.querySelector('.js-random-position')
const randomPosition = false

let imgBase64 = null
let channelThumbnailBase64 = null
const preview = document.querySelector('.preview-channel-thumbnail');

initInputs();

// Init value from chrome store
function initInputs() {

  chrome.storage.local.get("thumbnailProperties", (result) => {
    var storedThumbnail = result.thumbnailProperties;

    // If there's valid data stored
    if (typeof (storedThumbnail) !== "undefined") {
      titleInput.value = storedThumbnail.title
      channelNameInput.value = storedThumbnail.channelName

      channelThumbnailBase64 = storedThumbnail.channelThumbnail
      preview.src = channelThumbnailBase64
    }
  })

  chrome.storage.local.get('randomPosition', function (result) {
    randomButton.attributes.checked = result.randomPosition
  })
}

findCardBtn.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  const title = titleInput.value
  const channelName = channelNameInput.value

  try {
    chrome.storage.local.set({ thumbnailProperties: {
        title: title,
        channelName: channelName,
        thumbnail: imgBase64,
        channelThumbnail: channelThumbnailBase64
      } });
	  
  } catch(e) {
    console.error("Error with the Youtube thumbnail extension : " + e)
  }

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: findCard,
  });
})


thumbnailInput.addEventListener('change', (e) => {
  const file = thumbnailInput.files[0];
  const reader = new FileReader();

  reader.addEventListener("load", function () {
    // convert image file to base64 string
    imgBase64 = reader.result
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

// Storage randomPosition value
randomButton.addEventListener('click', event => {
  chrome.storage.local.set({ 'randomPosition': event.target.checked })
})


function findCard(title) {

  // Get randomPosition from the store and paste value
  chrome.storage.local.get('randomPosition', function (result) {
    randomPosition = result.randomPosition
  });

  chrome.storage.local.get("thumbnailProperties", (result) => {

    let cardPositionIndex = 4

    if (randomPosition) {
      // Select randomly a card between a range
      let min = 1
      let max = 12

      // Target only ytd-rich-item-renderer element and not ytd-rich-item-renderer with id content
      cardPositionIndex = Math.floor(Math.random() * (max - min + 1)) + min
    }

    const cards = document.querySelectorAll('.ytd-rich-item-renderer:not(#content)')
    const target = cards[cardPositionIndex]

    const thumbnail = target.querySelector('.yt-img-shadow')
    thumbnail.src = result.thumbnailProperties.thumbnail

    const title = target.querySelector('#video-title')
    const channelName = target.querySelector('.ytd-channel-name a')
    const channelThumbnail = target.querySelector('#avatar-link img')

    title.textContent = result.thumbnailProperties.title
    channelName.textContent = result.thumbnailProperties.channelName
    channelThumbnail.src = result.thumbnailProperties.channelThumbnail
  });
}



