import React, { useState, useEffect } from 'react';
import './App.css';

function Square(props) {
    return (
       <div className="square">{props.value}</div>
    );
}
function Board() {
    const a = new Array(9).fill('');
    return (
        <div className="Board">
            {
                a.map((v, i) => <Square key={i} value={i}/>)
            }
        </div>
    )
}
function Game() {
    const m = '下一个：X';
    return (
        <div className="Game">
            <div className="game-board">
                <Board/>
            </div>
            <div className="game-info">
                <div className="status">
                    {m}
                </div>
                <ol></ol>
            </div>
        </div>
    )
}

export default Game;
