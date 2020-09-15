import React, { useState, Suspense } from 'react';
import useImmerState from '../hooks/useImmerState';

const baseState = [
    {
        todo: "Learn typescript",
        done: true
    },
    {
        todo: "Try immer",
        done: false
    }
]
function Ability() {
    const [value, setValue] = useImmerState(baseState);
    const onClick = () => {
        setValue(draftState => {
            draftState.push({todo: "Tweet about it"})
            draftState[1].done = true
        })
    }
    return (
        <div onClick={onClick}> 
            {JSON.stringify(value)}
        </div>
    )
}

export default Ability;
