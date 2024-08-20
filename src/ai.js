import { isValidPlay, Card, getCurrentWinner, betterThan, getPartner, isTrump } from "./gameLogic";
import { removeCard, separateHand } from "./sorting";

const suits = ['c', 'd', 'h', 's'];
const suitsNames = ['clubs', 'diamonds', 'hearts', 'spades'];

export function makeCall(hand, player, dealer, callCard, faceUp) {

    var trump  = callCard.charAt(0);
    
    if (faceUp) {
        if (player === dealer) {
            
        }
        else if (getPartner(player) === dealer) {

        }
        else {

        }
    }
    else {
        var suitsStrength = [handSuitStrength(hand, 'c'), handSuitStrength(hand, 'd'), handSuitStrength(hand, 'h'), handSuitStrength(hand, 's')];
        suitsStrength[suits.indexOf(trump)] = 0;
        var bestIndex = 0;
        for (let i = 1; i < suitsStrength.length; i++) {
            if (suitsStrength[i] > suitsStrength[bestIndex]) {
                bestIndex = i;
            }
        }
        if (player === dealer) {
            return suitsNames[bestIndex];
        }
        else {
            if (suitsStrength[bestIndex] > 1) {
                return suitsNames[bestIndex];
            }
        }
    }
    return 'pass';
}

export function exchangeCallCard(hands, dealer, callCard) {
    var newHands = [...hands];
    removeCard(newHands[dealer - 1], getWorstCard(hands[dealer - 1], callCard.charAt(0)));
    newHands[dealer - 1].push(new Card(callCard));
    return newHands;
}

export function playAlone(hand, player, trump, dealer, callCard, faceUp) {
    return 0;
}

export function playCard(hand, player, roundHistory, trump, makers, callCard, dealer, faceUp, playerAlone) {
    // Find cards you can legally play
    var validPlays = [];
    for (let i = 0; i < hand.length; i++) {
        if (isValidPlay(hand[i].toString(), hand, trump, roundHistory)) {
            validPlays.push(hand[i]);
        }
    }
    
    // If only one legal move play it
    if (validPlays.length === 1) {
        return validPlays[0].toString();
    }

    // Find out the turn
    var cardsPlayed = roundHistory.length % 4;
    
    // Strategy for leading
    if (cardsPlayed === 0) {
        
    }

    // Get cards played
    var pseudoRoundHistory = [...roundHistory];
    var trick = pseudoRoundHistory.splice(pseudoRoundHistory.length - cardsPlayed, cardsPlayed);
    var leadSuit = trick[0].charAt(0);

    // Strategy for playing before partner
    if (cardsPlayed === 1) {
        var winningPlays = [];
        for (let i = 0; i < validPlays.length; i++) {
            if (betterThan(trick[0], validPlays[i].toString(), leadSuit, trump)) {
                winningPlays.push(validPlays[i]);
            }
        }
        if (winningPlays.length === 0) {
            return getWorstCard(validPlays, trump);
        }
        else {
            return getWorstCard(winningPlays, trump);
        }
    }
    
    // Find out which team is winning
    var winner = getCurrentWinner(trick, trump, player);
    

}

function getWorstCard(cards, trump) {
    if (cards.length === 1) {
        return cards[0].toString();
    }
    var worstCard = cards[0]
    for (let i = 1; i < cards.length; i++) {
        if (isTrump(cards[i].toString(), trump) && isTrump(worstCard.toString()), trump) {
            worstCard = betterThan(cards[i].toString(), worstCard.toString(), trump, trump) ? cards[i] : worstCard;
        }
        else if (isTrump(worstCard.toString()), trump) {
            worstCard = cards[i];
        }
        else if (!isTrump(cards[i].toString(), trump)) {
            let worstCardRank = parseInt(worstCard.toString().substring(1,3));
            let currentCardRank = parseInt(cards[i].toString().substring(1,3));
            if (currentCardRank < worstCardRank) {
                worstCard = cards[i];
            }
            else if (currentCardRank === worstCardRank) {
                let worstCardSuitCount = 0; 
                let currentCardSuitCount = 0;
                for (var card in cards) {
                    if (card.toString().charAt(0) === worstCard.toString().charAt(0)) {
                        worstCardSuitCount++;
                    }
                    else if (card.toString().charAt(0) === cards[i].toString().charAt(0)) {
                        currentCardSuitCount++;
                    }
                }
                if (currentCardSuitCount < worstCardSuitCount) {
                    worstCard = cards[i];
                }
            }
        }
    }
    return worstCard.toString();
}

function handSuitStrength(hand, trumpSuit) {
    
    var separated = separateHand(hand, trumpSuit);
    var trumpHand = separated[suits.indexOf(trumpSuit)];

    if (trumpHand.length === 0) {
        return 0;
    }
    var playerSuitStrength = 0;
    for (let i = 0; i < trumpHand.length; i++) {
        let rank = parseInt(trumpHand[i].toString().substring(1,3));
        if (rank === 11) {
            if (trumpHand.toString().charAt(0) === trumpSuit) {
                playerSuitStrength += 16 - 7;
            }
            else {
                playerSuitStrength += 15 - 7;
            }
        }
        else {
            playerSuitStrength += rank - 7;
        }
    }
    var otherPlayersSuitStrength = 40 - playerSuitStrength;
    return (playerSuitStrength * trumpHand.length) / (otherPlayersSuitStrength * (7 - trumpHand.length) / 2);
}