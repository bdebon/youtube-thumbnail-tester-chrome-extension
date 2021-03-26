// =============================================
// Elements de popup.html
let findCardBtn = document.querySelector(".js-find-card");
const titleInput = document.querySelector('.js-title-input')
const channelThumbnailInput = document.querySelector('.js-channel-thumbnail-input')
const channelNameInput = document.querySelector('.js-channel-name-input')
const thumbnailInput = document.querySelector('.js-thumbnail-input')
const errorMessageSpan = document.querySelector("#extErrorMessage")
// =============================================

let imgBase64 = null
let channelThumbnailBase64 = null
const preview = document.querySelector('.preview-channel-thumbnail');

initInputs();

function initInputs() {
  chrome.storage.local.get("thumbnailProperties", (result) => {
	  var storedThumbnail = result.thumbnailProperties;
	  
	  // If there's valid data stored
	  if(typeof(storedThumbnail) !== "undefined") {
		titleInput.value = storedThumbnail.title
		channelNameInput.value = storedThumbnail.channelName

		channelThumbnailBase64 = storedThumbnail.channelThumbnail
		preview.src = channelThumbnailBase64
	  }
  })
  
  // Au début : nettoyage des eventuels messages d'erreur
  removeError();
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
  
  
  // A la fin du click : affichage des potentielles erreurs
  
  // Je n'arrive pas à récupérer le retour de findCard 
  // Ni à exécuter du code directement après findCard
  // Donc ce setTimeout de 100ms est un petit contournement
  // Sinon l'erreur ne s'affiche pas au 1er clic sur GO
  setTimeout(
    function() {
	  checkForError();
	}, 100);
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
  // Select randomly a card between a range
  let min = 1
  let max = 12
  let cardPositionIndex = Math.floor(Math.random() * (max - min + 1)) + min
  
  // Target only ytd-rich-item-renderer element and not ytd-rich-item-renderer with id content
  let cards = document.querySelectorAll('.ytd-rich-item-renderer:not(#content)')
  let target = cards[cardPositionIndex]
  
  // Si le user n'est pas sur YT => message d'erreur
  if(typeof(target) === "undefined") {
    chrome.storage.local.set({errorMessage: "Vous devez être sur la page d'accueil de Youtube !"});
    return;
  }
  
  
  chrome.storage.local.get("thumbnailProperties", (result) => {
    const thumbnail = target.querySelector('.yt-img-shadow')
    thumbnail.src = result.thumbnailProperties.thumbnail

    const title = target.querySelector('#video-title')
    const channelName = target.querySelector('.ytd-channel-name a')
    
    title.textContent = result.thumbnailProperties.title
    channelName.textContent = result.thumbnailProperties.channelName
	
	// Gestion de la thumbnail de la chaine
	let channelThumbnailFromExtension = result.thumbnailProperties.channelThumbnail
	let channelThumbnailFromYoutube = document.querySelector("#avatar-btn .yt-img-shadow")
	
	// Par défaut on prend l'image insérée dans l'extension
	let channelThumbnailValue = channelThumbnailFromExtension
	
	// Si pas d'image insérée alors on tente de récupérer l'actuelle image du compte
	// => Thumbnail YT null si non loggé à YT donc on vérifie
	if(channelThumbnailValue == null && channelThumbnailFromYoutube != null) {
		channelThumbnailValue = channelThumbnailFromYoutube.src
	}
	
	// On set la thumbnail de la chaine dans l'aperçu vidéo
    target.querySelector('#avatar-link img').src = channelThumbnailValue
  });
}

// Vérifie si il y a une erreur dans le storage
// Si oui, l'affiche et puis la clear
function checkForError() {
  chrome.storage.local.get(['errorMessage'], function(result) {
    if(typeof(result.errorMessage) !== "undefined") {
	  errorMessageSpan.textContent = result.errorMessage;
	  errorMessageSpan.style.display = "block";
	}
  });
  chrome.storage.local.remove(['errorMessage']);
}	

// Retire les erreurs et leur affichage
function removeError() {
  errorMessageSpan.textContent = "";
  errorMessageSpan.style.display = "none";
  chrome.storage.local.remove(['errorMessage']);
}



