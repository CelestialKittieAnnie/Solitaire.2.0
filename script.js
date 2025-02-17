document.addEventListener('DOMContentLoaded', () => {
    const deckElement = document.getElementById('deck');
    const wasteElement = document.getElementById('waste');
    const tableauElement = document.getElementById('tableau');
    const foundationElements = document.querySelectorAll('.foundation-container .foundation');

    const suits = ['pink', 'blue', 'green', 'yellow'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

    let deck = [];
    let waste = [];

    suits.forEach(suit => {
        values.forEach(value => {
            deck.push({ suit, value });
        });
    });

    shuffle(deck);
    dealCards();

    function createCardElement(card) {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card', card.suit);
        cardElement.textContent = card.value;
        cardElement.draggable = true;

        cardElement.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', JSON.stringify(card));
            setTimeout(() => {
                cardElement.classList.add('hidden');
            }, 0);
        });

        cardElement.addEventListener('dragend', (e) => {
            cardElement.classList.remove('hidden');
        });

        cardElement.addEventListener('touchstart', (e) => {
            e.target.classList.add('dragging');
        });

        cardElement.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            cardElement.style.left = `${touch.pageX - cardElement.offsetWidth / 2}px`;
            cardElement.style.top = `${touch.pageY - cardElement.offsetHeight / 2}px`;
        });

        cardElement.addEventListener('touchend', (e) => {
            cardElement.classList.remove('dragging');
            cardElement.style.left = '';
            cardElement.style.top = '';
        });

        return cardElement;
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function dealCards() {
        const columns = tableauElement.querySelectorAll('.column');
        columns.forEach((column, index) => {
            for (let i = 0; i <= index; i++) {
                const card = deck.pop();
                const cardElement = createCardElement(card);
                cardElement.style.top = `${i * 30}px`;
                column.appendChild(cardElement);
            }
        });

        deck.forEach(card => {
            const cardElement = createCardElement(card);
            deckElement.appendChild(cardElement);
        });

        deckElement.addEventListener('click', () => {
            if (deck.length > 0) {
                const card = deck.pop();
                waste.push(card);
                const cardElement = createCardElement(card);
                wasteElement.appendChild(cardElement);
            }
        });
    }

    foundationElements.forEach(foundation => {
        foundation.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        foundation.addEventListener('drop', (e) => {
            const cardData = e.dataTransfer.getData('text/plain');
            const card = JSON.parse(cardData);
            const cardElement = createCardElement(card);
            if (isValidFoundationMove(card, foundation)) {
                foundation.appendChild(cardElement);
                checkWinCondition();
            }
        });
    });

    tableauElement.querySelectorAll('.column').forEach(column => {
        column.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        column.addEventListener('drop', (e) => {
            const cardData = e.dataTransfer.getData('text/plain');
            const card = JSON.parse(cardData);
            const cardElement = createCardElement(card);
            if (isValidTableauMove(card, column)) {
                column.appendChild(cardElement);
            }
        });
    });

    function isValidFoundationMove(card, foundation) {
        const foundationCards = foundation.querySelectorAll('.card');
        if (foundationCards.length === 0) {
            return card.value === 'A';
        }
        const topCard = foundationCards[foundationCards.length - 1];
        return card.suit === topCard.classList[1] && isNextValue(card.value, topCard.textContent);
    }

    function isValidTableauMove(card, column) {
        const columnCards = column.querySelectorAll('.card');
        if (columnCards.length === 0) {
            return card.value === 'K';
        }
        const topCard = columnCards[columnCards.length - 1];
        return card.suit !== topCard.classList[1] && isNextValue(topCard.textContent, card.value);
    }

    function isNextValue(cardValue, topCardValue) {
        const cardIndex = values.indexOf(cardValue);
        const topCardIndex = values.indexOf(topCardValue);
        return cardIndex === topCardIndex + 1;
    }

    function checkWinCondition() {
        const foundationCardsCount = Array.from(foundationElements).reduce((acc, foundation) => {
            return acc + foundation.querySelectorAll('.card').length;
        }, 0);
        if (foundationCardsCount === 52) {
            alert('You win!');
        }
    }
});