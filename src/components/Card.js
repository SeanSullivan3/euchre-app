import React from "react";

export default function Cardsvg(props) {
    const name = props.name;
    const player = props.player;

    var style;

    if (player === 'p1') {
        style = {height: '80%', margin: '0 auto auto'}
    }
    else if (player === 'p2') {
        style = {height: '80%', transform: 'rotate(90deg)', margin: '0 0 0 30%'}
    }
    else if (player === 'p3') {
        style = {height: '80%', transform: 'rotate(180deg)', margin: 'auto auto 0'}
    }
    else if (player === 'p4') {
        style = {height: '80%', transform: 'rotate(270deg)', margin: '0 0 0 10%'}
    }
    else {
        style = {height: '80%'}
    }
    
    console.log(`/images/${name}.svg`);
    return <img style={style} src={`/images/${name}.svg`} alt={`${player}`}></img>;
}
