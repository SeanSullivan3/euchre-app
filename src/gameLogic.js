export class Card {
    constructor(string) {
        this.suit = string.charAt(0);
        this.rank = parseInt(string.substring(1));
    }

    toString() {
        return this.suit + this.rank.toString();
    }
}

const suitsNames = ['clubs', 'diamonds', 'hearts', 'spades'];
const suits = ['c', 'd', 'h', 's'];
const ranks = [9, 10, 11, 12, 13, 14];


export function getDeck() {
    var deck = [];
    for (let suit of suits) for (let rank of ranks) deck.push(new Card(suit + rank.toString()));
    return deck;
}

export function getTrickWinner(roundHistory, trump, turn) {

    var trick = roundHistory.splice(roundHistory.length - 4, 4);
    var leadSuit = trick[0].charAt(0);
    var winningIndex = 0;

    for (let i = 1; i < 4; i++) {
        if (betterThan(trick[winningIndex], trick[i], leadSuit, trump)) {
            winningIndex = i;
        }
    }
    for (let i = 0; i < winningIndex + 1; i++) {
        turn = increment(turn);
    }
    return turn;
}

export function getValidCalls(callCard) {

    var suitsNamesTemp = suitsNames;
    suitsNamesTemp.splice(suits.indexOf(callCard.charAt(0)), 1);
    return suitsNamesTemp;
}

export function isValidPlay(card, hand, trump, roundHistory) {
    var cardsPlayed = roundHistory.length % 4;
    if (cardsPlayed === 0) {
        return true;
    }
    var trick = roundHistory.splice(roundHistory.length - cardsPlayed, cardsPlayed);
    var leadSuit = isTrump(trick[0], trump) ? trump : trick[0].charAt(0);
    var hasLeadSuit = false;
    for (let i  = 0; i < hand.length; i++) {
        if (hand[i].toString() === getLeft(trump)) {
            hasLeadSuit = leadSuit === trump;
        }
        else if (leadSuit === hand[i].toString().charAt(0)) {
            hasLeadSuit = true;
            break;
        }
    }
    if (hasLeadSuit) {
        console.log('Has lead suit');
        if (card === getLeft(trump)) {
            return leadSuit === trump;
        }
        return card.charAt(0) === leadSuit;
    }
    console.log('Doesnt have lead suit');
    return true;
}

export function increment(prev) {
    return (prev + 1 > 4) ? 1 : prev + 1;
}

export function getSuit(card) {
    return suitsNames[suits.indexOf(card.charAt(0))];
}

export function getPartner(player) {

    if (player === 0) {
        return 0;
    }
    return increment(increment(player));
}

function getLeft(trump) {

    if (trump === 'c') {
        return 's11';
    }
    else if (trump === 'd') {
        return 'h11';
    }
    else if (trump === 'h') {
        return 'd11';
    }
    else if (trump === 's') {
        return 'c11';
    }
}

export function isTrump(card, trump) {

    return card.charAt(0) === trump || card === getLeft(trump);
    
}

export function betterThan(card1, card2, leadSuit, trump) {

    var card1IsTrump = isTrump(card1, trump);
    var card2IsTrump = isTrump(card2, trump);
    
    if (card1IsTrump !== card2IsTrump) {
        if (card1IsTrump) {
            return false;
        }
        else {
            return true;
        }
    }
    if (card1IsTrump || card2IsTrump) {
        var rank1 = parseInt(card1.substring(1,3));
        var rank2 = parseInt(card2.substring(1,3));
        if ((rank1 === 11) !== (rank2 === 11)) {
            if (rank1 === 11) {
                return false;
            }
            else {
                return true;
            }
        }
        if (rank1 === 11 || rank2 === 11) {
            return card2.charAt(0) === trump;
        }
        return rank1 < rank2;
    }

    var card1IsLeadSuit = card1.charAt(0) === leadSuit;
    var card2IsLeadSuit = card2.charAt(0) === leadSuit;

    if (card1IsLeadSuit !== card2IsLeadSuit) {
        if (card1IsLeadSuit) {
            return false;
        }
        else {
            return true;
        }
    }
    if (card1IsLeadSuit || card2IsLeadSuit) {
        return parseInt(card1.substring(1,3)) < parseInt(card2.substring(1,3));
    }

    return false;
}