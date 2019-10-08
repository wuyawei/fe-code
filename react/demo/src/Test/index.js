import React, { useState, useEffect, useRef } from 'react';
let num = 0;
function Test() {
    let [count, setCount] = useState(0);
    const prevCount = usePrevious(count);
    function handleClick() {
        setCount(count + 1);
        setCount(count + 2);
        setCount(count + 3);
        setCount(count + 4);
        setCount(count + 5); // 以最后一个为准
        console.log('3===>', count);
    }
    // useEffect(() => {
    //     const id = setInterval(() => {
    //         console.log(num);
    //         // console.log(count)
    //         setCount(++num);
    //     }, 1000);
    //   }, []);
    // console.log('我是 num', num);
    // useEffect(() => {
    //     const id = setInterval(() => {
    //         console.log(1, '我是定时器', count);
    //         setCount(count + 1);
    //     }, 1000);
    //     return () => {
    //         console.log(2, `我清理的是 ${count} 的副作用`);
    //         clearInterval(id);
    //     }
    // }, [count]);
    console.log(3, '我是渲染', count);
    function onMouseOut(e) {} // 触发条件：移出父元素和移出每个子元素
    return (
        <div>
            {/* <h1>Now: {count}, before: {prevCount}</h1>
            <button onClick={handleClick}>add</button> */}
            <h1>{count}-----</h1>
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