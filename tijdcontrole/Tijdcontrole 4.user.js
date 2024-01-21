// ==UserScript==
// @name         Tijdcontrole 4
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Controleer de leeftijd van meldingen en toon een rode bol voor niet-geplande meldingen.
// @author       Michel
// @match        https://www.meldkamerspel.com/missions/*
// @updateURL    https://github.com/MichelKulk/Scripts/raw/main/tijdcontrole/Tijdcontrole%204.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
console.clear()
    console.log("Tijdcontrole-script geladen");

    function formatDate(date) {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return date.toLocaleDateString(undefined, options);
    }

    function formatTime(date) {
        const options = { hour: '2-digit', minute: '2-digit' };
        return date.toLocaleTimeString(undefined, options);
    }

function checkOldestMessageTime() {
    console.log("Checking oldest message time...");

    var messageTimeElements = document.querySelectorAll('#mission_replies li');
    console.log("Aantal gevonden elementen:", messageTimeElements.length);

    if (messageTimeElements.length > 0) {
        var sortedMessageTimes = Array.from(messageTimeElements).sort(function(a, b) {
            var timeA = new Date(a.getAttribute('data-message-time'));
            var timeB = new Date(b.getAttribute('data-message-time'));
            return timeA - timeB;
        });

        var oldestMessageTime = new Date(sortedMessageTimes[0].getAttribute('data-message-time'));
        var currentTime = new Date();
        var timeDifference = (currentTime - oldestMessageTime) / (1000 * 60 * 60);

        console.log("Oldest message time:", formatDate(oldestMessageTime), formatTime(oldestMessageTime));
        console.log("Current time:", formatDate(currentTime), formatTime(currentTime));
        console.log("Time difference (hours):", timeDifference);

        if (timeDifference < 2.0 && !isPlannedMission()) {
            showWarningBubble(oldestMessageTime);
        }
    }
}



function isPlannedMission() {
    // Controleer of er een countdown element op de pagina is
    var countdownElement = document.querySelector('[id^="mission_countdown_"]');
    if (countdownElement) {
        console.log("This is a planned mission with a countdown.");
        return true;
    }

    console.log("This is not a planned mission.");
    return false;
}



    function showWarningBubble(oldestMessageTime) {
        // Voeg console.log-bericht toe voor de waarschuwingsbubbel
        console.log("Showing warning bubble for message shared at:", formatDate(oldestMessageTime), formatTime(oldestMessageTime));
    var containerDiv = document.createElement('div');
    containerDiv.style.position = 'fixed';
    containerDiv.style.top = '7.5%';
    containerDiv.style.left = '54%';
    containerDiv.style.transform = 'translate(-50%, -50%)';
    containerDiv.style.display = 'flex';
    containerDiv.style.alignItems = 'center';
    containerDiv.style.zIndex = '1000'; // Hoog z-index waarde om ervoor te zorgen dat het bovenop komt


        var bubbleDiv = document.createElement('div');
        bubbleDiv.style.background = 'red';
        bubbleDiv.style.borderRadius = '50%';
        bubbleDiv.style.width = '50px';
        bubbleDiv.style.height = '50px';

        var warningText = document.createElement('p');
        warningText.style.color = 'white';
        warningText.style.textAlign = 'center';
        warningText.style.marginTop = '1%';
        warningText.style.fontSize = '40px';
        warningText.style.fontWeight = 'bold';
        warningText.innerText = '!';

        var labelText = document.createElement('div');
        labelText.style.backgroundColor = 'white';
        labelText.style.color = 'black';
        labelText.style.textAlign = 'center';
        labelText.style.marginTop = '1%';
        labelText.style.padding = '5px';
        labelText.style.border = '1px solid red';
        labelText.style.fontSize = '12px';
        labelText.innerText = 'GEEN sluitvoertuig sturen!';

        bubbleDiv.appendChild(warningText);
        containerDiv.appendChild(bubbleDiv);
        containerDiv.appendChild(labelText);
        document.body.appendChild(containerDiv);
    }

    setTimeout(function() {
        checkOldestMessageTime();
    }, 500); // Wacht 500 milliseconden voordat de functie wordt uitgevoerd

})();
