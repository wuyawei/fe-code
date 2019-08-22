import React, { useState, useEffect, useRef } from 'react';
function Test() {
    const [count, setCount] = useState(0);
    const prevCount = usePrevious(count);
    function handleClick() {
        setCount(count + 1);
        console.log('3===>', count);
    }
    return (
        <div>
            <h1>Now: {count}, before: {prevCount}</h1>
            <button onClick={handleClick}>add</button>
        </div>
    )
}

function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
        console.log('1===>', value);
    });
    console.log('2===>', ref.current);
    return ref.current;
}
export default Test;