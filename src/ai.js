import { isValidPlay, Card } from "./gameLogic";
import { removeCard } from "./sorting";

export function makeCall(hand, player, dealer, callCard, faceUp) {

    if (faceUp) {

    }
    else {

    }
    return 'pass';
}

export function exchangeCallCard(hands, dealer, callCard) {
    var newHands = [...hands];
    removeCard(newHands[dealer - 1], newHands[dealer - 1][0].toString());
    newHands[dealer - 1].push(new Card(callCard));
    return newHands;
}

export function playAlone(hand, player, trump, dealer, callCard, faceUp) {
    return 0;
}

export function playCard(hand, player, roundHistory, trump, makers, callCard, dealer, faceUp, playerAlone) {
    console.log(`Player ${player} is playing...`);
    var validPlays = [];

    console.log(roundHistory);
    console.log(hand);

    for (let i = 0; i < hand.length; i++) {
        if (isValidPlay(hand[i].toString(), hand, trump, roundHistory)) {
            validPlays.push(hand[i]);
        }
    }
    console.log(validPlays);
    return validPlays[0].toString();
}



function handSuitStrength() {

}