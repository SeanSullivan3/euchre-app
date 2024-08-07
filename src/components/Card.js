import React from "react";
import "../styles/Card.css";

export default function Cardsvg(props) {
    const name = props.name;
    const player = props.player;

    return (
    <div className={`card-container${player}`}>
        <img className={`card${player}`} src={`/images/${name}.svg`} alt={`${player}`} onClick={() => props.handleClick(name)}></img>
    </div>
    );
    
}
 