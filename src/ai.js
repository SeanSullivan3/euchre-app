import { isValidPlay } from "./gameLogic";

export function makeCall(hand, player, dealer, callCard, faceUp) {

    if (faceUp) {

    }
    else {

    }
    return 'pass';
}

export function exchangeCallCard(hands, player, callCard) {


}

export function playAlone(hand, player, trump, dealer, callCard, faceUp) {

}

export function playCard(hand, player, roundHistory, trump, makers, callCard, dealer, faceUp, playerAlone) {
    console.log(`Player ${player} is playing...`);
    var validPlays = [];

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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}