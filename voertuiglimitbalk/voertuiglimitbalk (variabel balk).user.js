// ==UserScript==
// @name         voertuiglimitbalk (variabel balk)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  try to take over the world!
// @author       Michel
// @match        https://www.meldkamerspel.com/missions/*
// @updateURL    	https://github.com/MichelKulk/Scripts/raw/main/voertuiglimitbalk/voertuiglimitbalk%20(variabel%20balk).user.js
// @downloadURL  	https://github.com/MichelKulk/Scripts/raw/main/voertuiglimitbalk/voertuiglimitbalk%20(variabel%20balk).user.js
// @grant        none
// ==/UserScript==
 
(function() {

// vul hier de aantal keer in dat de balk automatisch ingedrukt moet worden.

    const numberOfTimes = 1; 

// hieronder niks meer aanpassen!

    let clickCount = 0; 
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && (mutation.attributeName === 'class' || mutation.attributeName === 'style')) {
                const button = document.querySelector('a.missing_vehicles_load');
                if (button && button.classList.contains('btn-warning') && button.style.display !== 'none') {
                    clickMissingVehiclesLoad();
                }
            }
        });
    });

    function clickMissingVehiclesLoad() {
        const button = document.querySelector('a.missing_vehicles_load');
        if (button && !button.disabled && clickCount < numberOfTimes) {
            button.click();
            clickCount++;
        }
    }

    // Begin met observeren
    const config = { attributes: true, attributeFilter: ['class', 'style'], childList: false, subtree: false };
    const targetNode = document.querySelector('a.missing_vehicles_load');
    if (targetNode) {
        observer.observe(targetNode, config);
        clickMissingVehiclesLoad(); // Voer de functie de eerste keer uit
    }
})();
