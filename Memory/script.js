document.addEventListener('DOMContentLoaded', () => {
    let timerInterval;
    let startTime;
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;

    function startTimer() {
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 1000);
    }

    function updateTimer() {
        const elapsedTime = Date.now() - startTime;
        const seconds = Math.floor((elapsedTime / 1000) % 60);
        const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
        document.querySelector('.spel-info p:nth-child(1)').textContent = `Verlopen tijd: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    function generateRandomLetters(numPairs) {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let letters = [];

        for (let i = 0; i < numPairs; i++) {
            const randomIndex = Math.floor(Math.random() * alphabet.length);
            letters.push(alphabet[randomIndex]);
        }

        letters = letters.concat(letters);
        letters.sort(() => Math.random() - 0.5);

        return letters;
    }

    function fillCardsWithLetters(letters) {
        const cards = document.querySelectorAll('.memory-kaart');
        cards.forEach((card, index) => {
            card.textContent = letters[index];
        });
    }

    function openCard(card) {
        if (card.classList.contains('gesloten')) {
            card.classList.remove('gesloten');
            card.classList.add('open');
        }
    }

    function checkForMatch() {
        if (firstCard.textContent === secondCard.textContent) {
            firstCard.classList.add('gevonden');
            secondCard.classList.add('gevonden');
            resetBoard();
        } else {
            lockBoard = true;
        }
    }

    function flipBackCards() {
        firstCard.classList.remove('open');
        firstCard.classList.add('gesloten');
        secondCard.classList.remove('open');
        secondCard.classList.add('gesloten');
        resetBoard();
    }

    function resetBoard() {
        [firstCard, secondCard, lockBoard] = [null, null, false];
    }

    const numCards = document.querySelectorAll('.memory-kaart').length;
    const numPairs = numCards / 2;
    const randomLetters = generateRandomLetters(numPairs);

    fillCardsWithLetters(randomLetters);

    // Start de timer wanneer op de "Start Spel!" knop wordt geklikt
    document.querySelector('#start-game').addEventListener('click', startTimer);

    // Voeg een event listener toe aan elke kaart
    document.querySelectorAll('.memory-kaart').forEach(card => {
        card.addEventListener('click', () => {
            if (lockBoard) {
                flipBackCards();
                return;
            }
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