import React, { useState, useEffect, useRef } from 'react';
function Test() {
    const [count, setCount] = useState(0);
    const prevCount = usePrevious(count);
    function handleClick() {
        setCount(count+1);
        console.log('3===>', count);
    }
    function onMouseOut(e) {} // 触发条件：移出父元素和移出每个子元素
    return (
        <div style={{border: '1px solid #000'}}>
            <h1>Now: {count}, before: {prevCount}</h1>
            <button onClick={handleClick}>add</button>
        </div>
    )
}

function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}
export default Test;