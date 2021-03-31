// =============================================
// Elements from popup.html
let findCardBtn = document.querySelector(".js-find-card");
let shuffleBtn = document.querySelector(".js-shuffle");
let resetBtn = document.querySelector(".js-reset-btn");
const titleInput = document.querySelector('.js-title-input')
const channelThumbnailInput = document.querySelector('.js-channel-thumbnail-input')
const channelNameInput = document.querySelector('.js-channel-name-input')
const randomButton = document.querySelector('#random')
const thumbnailInput = document.querySelector('.js-thumbnail-input')
const errorMessageSpan = document.querySelector("#extErrorMessage")
const darkModeBtn = document.querySelector('.js-darkmode-btn')
const root = document.documentElement // to easily access and modify CSS custom properties for Dark/Light Mode
const headerEye = document.querySelector('.js-header-eyes')
const eyesPupils = document.querySelectorAll('.js-animated-eyes')

// =============================================

// =============================================
// DARK/LIGHT MODE handler

// Once the page loaded, check if the Dark Mode is activated with a function that 
// return 'on' or null depending of the existence of a 'darkMode' key on LocalStorage
window.onload = () =>{ 
    if ( isDarkModeOn() == "on" ){ 
        setTimeout(darkMode,
        300);
    }
} 


darkModeBtn.addEventListener( 'click', () => {
    if ( isDarkModeOn() == null ) {
        darkMode()
        localStorage.setItem( 'darkMode', 'on' )
    } else {
        lightMode()
        localStorage.removeItem( 'darkMode' )
    }
})

//function that check the existence of the key 'darkMode' on LocalStorage
function isDarkModeOn(){
    return localStorage.getItem( 'darkMode' ) ? 'on' : null;  
}


function darkMode(){
    darkModeBtn.innerHTML = 
        "<svg width=\"43\" height=\"43\" viewBox=\"0 0 43 43\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">"
        +"<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M20 8.50003C20 7.6716 20.6716 7.00003 21.5 7.00003C22.3284 7.00003 23 7.6716 23 8.50003V9.50003C23 10.3285 22.3284 11 21.5 11C20.6716 11 20 10.3285 20 9.50003V8.50003ZM29.6317 11.247C30.2175 10.6612 31.1673 10.6612 31.7531 11.247C32.3388 11.8327 32.3388 12.7825 31.7531 13.3683C31.1673 13.9541 30.2175 13.9541 29.6317 13.3683C29.0459 12.7825 29.0459 11.8327 29.6317 11.247ZM11.247 13.3683C10.6612 12.7825 10.6612 11.8327 11.247 11.247C11.8327 10.6612 12.7825 10.6612 13.3683 11.247C13.9541 11.8327 13.9541 12.7825 13.3683 13.3683C12.7825 13.9541 11.8327 13.9541 11.247 13.3683ZM14 21.5C14 17.3579 17.3579 14 21.5 14C25.6421 14 29 17.3579 29 21.5C29 25.6421 25.6421 29 21.5 29C17.3579 29 14 25.6421 14 21.5ZM28.9246 28.9246C28.3388 29.5104 28.3388 30.4602 28.9246 31.0459C29.5104 31.6317 30.4602 31.6317 31.0459 31.0459C31.6317 30.4602 31.6317 29.5104 31.0459 28.9246C30.4602 28.3388 29.5104 28.3388 28.9246 28.9246ZM14.0754 28.9246C13.4896 28.3388 12.5399 28.3388 11.9541 28.9246C11.3683 29.5104 11.3683 30.4602 11.9541 31.0459C12.5399 31.6317 13.4896 31.6317 14.0754 31.0459C14.6612 30.4602 14.6612 29.5104 14.0754 28.9246ZM8.5 23C7.67157 23 7 22.3285 7 21.5C7 20.6716 7.67157 20 8.5 20H9.5C10.3284 20 11 20.6716 11 21.5C11 22.3285 10.3284 23 9.5 23H8.5ZM32 21.5C32 22.3284 32.6716 23 33.5 23H34.5C35.3284 23 36 22.3284 36 21.5C36 20.6716 35.3284 20 34.5 20H33.5C32.6716 20 32 20.6716 32 21.5ZM21.5 32C20.6716 32 20 32.6716 20 33.5V34.5C20 35.3284 20.6716 36 21.5 36C22.3284 36 23 35.3284 23 34.5V33.5C23 32.6716 22.3284 32 21.5 32Z\" fill=\"#D5CEEA\"/>"
        +"</svg>"
        
        let styleToChange = { bg : '#161827', btnBg : '#1C1F30', headerColor : '#FFFFFF', formText : '#FFFFFF', btnColor : "#24008C", btnBorder : "#6116FF" }  

        switchProperties( styleToChange )
}


