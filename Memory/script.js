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

    function stopTimer() {
        clearInterval(timerInterval);
    }

    function getElapsedTime() {
        const elapsedTime = Date.now() - startTime;
        return Math.floor(elapsedTime / 1000);
    }

    function generateRandomLetters(numPairs) {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let letters = [];

        while (letters.length < numPairs) {
            const randomIndex = Math.floor(Math.random() * alphabet.length);
            const letter = alphabet[randomIndex];
            if (!letters.includes(letter)) {
                letters.push(letter);
            }
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
            checkIfGameIsOver();
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

    function makeCardsClickable() {
        document.querySelectorAll('.memory-kaart').forEach(card => {
            card.classList.remove('disabled');
        });
    }

    function checkIfGameIsOver() {
        const allCards = document.querySelectorAll('.memory-kaart');
        const allFound = Array.from(allCards).every(card => card.classList.contains('gevonden'));

        if (allFound) {
            stopTimer();
            const elapsedTime = getElapsedTime();
            document.querySelector('.memory-speelbord').classList.add('bounce');
            setTimeout(() => {
                alert(`Gefeliciteerd! Je hebt het spel voltooid in ${elapsedTime} seconden.`);
                updateTopVijf(elapsedTime);
                applyRandomBounceAnimation();
            }, 2000);
        }
    }

    function applyRandomBounceAnimation() {
        const cards = document.querySelectorAll('.memory-kaart');
        const animations = ['bounce-vertical', 'bounce-horizontal', 'bounce-diagonal'];
        cards.forEach(card => {
            const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
            card.classList.add(randomAnimation);
        });
    }

    function updateTopVijf(elapsedTime) {
        const topVijfList = document.querySelector('.topvijf ul');
        const newScoreItem = document.createElement('li');
        newScoreItem.textContent = `Jij: ${elapsedTime} seconden`;
        topVijfList.appendChild(newScoreItem);
    }

    const numCards = document.querySelectorAll('.memory-kaart').length;
    const numPairs = numCards / 2;
    const randomLetters = generateRandomLetters(numPairs);

    fillCardsWithLetters(randomLetters);

    document.querySelector('#start-game').addEventListener('click', () => {
        startTimer();
        makeCardsClickable();
    });

    document.querySelectorAll('.memory-kaart').forEach(card => {
        card.classList.add('disabled');
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