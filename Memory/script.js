// Script voor het beheren van het Memory spel

document.addEventListener('DOMContentLoaded', () => {
    let timerInterval;
    let startTime;
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;

    // =================== Timer Functies ===================
    // Functie om de timer te starten
    function startTimer() {
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 1000);
    }

    // Functie om de timer bij te werken
    function updateTimer() {
        const elapsedTime = Date.now() - startTime;
        const seconds = Math.floor((elapsedTime / 1000) % 60);
        const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
        document.querySelector('.spel-info p:nth-child(1)').textContent = `Verlopen tijd: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    // Functie om de timer te stoppen
    function stopTimer() {
        clearInterval(timerInterval);
    }

    // =================== Kaartbeheer ===================
    // Open een kaart en toon de afbeelding
    function openCard(card) {
        if (card.classList.contains('gesloten')) {
            card.classList.remove('gesloten');
            card.classList.add('open');
            const img = card.querySelector('img');
            if (img) {
                img.style.display = 'block';
            }
        }
    }

    // Sluit kaarten terug na een mismatch
    function flipBackCards() {
        if (firstCard) {
            firstCard.classList.remove('open');
            firstCard.classList.add('gesloten');
            const img1 = firstCard.querySelector('img');
            if (img1) img1.style.display = 'none';
        }

        if (secondCard) {
            secondCard.classList.remove('open');
            secondCard.classList.add('gesloten');
            const img2 = secondCard.querySelector('img');
            if (img2) img2.style.display = 'none';
        }

        resetBoard();
    }

    // Controleer of twee kaarten overeenkomen
    function checkForMatch() {
        if (firstCard && secondCard) {
            if (firstCard.querySelector('img').src === secondCard.querySelector('img').src) {
                firstCard.classList.add('gevonden');
                secondCard.classList.add('gevonden');
                resetBoard();
                checkIfGameIsOver();
            } else {
                lockBoard = true;
                setTimeout(() => {
                    flipBackCards();
                }, 1000);
            }
        }
    }

    // Reset de bordstatus
    function resetBoard() {
        [firstCard, secondCard, lockBoard] = [null, null, false];
    }

    // =================== Hulpfuncties ===================
    // Haal afbeeldingen op van de geselecteerde API
    async function fetchImages(apiType, numPairs) {
        let images = [];
        try {
            if (apiType === 'picsum') {
                for (let i = 0; i < numPairs; i++) {
                    images.push(`https://picsum.photos/seed/${i}/100`);
                }
            } else if (apiType === 'dog') {
                const response = await fetch(`https://dog.ceo/api/breeds/image/random/${numPairs}`);
                if (!response.ok) throw new Error('Dog API request failed');
                const data = await response.json();
                images = data.message;
            } else if (apiType === 'cat') {
                for (let i = 0; i < numPairs; i++) {
                    images.push(`https://cataas.com/cat?${i}`);
                }
            }
            return [...images, ...images].sort(() => Math.random() - 0.5);
        } catch (error) {
            console.error('Error fetching images:', error);
            alert('Er ging iets mis bij het ophalen van de afbeeldingen. Controleer de API.');
            return [];
        }
    }

    // Vul kaarten met afbeeldingen
    function fillCardsWithImages(images) {
        const cards = document.querySelectorAll('.memory-kaart');
        cards.forEach((card, index) => {
            const img = document.createElement('img');
            img.src = images[index];
            img.alt = "Memory afbeelding";
            img.style.display = 'none';
            card.innerHTML = '';
            card.appendChild(img);
        });
    }

    // Maak kaarten klikbaar
    function makeCardsClickable() {
        document.querySelectorAll('.memory-kaart').forEach(card => {
            card.classList.remove('disabled');
        });
    }

    // =================== Eindspel Logica ===================
    // Controleer of het spel is afgelopen
    function checkIfGameIsOver() {
        const allCards = document.querySelectorAll('.memory-kaart');
        const allFound = Array.from(allCards).every(card => card.classList.contains('gevonden'));

        if (allFound) {
            stopTimer();
            const elapsedTime = getElapsedTime();
            setTimeout(() => {
                alert(`Gefeliciteerd! Je hebt het spel voltooid in ${elapsedTime} seconden.`);
            }, 500);
        }
    }

    // =================== Event Listeners ===================
    // Start het spel en initialiseer het bord
    document.querySelector('#start-game').addEventListener('click', async () => {
        const activeOption = document.querySelector('.dropdown-content a.active');
        const selectedApi = activeOption ? activeOption.getAttribute('data-value') : 'picsum';
        const numCards = document.querySelectorAll('.memory-kaart').length;
        const numPairs = numCards / 2;

        const images = await fetchImages(selectedApi, numPairs);
        fillCardsWithImages(images);

        const selectedColor = document.querySelector('#card-color').value;
        document.querySelectorAll('.memory-kaart.gesloten').forEach(card => {
            card.style.backgroundColor = selectedColor;
        });

        stopTimer();
        startTimer();
        makeCardsClickable();
    });

    // Verander de kleur van gesloten kaarten
    document.querySelector('#card-color').addEventListener('input', (event) => {
        const selectedColor = event.target.value;
        document.querySelectorAll('.memory-kaart.gesloten').forEach(card => {
            card.style.backgroundColor = selectedColor;
        });
    });

    // Registreer klikacties op dropdownopties
    document.querySelectorAll('.dropdown-content a').forEach(option => {
        option.addEventListener('click', (event) => {
            event.preventDefault();
            document.querySelectorAll('.dropdown-content a').forEach(link => link.classList.remove('active'));
            event.target.classList.add('active');
        });
    });

    // Behandel klikken op kaarten
    document.querySelectorAll('.memory-kaart').forEach(card => {
        card.classList.add('disabled');
        card.addEventListener('click', () => {
            if (lockBoard) return;
            if (card === firstCard) return;

            openCard(card);

            if (!firstCard) {
                firstCard = card;
                return;
            }

            secondCard = card;
            checkForMatch();
        });
    });
});
