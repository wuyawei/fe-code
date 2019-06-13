import React, { useState, useEffect } from 'react';
import './App.css';

function Square(props) {
    return (
       <div className="square" onClick={() => props.handelClick(props.v, props.i)}>{props.v}</div>
    );
}
function Board(props) {
    const a = props.a.slice();
    return (
        <div className="Board">
            {
                a.map((v, i) => <Square key={i} i={i} v={v} handelClick={props.handelClick}/>)
            }
        </div>
    )
}
function Game() {
    const [m, setm] = useState('X');
    function handelStatus () {
        setm(m === 'X' ? 'O' : 'X');
    }

    const [his, sethis] = useState([]);
    const [isBack, setIsBack] = useState(null);
    function handelHis(h, d) {
        sethis(h.concat([d]));
    }
    
    const [a, seta] = useState(new Array(9).fill(null));
    function handelClick(v, i) {
        if (v) {
            return;
        }
        let h = his.slice();
        if (isBack !== null) {
            h = h.slice(0, isBack + 1);
            sethis(h);
            setIsBack(null);
        }
        let b = Object.assign([], a);
        b[i] = m;
        seta(b);
        handelStatus();
        handelHis(h, b);
    }

    function handelBack(step) {
        seta(his[step]);
        setIsBack(step);
    }
    return (
        <div className="Game">
            <div className="game-board">
                <Board a={a} m={m} handelClick={handelClick}/>
            </div>
            <div className="game-info">
                <div className="status">
                下一个：{m}
                </div>
                <ol>
                    {
                        his.map((v, i) => <li onClick={() => handelBack(i)} key={i} >step {i+1}</li>)
                    }
                </ol>
            </div>
        </div>
    )
}

export default Game;
