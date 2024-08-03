const suitsNames = ['clubs', 'diamonds', 'hearts', 'spades'];
const suits = ['c', 'd', 'h', 's'];
const suitsMap = new Map([['c', 1], ['d', 2], ['h', 3], ['s', 4],])

export function getValidCalls(callCard) {

    return suits.splice(suitsMap.get(callCard.charAt(0)),1);
}

export function getSuit(card) {

}