function lightMode(){
    darkModeBtn.innerHTML = 
        "<svg width=\"19\" height=\"20\" viewBox=\"0 0 19 20\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">"
        +"<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M18.299 15.581C17.4142 15.8534 16.4742 16 15.5 16C10.2533 16 6 11.7467 6 6.50002C6 4.043 6.93276 1.80383 8.4635 0.117311C3.67009 0.85649 0 4.99965 0 10C0 15.5228 4.47715 20 10 20C13.4562 20 16.5028 18.2467 18.299 15.581Z\" fill=\"#A7A3C2\"/>"
        +"</svg>"

    let styleToChange = { bg : '#FFFFFF', btnBg : '#F8F5FF', headerColor : '#000000', formText : '#000000', btnColor : "#6116FF", btnBorder : "#24008C" }

    switchProperties( styleToChange )
}

function switchProperties(properties){
    for ( let el in properties ){
        root.style.setProperty( "--"+el, properties[el] );
    }
}


// =============================================

let videoThumbnail = null
let channelThumbnailBase64 = null
const preview = document.querySelector('.preview-channel-thumbnail');
const previewVideo = document.querySelector('.preview-video-thumbnail');

initInputs();

// Init value from chrome store
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

randomButton.addEventListener('change', (e) => {
    const isChecked = e.target.checked
    if (isChecked) {
        e.target.parentNode.parentNode.classList.add('active')
    }else {
        e.target.parentNode.parentNode.classList.remove('active')
    }
})

findCardBtn.addEventListener("click", async () => {
    await launchScript(randomButton.checked)
})

shuffleBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    await launchScript(true)
})

async function launchScript(shuffle = false) {
    let [tab] = await chrome.tabs.query({active: true, currentWindow: true})
    // If the user is on another site than YT
    if (tab === undefined || tab.url !== 'https://www.youtube.com/') {
        chrome.storage.local.set({ errorMessage: "You need to be on the Youtube homepage !" })
        return
    }

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

    // everything went smooth so we can close the popup to let the user enjoy
    window.close();
    chrome.storage.local.remove(['errorMessage']);
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


// =============================================
// ANIMATED EYES

//First, we find the eyes position and their center :
let eyeCoord = headerEye.getBoundingClientRect();
let centerOfEyeX = Math.round(( ( eyeCoord.right - eyeCoord.left ) / 2 ) + eyeCoord.left);
let centerOfEyeY = Math.round(( ( eyeCoord.bottom - eyeCoord.top ) / 2 ) + eyeCoord.top);


//on mousemove, we locate the mouse position and compare its X & Y coordinates to eyes' center.
// let=eyeDirection indicate the eyes direction in a "North, South, South East etc..." mode

document.addEventListener('mousemove', (e) =>{
    let mouseX = e.clientX;
    let mouseY = e.clientY;
    let eyeDirection;

     
    eyeDirection = mouseY < centerOfEyeY ? "N" : "S";
    eyeDirection += mouseX < centerOfEyeX ? "W" : "E";
     
    if ( approx ( mouseX, centerOfEyeX ) ){
        eyeDirection =  mouseY > centerOfEyeY ? "S" : "N";
    }
       
    if (  approx ( mouseY, centerOfEyeY ) ){
        eyeDirection = mouseX > centerOfEyeX ? "E" : "W";
    }

    if (  approx ( mouseY, centerOfEyeY ) && approx ( mouseX, centerOfEyeX )){
        eyeDirection = "C";
    }

    // due "North", "South" etc ... are calculate on an approximative direction ( eyes' center +/- 10 px )
    function approx(nbToCompare, nbToApprox){
        return (  nbToApprox-10 < nbToCompare && nbToCompare < nbToApprox + 10)
    }

    function wichDirection(dir){
        let direction = {
            "N" : "(2px, -5px)",
            "NE" : "(4px, -4px)",
            "E" : "(5px, 0px)",
            "SE" : "(4px, 4px)",
            "S" : "(2px, 5px)",
            "SW" : "(0px, 4px)",
            "W" : "(0px, 0px)",
            "NW" : "(0px, -4px)",
            "C" : "(2px, 0px)",
        }

        return direction[dir];
    }

    function setPupilsDirection(dir){
     for (let pupils of eyesPupils){
         pupils.style.setProperty('transform', 'translate'+(dir));
         
        }
    }

    setPupilsDirection(wichDirection(eyeDirection));
})

// Handle chrome storage change
chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (var key in changes) {
        if (key === 'errorMessage') {
            const storageChange = changes[key]
            errorMessageSpan.textContent = storageChange.newValue
            errorMessageSpan.style.display = "block"
        }
    }
});