import React from "react";
import "../styles/Hand.css";
import Cardsvg from "./Card.js"

export default function Hand(props) {
 
    var player = props.player;
    var hand  = props.hand;

    return (
        /*
        <div className={`hand${player}`}>
            {hand.length > 0 && <Cardsvg name={player === 'p1' ? hand[0].toString() : 'back'} player={player} handleClick={props.handleClick}/>}
            {hand.length > 1 && <Cardsvg name={player === 'p1' ? hand[1].toString() : 'back'} player={player} handleClick={props.handleClick}/>}
            {hand.length > 2 && <Cardsvg name={player === 'p1' ? hand[2].toString() : 'back'} player={player} handleClick={props.handleClick}/>}
            {hand.length > 3 && <Cardsvg name={player === 'p1' ? hand[3].toString() : 'back'} player={player} handleClick={props.handleClick}/>}
            {hand.length > 4 && <Cardsvg name={player === 'p1' ? hand[4].toString() : 'back'} player={player} handleClick={props.handleClick}/>}
        </div>
        */

        <div className={`hand${player}`}>
            {hand.length > 0 && <Cardsvg name={hand[0].toString()} player={player} handleClick={props.handleClick}/>}
            {hand.length > 1 && <Cardsvg name={hand[1].toString()} player={player} handleClick={props.handleClick}/>}
            {hand.length > 2 && <Cardsvg name={hand[2].toString()} player={player} handleClick={props.handleClick}/>}
            {hand.length > 3 && <Cardsvg name={hand[3].toString()} player={player} handleClick={props.handleClick}/>}
            {hand.length > 4 && <Cardsvg name={hand[4].toString()} player={player} handleClick={props.handleClick}/>}
        </div>

    );
}

