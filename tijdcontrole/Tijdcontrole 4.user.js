// ==UserScript==
// @name         Tijdcontrole 4
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Controleer de leeftijd van meldingen en toon een rode bol voor niet-geplande meldingen en controleer op aantal credits.
// @author       Michel
// @match        https://www.meldkamerspel.com/missions/*
// @updateURL    https://github.com/MichelKulk/Scripts/raw/main/tijdcontrole/Tijdcontrole%204.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    console.clear();
    console.log("Tijdcontrole-script geladen");

    // Functie om het aantal credits te controleren
    function checkCredits() {
        const creditsElement = document.getElementById('CreditsMissionheader');
        if (creditsElement) {
            const creditsText = creditsElement.textContent;
            const credits = parseInt(creditsText.replace(/[^0-9]/g, ''));
            console.log("Aantal credits:", credits);
            return credits >= 5000;
        }
        return false;
    }

    // Functie om de datum te formatteren
    function formatDate(date) {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return date.toLocaleDateString(undefined, options);
    }

    // Functie om de tijd te formatteren
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
    } else {
        console.log("Geen berichten gevonden, waarschuwingsbubbel wordt niet getoond.");
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

// Definieer containerDiv op een hoger niveau in de scope
var containerDiv;

function showWarningBubble(oldestMessageTime) {
    if (!oldestMessageTime) {
        console.error('oldestMessageTime is niet gedefinieerd voor showWarningBubble');
        return;
    }
    var closingTime = new Date(oldestMessageTime.getTime() + 2 * 60 * 60 * 1000); // Sluittijd is 2 uur na de openingstijd

    console.log("Showing warning bubble for message shared at:", formatDate(oldestMessageTime), formatTime(oldestMessageTime));

    // Laad eerder opgeslagen positie indien beschikbaar
    var savedLeft = localStorage.getItem('popupLeft');
    var savedTop = localStorage.getItem('popupTop');

    // Maak de containerDiv en pas de opgeslagen of standaard positie toe
    containerDiv = document.createElement('div');
    containerDiv.style.position = 'fixed';
    containerDiv.style.left = savedLeft || '54%';
    containerDiv.style.top = savedTop || '7.5%';
    containerDiv.style.transform = 'translate(-50%, -50%)';
    containerDiv.style.display = 'flex';
    containerDiv.style.alignItems = 'center';
    containerDiv.style.zIndex = '1000';
    containerDiv.style.minWidth = "600px";
    containerDiv.onmousedown = dragMouseDown;


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
        var currentTime = new Date();
        labelText.style.backgroundColor = 'white';
        labelText.style.color = 'black';
        labelText.style.textAlign = 'center';
        labelText.style.marginTop = '1%';
        labelText.style.padding = '5px';
        labelText.style.border = '1px solid red';
        labelText.style.fontSize = '16px';
        labelText.innerHTML = 'GEEN sluitvoertuig sturen!<br>\nHuidige tijd: ' + formatTime(currentTime) + ' - \nGeopend: ' + formatTime(oldestMessageTime) + ' - <b> Sluiten vanaf: ' + formatTime(closingTime) + '</b>';

        bubbleDiv.appendChild(warningText);
        containerDiv.appendChild(bubbleDiv);
        containerDiv.appendChild(labelText);

    document.body.appendChild(containerDiv);

    }


let dragOffsetX, dragOffsetY;

function dragMouseDown(e) {
    e = e || window.event;
    if (e.button === 0) { // Controleer of de linkermuisknop wordt gebruikt
        e.preventDefault();
        console.log("Mousedown event gestart"); // Log wanneer mousedown event start
        // Sla de beginpositie van de muis op
        dragOffsetX = e.clientX;
        dragOffsetY = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }
}


function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    console.log("Element wordt gesleept"); // Log tijdens het slepen

    // Bereken de nieuwe positie van de cursor
    let posX = dragOffsetX - e.clientX;
    let posY = dragOffsetY - e.clientY;
    dragOffsetX = e.clientX;
    dragOffsetY = e.clientY;

    if (typeof containerDiv === 'undefined') {
        console.error('containerDiv is niet gedefinieerd');
        return; // Dit moet binnen de if-statement blijven
    }

    // Zet het element op de nieuwe positie
    containerDiv.style.top = (containerDiv.offsetTop - posY) + "px";
    containerDiv.style.left = (containerDiv.offsetLeft - posX) + "px";
}

function closeDragElement() {
    console.log("Muis losgelaten, stoppen met slepen");
    document.onmouseup = null;
    document.onmousemove = null;

    // Zorg ervoor dat we de containerDiv hebben voordat we verder gaan.
    if (typeof containerDiv === 'undefined') {
        console.error('containerDiv is niet gedefinieerd');
        return;
    }

    // Opslaan van de positie in localStorage
    localStorage.setItem('popupLeft', containerDiv.style.left);
    localStorage.setItem('popupTop', containerDiv.style.top);
}
    // De rest van uw bestaande functies

    // Hoofdfunctie die alles initieert
function init() {
    // Controleren of er opgeslagen waarden zijn voor de positie van de popup
    var savedLeft = localStorage.getItem('popupLeft');
    var savedTop = localStorage.getItem('popupTop');

    // Als er opgeslagen waarden zijn, gebruik deze om de popup positie in te stellen
    if (savedLeft && savedTop) {
        showWarningBubble(); // Je kunt hier de juiste parameter doorgeven indien nodig
    }

    // Voer je standaard controle voor credits en oudste berichttijd uit
    if (checkCredits()) {
        checkOldestMessageTime();
    }
}


    setTimeout(init, 500); // Wacht 500 milliseconden voordat de functie wordt uitgevoerd
})();
