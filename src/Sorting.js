
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

export function increment(prev) {
    return (prev + 1 > 4) ? 1 : prev + 1;
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

export function sortHand(hand, trump) {
    
}