import React, { useState, useEffect } from "react";
import "../styles/GameBoard.css";
import { shuffle, deal, sortHand, removeCard } from "../sorting.js";
import { makeCall, exchangeCallCard, playAlone, playCard } from "../ai.js";
import { Card, getDeck, increment, getValidCalls, getSuit, isValidPlay, getPartner, getTrickWinner } from "../gameLogic.js";
import Cardsvg from "./Card.js";
import Hand from "./Hand.js";

const deck = getDeck();


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
    const [playerAlone, setPlayerAlone] = useState(0);
    const [p1Card, setP1Card] = useState('none');
    const [p2Card, setP2Card] = useState('none');
    const [p3Card, setP3Card] = useState('none');
    const [p4Card, setP4Card] = useState('none');
    const [playerHands, setPlayerHands] = useState([[],[],[],[]]);
    const [choice, setChoice] = useState('none');
    const [roundHistory, setRoundHistory] = useState([]);

    const startDeal = () => {
        var shuffled = shuffle(deck);

        setPlayerHands(deal(shuffled, dealer));

        setCallCard(shuffled.pop().toString());

        setRound('calling');
    }

    const handleClick = (name) => {
        if (turn === 1) {
            if (round === 'exchanging' && dealer === 1) {
                var newHand = playerHands[0];
                newHand[newHand.findIndex(card => card.toString() === name)] = new Card(callCard);
                exchange([newHand, playerHands[1], playerHands[2], playerHands[3]]);
            }
            else if (round === 'playing') {
                if (isValidPlay(name, playerHands[0], trump.charAt(0), roundHistory)) {
                    playTurn(name);
                }
                else {
                    //Set message
                }
            }
        }
        else {
            //Set message
        }
    }

    const choiceFromButton = (choice) => {
        if (round === 'calling') {
            callTurn(choice);
        }
        else if (round === 'go_alone') {
            if (choice === 'alone') {
                goAlone(1);
            }
            else {
                goAlone(0);
            }
        }
    }

    const nextTurn = () => {
        setTurn(increment(turn))
    }

    function callTurn(call) {
        setChoice(call);
        if (call !== 'pass') {
            setMakers(turn % 2 == 1 ? 'P1 & P3' : 'P2 & P4');
            if (call === 'pick') {
                setTrump(getSuit(callCard));
                setRound('exchanging');
            }
            else if (call !== 'none') {
                setTrump(call);
                //setPlayerHands([sortHand(playerHands[0], call.charAt(0)), playerHands[1], playerHands[2], playerHands[3]]);
                setRound('go_alone');
            }
        }
        else {
            if (turn === dealer) {
                setFaceUp(false);
                setValidCalls(getValidCalls(callCard));
            }
            if (turn !== 1) {
                setTimeout(nextTurn, 1000);
            }
            else {
                nextTurn();
            }
        }
    }

    function exchange(playerHands) {
        console.log(playerHands)
        setPlayerHands([sortHand(playerHands[0], trump.charAt(0)), playerHands[1], playerHands[2], playerHands[3]]);
        setRound('go_alone');
    }

    function goAlone(alone) {
        setPlayerAlone(alone);
        if (alone !== 0) {
            console.log('playing alone');
            let newHands = playerHands;
            newHands[getPartner(alone) - 1] = [];
            setPlayerHands(newHands);
        }
        setRound('playing');
        if (getPartner(alone) !== increment(dealer)) {
            setTurn(increment(dealer));
        }
        else {
            setTurn(increment(increment(dealer)));
        }
    }

    function playTurn(card) {
        console.log('Playing Turn');
        if (turn === 1) {
            setP1Card(card);
        }
        else if (turn === 2) {
            setP1Card(card);
        }
        else if (turn === 3) {
            setP1Card(card);
        }
        else if (turn === 4) {
            setP1Card(card);
        }

        var newRoundHistory = roundHistory;
        newRoundHistory.push(card);
        setRoundHistory(newRoundHistory);
        
        let newHands = playerHands;
        newHands[turn - 1] = removeCard(newHands[turn - 1], card);
        setPlayerHands(newHands);
        console.log(newHands);

        if (newRoundHistory.length % 4 === 0) {
            let trickWinner = getTrickWinner(newRoundHistory, trump.charAt(0), turn);
            if (trickWinner === 1 || trickWinner === 3) {
                setP1TrickScore(p1TrickScore + 1);
            }
            else {
                setP2TrickScore(p2TrickScore + 1);
            }
            setP1Card('none');
            setP2Card('none');
            setP3Card('none');
            setP4Card('none');
            setTimeout(setTurn(trickWinner), 3000);
        }
        else {
            if (increment(turn) === getPartner(playerAlone)) {
                if (turn !== 1) {
                    setTimeout(setTurn(increment(increment(turn))), 1000);
                }
                else {
                    setTurn(increment(increment(turn)));
                }
            }
            else {
                if (turn !== 1) {
                    console.log('NextTurn');
                    setTimeout(nextTurn, 1000);
                }
                else {
                    nextTurn();
                }
            }
        }
    }
    
    useEffect(() => {
        if (turn !== 1) {
            if (round === 'calling') {
                callTurn(makeCall(playerHands[turn - 1], turn, dealer, callCard, faceUp));
            }
            else if (round === 'exchanging') {
                exchange(exchangeCallCard(playerHands[turn - 1], turn, callCard));
            }
            else if (round === 'go_alone') {
                goAlone(playAlone(playerHands[turn - 1], turn, trump, dealer, callCard, faceUp));
            }
            else if (round === 'playing') {
                playTurn(playCard(playerHands[turn - 1], turn, roundHistory, trump, makers, callCard, dealer, faceUp, playerAlone));  
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
                        {(round === 'calling' || round === 'exchanging') && <Cardsvg name={faceUp ? callCard : 'back'} player='calling'/>}
                        {round === 'calling' && turn === 1 && faceUp &&
                            <div className="call-choices">
                                <button className="btnChoice" onClick={() => {choiceFromButton('pick')}}>Pick it up!</button>
                                <button className="btnChoice" onClick={() => {choiceFromButton('pass')}}>Pass</button>
                            </div>
                        }
                        {round === 'calling' && turn === 1 && !faceUp &&
                            <div className="call-choices">
                                <button className="btnChoice" onClick={() => {choiceFromButton(validCalls[0])}}>{validCalls[0]}</button>
                                <button className="btnChoice" onClick={() => {choiceFromButton(validCalls[1])}}>{validCalls[1]}</button>
                                <button className="btnChoice" onClick={() => {choiceFromButton(validCalls[2])}}>{validCalls[2]}</button>
                            </div>
                        }
                        {round === 'go_alone' && turn === 1 &&
                            <div className="call-choices">
                                <button className="btnChoice" onClick={() => {choiceFromButton('alone')}}>Go alone!</button>
                                <button className="btnChoice" onClick={() => {choiceFromButton('team')}}>Play with teamate</button>
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
                    {round === 'playing' && <div>{`Trump: ${trump.toUpperCase()}`}</div>}
                </div>
                <Hand hand={playerHands[0]} player='p1' handleClick={handleClick}/>
                <div className="score">
                    <div>Game Score</div>
                    <div>
                        <span className="blue">{p1GameScore}</span>
                        {" - "}
                        <span className="red">{p2GameScore}</span>
                    </div>
                    <div>{round}</div>
                </div>
            </div>
            
        </div>
    );
}