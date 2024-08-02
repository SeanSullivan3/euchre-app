import React, { useState } from "react";
import "../styles/GameBoard.css"
import {shuffle,increment,deal} from "../Sorting.js"
import Cardsvg from "./Card.js"

class Card {
    constructor(suit, rank) {
        this.suit = suit;
        this.rank = rank;
    }

    toString() {
        return this.suit + this.rank.toString();
    }
}

const suits = ['c', 'd', 'h', 's'];
const ranks = [9, 10, 11, 12, 13, 14];
const deck = []
for (let suit of suits) for (let rank of ranks) deck.push(new Card(suit, rank));



export default function GameBoard() {
    const [round, setRound] = useState('dealing');
    const [dealer, setDealer] = useState(1);
    const [turn, setTurn] = useState(increment(dealer));
    const [callCard, setCallCard] = useState('none')
    const [trump, setTrump] = useState('none');
    const [p1Card, setP1Card] = useState('none');
    const [p2Card, setP2Card] = useState('none');
    const [p3Card, setP3Card] = useState('none');
    const [p4Card, setP4Card] = useState('none');
    const [p1Hand, setP1Hand] = useState([]);
    const [p2Hand, setP2Hand] = useState([]);
    const [p3Hand, setP3Hand] = useState([]);
    const [p4Hand, setP4Hand] = useState([]);

    var roundHistory = {};
    var playerHands;


    const startDeal = () => {
        var shuffled = shuffle(deck);

        playerHands = deal(shuffled, dealer);
        setP1Hand(playerHands[0]);
        setP2Hand(playerHands[1]);
        setP3Hand(playerHands[2]);
        setP4Hand(playerHands[3]);

        setCallCard(shuffled.pop().toString());

        setRound('calling');
    }

    return (
        <div className="gameBoard">
            <div className="info-p3">
                {turn === 3 ? "Turn⬆" : " "}
            </div>
            <div className="player"> 
                {p3Card !== 'none' && <Cardsvg name={p3Card} player='p3'/>}
            </div>
            <div className="info-p4">
                {turn === 4 && "Turn⬆"}
            </div>
            <div className="player">
                {p2Card !== 'none' && <Cardsvg name={p2Card} player='p2'/>}
            </div>
            <div className="center">
                {round === 'dealing' && <button className="btnDeal" onClick={startDeal}>Deal</button>}
                {round === 'calling' && <Cardsvg name={callCard} player='calling'/>}
                {round === 'calling' && turn === 1 && 
                    <div className="call-choices">
                        <button>Pick it up!</button>
                        <button>Pass</button>
                    </div>
                }
            </div>
            <div className="player">
                {p4Card !== 'none' && <Cardsvg name={p4Card} player='p4'/>}
            </div>
            <div className="info-p2">
                {turn === 2 && "Turn⬆"}
            </div>
            <div className="player">
                {p1Card !== 'none' && <Cardsvg name={p1Card} player='p1'/>}
            </div>
            <div className="info-p1">
                {turn === 1 && "⬇Turn"}
            </div>
        </div>
    );
}