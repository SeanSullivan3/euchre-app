import React from "react";
import "../styles/Card.css";

export default function Cardsvg(props) {
    const name = props.name;
    const player = props.player;

    var style = {};

    if (player === 'p2') {
        style = {transform: 'rotate(90deg)'};
    }
    if (player === 'p4') {
        style = {transform: 'rotate(-90deg)'};
    }
    
    return <img className={`card${player}`} style={style} src={`/images/${name}.svg`} alt={`${player}`} onClick={() => props.handleClick(name)}></img>;
}
 