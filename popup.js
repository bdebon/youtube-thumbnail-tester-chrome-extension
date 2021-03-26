let channelBase64 = null;
let videoBase64 = null;

const imagePreviews = document.querySelectorAll('.image-upload-preview');
const uploadInputs = document.querySelectorAll('.image-upload-input');
const textInputs = document.querySelectorAll('.text-input');
const backIcon = document.getElementById('back');
const closeIcon = document.getElementById('close');

(function () {
  chrome.storage.local.get('thumbnailProperties', (result) => {
	  const storedThumbnail = result.thumbnailProperties;
	  
	  // If there's valid data stored
	  if(typeof(storedThumbnail) !== 'undefined') {
      textInputs[0].value = storedThumbnail.channelName;
      textInputs[1].value = storedThumbnail.title;
      imagePreviews[0].src = storedThumbnail.channelThumbnail;
      
      // Remove empty class to display channel thumbnail
      document.querySelector('.upload-icon').classList.remove('empty');
      
      if (storedThumbnail.channelThumbnail)
        channelBase64 = storedThumbnail.channelThumbnail
	  }
  });
})();

async function submitCustomCard() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  const channelName = textInputs[0].value;
  const title = textInputs[1].value;

  try {
    chrome.storage.local.set({ thumbnailProperties: {
      title,
      channelName,
      channelThumbnail: channelBase64,
      thumbnail: videoBase64
    } });
  } catch(e) {
    console.error('Error with the Youtube thumbnail extension : ' + e)
  }

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: findCard,
  });
}

function findCard() {
  chrome.storage.local.get('thumbnailProperties', (result) => {
    const cardPositionIndex = 2;

    const target = document.querySelectorAll('.ytd-rich-item-renderer')[cardPositionIndex];
	
    const thumbnail = target.querySelector('.yt-img-shadow');
    thumbnail.src = result.thumbnailProperties.thumbnail;
	
    const title = target.querySelector('#video-title');
    const channelName = target.querySelector('.ytd-channel-name a');
    const channelThumbnail = target.querySelector('#avatar-link img');

    title.textContent = result.thumbnailProperties.title;
    channelName.textContent = result.thumbnailProperties.channelName;
    channelThumbnail.src = result.thumbnailProperties.channelThumbnail;
  });
}

currentStep = 0;
function changeStep(back = false) {
  const steps = document.querySelectorAll('.step');
  
  if ((back && currentStep === 0) || (!back && currentStep === steps.length - 1))
    return;
  
  const selectors = document.querySelectorAll('#pagination li');
  
  steps[currentStep].classList.remove('active');
  selectors[currentStep].classList.remove('active');
  
  if (back)
    currentStep -= 1;
  else
    currentStep += 1;
    
  if (currentStep === 0)
    backIcon.classList.add('hidden');
  else if (backIcon.classList.contains('hidden'))
    backIcon.classList.remove('hidden');

  if (currentStep === steps.length - 1)
    previewConfirm();

  steps[currentStep].classList.add('active');
  selectors[currentStep].classList.add('active');
}

function previewConfirm() {
  const imagePreview = document.querySelectorAll('.submit-image-preview');
  console.log(imagePreview);
  uploadInputs.forEach((input, i) => {
    const file = input.files[0];
    if (!file && i === 0)
      return imagePreview[0].src = channelBase64;

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      imagePreview[i].src = reader.result;
      if (i === 0)
        channelBase64 = reader.result;
      else if (i === 1)
        videoBase64 = reader.result;
    }, false);

    reader.readAsDataURL(file);
  });
  
  // Set the text preview
  const textPreview = document.querySelectorAll('.submit-text-preview');
  textInputs.forEach((input, i) => textPreview[i].textContent = input.value);
}

(function () {
  // Close and Back
  closeIcon.addEventListener('click', () => window.close());
  backIcon.addEventListener('click', () => changeStep(true));
  
  // Global
  const nextButtons = document.querySelectorAll('.submit-button');
  nextButtons.forEach(e => {
    e.addEventListener('click', () => {
      const attr = e.getAttribute('data-action');
      if (attr === 'next')
        return changeStep();
      
        submitCustomCard();
    });
  });

  // Automatize previewing image
  const labels = document.querySelectorAll('.upload-icon');
  uploadInputs.forEach((input, i) => {
    input.addEventListener('change', () => {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.addEventListener('load', () => {
        imagePreviews[i].src = reader.result;
        labels[i].classList.remove('empty');
      }, false);
      
      if (file)
        reader.readAsDataURL(file);
    });
  })
})();
