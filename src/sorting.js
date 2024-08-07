import { increment, isTrump, betterThan } from "./gameLogic";

export function shuffle(deck) {
    let currentIndex = deck.length;
    let randomIndex;

    while (currentIndex > 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [deck[currentIndex], deck[randomIndex]] = [deck[randomIndex], deck[currentIndex]];
    }

    return deck;
}

export function deal(deck, dealer) {

    var playerHands = [[],[],[],[]];
    var turn = increment(dealer);
    var dealThree = true;

    while (playerHands[dealer - 1].length < 5) {
        
        for(let i = 0; i < 2; i++) {
            playerHands[turn - 1].push(deck.pop());
        }
        if (dealThree) {
            playerHands[turn - 1].push(deck.pop());
        }

        dealThree = turn === dealer ? false : !dealThree;
        turn = increment(turn);
    }

    return playerHands;
}

export function removeCard(hand, card) {

    var indexToRemove = -1;
    for (let i = 0; i < hand.length; i++) {
        if (hand[i].toString() === card) {
            indexToRemove = i;
        }
    }
    if (indexToRemove !== -1) {
        hand.splice(indexToRemove, 1);
    }
    return hand;
}

export function sortHand(hand, trump) {
    
    var clubs = [];
    var diamonds = [];
    var hearts = [];
    var spades = [];

    for (let i = 0; i < hand.length; i++) {
        if (isTrump(hand[i].toString(), trump)) {
            if (trump === 'c') {
                clubs.push(hand[i]);
            }
            else if (trump === 'd') {
                diamonds.push(hand[i]);
            }
            else if (trump === 'h') {
                hearts.push(hand[i]);
            }
            else if (trump === 's') {
                spades.push(hand[i]);
            }
        }
        else {
            if (hand[i].toString().charAt(0) === 'c') {
                clubs.push(hand[i]);
            }
            else if (hand[i].toString().charAt(0) === 'd') {
                diamonds.push(hand[i]);
            }
            else if (hand[i].toString().charAt(0) === 'h') {
                hearts.push(hand[i]);
            }
            else if (hand[i].toString().charAt(0) === 's') {
                spades.push(hand[i]);
            }
        }
    }
    clubs = rankSuit(clubs, trump);
    diamonds = rankSuit(diamonds, trump);
    hearts = rankSuit(hearts, trump);
    spades = rankSuit(spades, trump);

    var sortedHand = []
    if (trump !== 'c') {
        sortedHand.concat(clubs);
    }
    if (trump !== 'd') {
        sortedHand.concat(diamonds);
    }
    if (trump !== 'h') {
        sortedHand.concat(hearts);   
    }
    if (trump !== 's') {
        sortedHand.concat(spades);
    }
    if (trump === 'c') {
        sortedHand.concat(clubs);
    }
    else if (trump === 'd') {
        sortedHand.concat(diamonds);
    }
    else if (trump === 'h') {
        sortedHand.concat(hearts);
    }
    else if (trump === 's') {
        sortedHand.concat(spades);
    }
    console.log(sortedHand);
    return sortedHand;
}

function rankSuit(cards, trump) {
    if (cards.length < 2) {
        return cards;
    }
    for (let i = 1; i < cards.length; i++) {
        let currentCard = cards[i];
        let j;
        for (j = i - 1; j >= 0 && betterThan(currentCard.toString(), cards[j].toString(), cards[0].toString().charAt(0), trump); j--) {
            cards[j + 1] = cards[j];
        }
        cards[j + 1] = currentCard;
    }
    return cards;
}

