document.addEventListener('DOMContentLoaded', () => {
    let timerInterval;
    let startTime;

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

    const numCards = document.querySelectorAll('.memory-kaart').length;
    const numPairs = numCards / 2;
    const randomLetters = generateRandomLetters(numPairs);

    fillCardsWithLetters(randomLetters);

    // Start de timer wanneer op de "Start Spel!" knop wordt geklikt
    document.querySelector('#start-game').addEventListener('click', startTimer);
});