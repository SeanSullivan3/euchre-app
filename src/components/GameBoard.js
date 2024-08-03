import React, { useState, useEffect } from "react";
import "../styles/GameBoard.css";
import {shuffle,increment,deal} from "../Sorting.js";
import { makeCall, exchangeCallCard } from "../ai.js";
import { getValidCalls } from "../gameLogic.js";
import Cardsvg from "./Card.js";
import Hand from "./Hand.js";

class Card {
    constructor(string) {
        this.suit = string.charAt(0);
        this.rank = parseInt(string.substring(1));
    }

    toString() {
        return this.suit + this.rank.toString();
    }
}

const suits = ['c', 'd', 'h', 's'];
const ranks = [9, 10, 11, 12, 13, 14];
const deck = [];
for (let suit of suits) for (let rank of ranks) deck.push(new Card(suit + rank.toString()));



export default function GameBoard() {
    const [p1GameScore, setP1GameScore] = useState(0);
    const [p2GameScore, setP2GameScore] = useState(0);
    const [p1TrickScore, setP1TrickScore] = useState(0);
    const [p2TrickScore, setP2TrickScore] = useState(0);
    const [round, setRound] = useState('dealing');
    const [dealer, setDealer] = useState(1);
    const [turn, setTurn] = useState(increment(dealer));
    const [callCard, setCallCard] = useState('none');
    const [faceUp, setFaceUp] = useState(true);
    const [validCalls, setValidCalls] = useState([]);
    const [makers, setMakers] = useState('none');
    const [trump, setTrump] = useState('none');
    const [p1Card, setP1Card] = useState('none');
    const [p2Card, setP2Card] = useState('none');
    const [p3Card, setP3Card] = useState('none');
    const [p4Card, setP4Card] = useState('none');
    const [playerHands, setPlayerHands] = useState([[],[],[],[]]);
    const [choice, setChoice] = useState('none');
    const [waitingForClick, setWaitingForClick] = useState(false);

    var roundHistory = {};

    const startDeal = () => {
        var shuffled = shuffle(deck);

        setPlayerHands(deal(shuffled, dealer));

        setCallCard(shuffled.pop().toString());

        setRound('calling');
        //calling();
    }

    const handleClick = (name) => {
        if (turn === 1) {
            setChoice(name);
            if (round === 'exchanging' && dealer === 1) {
                exchange(false);
            }
        }
        else {
            //Set message
        }
    }

    const choiceFromButton = (choice) => {
        setChoice(choice);
        if (round === 'calling') {
            callTurn(false);
        }
    }

    const nextTurn = () => {
        setTurn(increment(turn))
    }

    function callTurn(isBot) {
        if (isBot) {
            setChoice(makeCall(playerHands[turn - 1], turn, dealer, callCard, faceUp));
        }
        console.log(choice);
        if (choice !== 'pass') {
            setMakers(turn % 2 == 1 ? 'P1 & P3' : 'P2 & P4');
            setTrump(choice === 'pick' ? callCard.charAt(0) : choice.charAt(0));
            if (choice === 'pick') {
                setRound('exchanging');
            }
        }
        else {
            if (turn === dealer) {
                setFaceUp(false);
                setValidCalls(getValidCalls(callCard));
                setCallCard('back');
            }
            setTimeout(nextTurn, 3000);
        }
    }

    function exchange(isBot) {
        if (isBot) {
            setPlayerHands(exchangeCallCard(playerHands[turn - 1], turn, callCard));
        }
        else {
            var newHand = playerHands[0];
            newHand[newHand.indexOf(new Card(choice))] = new Card(callCard);
            setPlayerHands([newHand, playerHands[1], playerHands[2], playerHands[3]]);
        }
        setRound('playing');
        setTurn(increment(dealer));
    }

    useEffect(() => {
        if (turn !== 1) {
            if (round === 'calling') {
                callTurn(true);
            }
            if (round === 'exchanging') {
                exchange(true);
            }
        }
    });
    



    return (
        <div>
            <Hand hand={playerHands[2]} player='p3'/>
            <div className="container">
                <Hand hand={playerHands[1]} player='p2'/>
                <div className="gameBoard">
                    <div className="info-p3">
                        {dealer === 3 && <div>Dealer⬆</div>}
                        {turn === 3 && <div>Turn⬆</div>}
                    </div>
                    <div className="player"> 
                        <div className="name-p3">Player3</div>
                        {p3Card !== 'none' && <Cardsvg name={p3Card} player='p3'/>}
                        
                    </div>
                    <div className="info-p4 vert">
                        {turn === 4 && <div>⬇Turn</div>}
                        {dealer === 4 && <div>⬇Dealer</div>}
                    </div>
                    <div className="player vert">
                        <div className="name-p2">Player2</div>
                        {p2Card !== 'none' && <Cardsvg name={p2Card} player='p2'/>}
                    </div>
                    <div className="center">
                        {round === 'dealing' && <button className="btnDeal" onClick={startDeal}>Deal</button>}
                        {round === 'calling' && <Cardsvg name={callCard} player='calling'/>}
                        {round === 'calling' && turn === 1 && faceUp &&
                            <div className="call-choices">
                                <button onClick={() => {choiceFromButton('pick')}}>Pick it up!</button>
                                <button onClick={() => {choiceFromButton('pass')}}>Pass</button>
                            </div>
                        }
                        {round === 'calling' && turn === 1 && !faceUp &&
                            <div className="call-choices">
                                <button onClick={() => {choiceFromButton(validCalls[0])}}>{validCalls[0]}</button>
                                <button onClick={() => {choiceFromButton(validCalls[1])}}>{validCalls[1]}</button>
                                <button onClick={() => {choiceFromButton(validCalls[2])}}>{validCalls[2]}</button>
                            </div>
                        }
                    </div>
                    <div className="player vert">
                        {p4Card !== 'none' && <Cardsvg name={p4Card} player='p4'/>}
                        <div className="name-p4">Player4</div>
                    </div>
                    <div className="info-p2 vert">
                        {turn === 2 && <div>⬇Turn</div>}
                        {dealer === 2 && <div>⬇Dealer</div>}
                    </div>
                    <div className="player">
                        {p1Card !== 'none' && <Cardsvg name={p1Card} player='p1'/>}
                        <div className="name-p1">Player1</div>
                    </div>
                    <div className="info-p1">
                        {turn === 1 && <div>⬇Turn</div>}
                        {dealer === 1 && <div>⬇Dealer</div>}
                    </div>
                </div>
                <Hand hand={playerHands[3]} player='p4'/>
            </div>
            <div className="scoring-container">
                <div className="score">
                    <div>Trick Score</div>
                    <div>
                        <span className="blue">{p1TrickScore}</span>
                        {" - "}
                        <span className="red">{p2TrickScore}</span>
                    </div>
                    {round === 'playing' && 
                        <div>
                            {"Makers: "}
                            <span className={makers === 'P1 & P3' ? 'blue' : 'red'}>{makers}</span>
                        </div>
                    }
                </div>
                <Hand hand={playerHands[0]} player='p1' handleClick={handleClick}/>
                <div className="score">
                    <div>Game Score</div>
                    <div>
                        <span className="blue">{p1GameScore}</span>
                        {" - "}
                        <span className="red">{p2GameScore}</span>
                    </div>
                </div>
            </div>
            
        </div>
    );
}