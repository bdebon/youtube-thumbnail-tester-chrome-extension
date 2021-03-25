// Initialize butotn with users's prefered color
//let changeColor = document.getElementById("changeColor");
let findCardBtn = document.querySelector(".js-find-card");
const titleInput = document.querySelector('.js-title-input')
const channelThumbnailInput = document.querySelector('.js-channel-thumbnail-input')
const channelNameInput = document.querySelector('.js-channel-name-input')
const thumbnailInput = document.querySelector('.js-thumbnail-input')

let imgBase64 = null
let channelThumbnailBase64 = null
const preview = document.querySelector('.preview-channel-thumbnail');
// chrome.storage.sync.get("color", ({ color }) => {
//   changeColor.style.backgroundColor = color;
// });

// When the button is clicked, inject setPageBackgroundColor into current page
// changeColor.addEventListener("click", async () => {
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     function: setPageBackgroundColor,
//   });
// });
initInputs()

function initInputs() {
  chrome.storage.local.get("thumbnailProperties", (result) => {
    titleInput.value = result.thumbnailProperties.title
    channelNameInput.value = result.thumbnailProperties.channelName

    channelThumbnailBase64 = result.thumbnailProperties.channelThumbnail
    console.log(channelThumbnailBase64, preview)
    preview.src = channelThumbnailBase64
  })
}

findCardBtn.addEventListener("click", async () => {
  console.log('click on Find Card Button')
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
    console.log(e)
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


function findCard(title) {
  console.log(title)
  console.log('title', chrome.storage.sync.get("title"))

  chrome.storage.local.get("thumbnailProperties", (result) => {
    console.log(result)
    const cardPositionIndex = 4;

//    const card = document.querySelectorAll('ytd-rich-item-renderer')[1]
//     const thumbnailToReplace = document.querySelectorAll('.ytd-thumbnail')[cardPositionIndex]
//     const titleToReplace = document.querySelectorAll('#video-title')[cardPositionIndex]
//
//     console.log(thumbnailToReplace, titleToReplace)

    console.log(result)

    const target = document.querySelectorAll('.ytd-rich-item-renderer')[cardPositionIndex]
    const thumbnail = target.querySelector('.yt-img-shadow')
    thumbnail.src = result.thumbnailProperties.thumbnail
    const title = target.querySelector('#video-title')
    const channelName = target.querySelector('.ytd-channel-name a')
    const channelThumbnail = target.querySelector('#avatar-link img')

    title.textContent = result.thumbnailProperties.title
    channelName.textContent = result.thumbnailProperties.channelName
    channelThumbnail.src = result.thumbnailProperties.channelThumbnail


    // console.log(card.querySelector('#video-title'))
    // const newCard = card.cloneNode(true)
    // card.parentElement.insertBefore(newCard, card)
    //card.parentElement.prepend(newCard)
    //console.log(document.querySelectorAll('ytd-rich-item-renderer')[1])
  });


}


