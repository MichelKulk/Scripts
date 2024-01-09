// ==UserScript==
// @name         voertuiglimitbalk (variabel balk)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       Michel
// @match        https://www.meldkamerspel.com/missions/*
// @updateURL    https://raw.githubusercontent.com/MichelKulk/Scripts/main/voertuiglimitbalk/voertuiglimitbalk%20(variabel%20balk).user.js
// @grant        none
// ==/UserScript==

(function() {
    const numberOfTimes = 3; // Het aantal keer dat de functie moet worden aangeroepen
    let clickCount = 0; // Houdt bij hoe vaak er geklikt is

// hieronder niks meer aanpassen
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
