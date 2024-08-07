import React, { useState, useEffect } from "react";
import "../styles/GameBoard.css";
import { shuffle, deal, sortHand, removeCard } from "../sorting.js";
import { makeCall, exchangeCallCard, playAlone, playCard } from "../ai.js";
import { Card, getDeck, increment, decrement, getValidCalls, getSuit, isValidPlay, getPartner, getTrickWinner } from "../gameLogic.js";
import Cardsvg from "./Card.js";
import Hand from "./Hand.js";

const deck = getDeck();

const botDelay = 1000;

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
    const [choice, setChoice] = useState('Dealt');
    const [roundHistory, setRoundHistory] = useState([]);

    const startDeal = () => {
        var shuffled = [...shuffle(deck)];

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

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function callTurn(call) {
        if (call !== 'pass') {
            setMakers(turn % 2 == 1 ? 'P1 & P3' : 'P2 & P4');
            if (call === 'pick') {
                setChoice('Pick it up!');
                setTrump(getSuit(callCard));
                setRound('exchanging');
            }
            else if (call !== 'none') {
                setChoice(call.toUpperCase());
                setTrump(call);
                setPlayerHands([sortHand(playerHands[0], call.charAt(0)), playerHands[1], playerHands[2], playerHands[3]]);
                setRound('go_alone');
            }
        }
        else {
            if (turn !== 1) {
                await sleep(botDelay);
                setTurn(increment(turn));
            }
            else {
                setTurn(increment(turn));
            }
            if (turn === dealer) {
                setFaceUp(false);
                setValidCalls(getValidCalls(callCard));
            }
            setChoice('Pass');
        }
    }

    async function exchange(playerHands) {
        if (dealer !== 1) {
            await sleep(botDelay);
        }
        setPlayerHands([sortHand(playerHands[0], trump.charAt(0)), playerHands[1], playerHands[2], playerHands[3]]);
        setRound('go_alone');
    }

    async function goAlone(alone) {
        if (turn !== 1) {
            await sleep(botDelay / 2);
        }
        setPlayerAlone(alone);
        if (alone !== 0) {
            setChoice('Playing Alone');
            let newHands = playerHands;
            newHands[getPartner(alone) - 1] = [];
            setPlayerHands(newHands);
        }
        setChoice('Playing');
        setRound('playing');
        if (getPartner(alone) !== increment(dealer)) {
            setTurn(increment(dealer));
        }
        else {
            setTurn(increment(increment(dealer)));
        }
    }

    async function playTurn(card) {
        console.log('Playing Turn ' + card);

        var newRoundHistory = [...roundHistory, card];

        let newHands = playerHands;
        newHands[turn - 1] = removeCard(newHands[turn - 1], card);

        if (newRoundHistory.length % 4 === 0) {
            if (turn !== 1) {
                await sleep(botDelay);
            }
            let trickWinner = getTrickWinner(newRoundHistory, trump.charAt(0), turn);
            setTurn(trickWinner);
            setChoice('Wins');
            setRound('reset_trick');
        }
        else {
            if (increment(turn) === getPartner(playerAlone)) {
                if (turn !== 1) {
                    await sleep(botDelay);
                    setTurn(increment(increment(turn)));
                    newRoundHistory.push('none');
                }
                else {
                    setTurn(increment(increment(turn)));
                    newRoundHistory.push('none');
                }
            }
            else {
                if (turn !== 1) {
                    await sleep(botDelay);
                    setTurn(increment(turn));
                }
                else {
                    setTurn(increment(turn));
                }
            }
        }


        if (turn === 1) {
            setP1Card(card);
        }
        else if (turn === 2) {
            setP2Card(card);
        }
        else if (turn === 3) {
            setP3Card(card);
        }
        else if (turn === 4) {
            setP4Card(card);
        }
        setRoundHistory(newRoundHistory);
        setPlayerHands(newHands);
    }

    async function resetTrick() {
        await sleep(3000);
        var newP1TrickScore = p1TrickScore;
        var newP2TrickScore = p2TrickScore;
        if (turn === 1 || turn === 3) {
            setP1TrickScore(p1TrickScore + 1);
            newP1TrickScore++;
        }
        else {
            setP2TrickScore(p2TrickScore + 1);
            newP2TrickScore++;
        }
        if (newP1TrickScore + newP2TrickScore === 5) {
            setRound('reset_round');
            setChoice(newP1TrickScore > newP2TrickScore ? 'P1 & P3 Win Round' : 'P1 & P3 Win Round');
        }
        else {
            setChoice('Playing');
            setRound('playing');
        }
        setP1Card('none');
        setP2Card('none');
        setP3Card('none');
        setP4Card('none');
    }

    async function resetRound() {
        await sleep(3000);
        var newP1GameScore = p1GameScore;
        var newP2GameScore = p2GameScore;
        if (p1TrickScore > p2TrickScore) {
            if (p1TrickScore === 5) {
                if (playerAlone === 1 || playerAlone === 3) {
                    setP1GameScore(p1GameScore + 4);
                    newP1GameScore += 4;
                }
                else {
                    setP1GameScore(p1GameScore + 2);
                    newP1GameScore += 2;
                }
            }
            else {
                if (makers === 'P1 & P3') {
                    setP1GameScore(p1GameScore + 1);
                    newP1GameScore += 1;
                }
                else {
                    setP1GameScore(p1GameScore + 2);
                    newP1GameScore += 2;
                }
            }
        }
        else {
            if (p2TrickScore === 5) {
                if (playerAlone === 2 || playerAlone === 4) {
                    setP2GameScore(p2GameScore + 4);
                    newP2GameScore += 4;
                }
                else {
                    setP2GameScore(p2GameScore + 2);
                    newP2GameScore += 2;
                }
            }
            else {
                if (makers === 'P2 & P4') {
                    setP2GameScore(p2GameScore + 1);
                    newP2GameScore += 1;
                }
                else {
                    setP2GameScore(p2GameScore + 2);
                    newP2GameScore += 2;
                }
            }
        }
        if (newP1GameScore >= 10) {
            setRound('game_over');
            setChoice('P1 & P3 WIN!!!!!');
        }
        else if (newP2GameScore >= 10) {
            setRound('game_over');
            setChoice('P2 & P4 WIN!!!!!');
        }
        else {
            setRound('dealing');
            setDealer(increment(dealer));
            setTurn(increment(increment(dealer)));
            setPlayerAlone(0);
            setP1TrickScore(0);
            setP2TrickScore(0);
            setTrump('none');
            setMakers('none');
            setCallCard('none');
            setFaceUp(true);
            setPlayerHands([[],[],[],[]]);
            setRoundHistory([]);
            setChoice('dealt');
            setValidCalls([]);
        }
    }
    
    useEffect(() => {
        if (turn !== 1) {
            if (round === 'calling') {
                callTurn(makeCall(playerHands[turn - 1], turn, dealer, callCard, faceUp));
            }
            else if (round === 'go_alone') {
                goAlone(playAlone(playerHands[turn - 1], turn, trump.charAt(0), dealer, callCard, faceUp));
            }
            else if (round === 'playing') {
                playTurn(playCard(playerHands[turn - 1], turn, roundHistory, trump.charAt(0), makers, callCard, dealer, faceUp, playerAlone));
            }
        }
        if (round === 'exchanging' && dealer !== 1) {
            exchange(exchangeCallCard(playerHands, dealer, callCard));
        }
        if (round === 'reset_trick') {
            resetTrick();
        }
        if (round === 'reset_round') {
            resetRound();
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
                        {round === 'calling' &&
                            <div className={`info${decrement(turn) % 2 === 1 ? ' blue' : ' red'}`}>{`P${decrement(turn)}: ${choice}`}</div>
                        }
                        {(round === 'exchanging' || round === 'reset_trick')  &&
                            <div className={`info${turn % 2 === 1 ? ' blue' : ' red'}`}>{`P${turn}: ${choice}`}</div>
                        }
                        {round === 'reset_round' &&
                            <div className={`info${p1TrickScore > p2TrickScore ? ' blue' : ' red'}`}>{choice}</div>
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
                    <div>{round.toUpperCase()}</div>
                </div>
            </div>
            
        </div>
    );
}