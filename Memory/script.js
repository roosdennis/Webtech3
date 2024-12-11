document.addEventListener('DOMContentLoaded', () => {
    
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
});