import React, { useState, useEffect, useRef } from 'react';
function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}
const tasks = new Array(10).fill(null)
const doWorkIfNeeded = (isInput, inputRef) => {
    const date = Date.now();
    inputRef.current.value = inputRef.current.value + '1';
    console.log("doWorkIfNeeded -> inputRef.current.value", inputRef.current.value)
    while(Date.now() - date < 2000) {
        // if(isInput.current) return;
    }
    tasks.pop();
}
function Test() {
    let [count, setCount] = useState(0);
    const [name, setName] = useState('oh nanana');
    // useEffect(() => {
    //     // Promise.resolve().then(() => {
    //     // })
    //     setName('hi');
    //     setCount(c => c+1);
    // }, [])
    // useEffect(() => {
    //     console.log(document.querySelector('h1'));
    // }, [name])
    // const prevCount = usePrevious(count);
    // function handleClick() {
    //     setCount(count => count + 5); // 以最后一个为准, 因为setCount 不会立即触发
    //     // setName(name => name + ' nanana');
    //     setTimeout(() => {
    //         // setCount(count + 1);
    //         // setCount(count + 2);
    //         // setCount(count + 3);
    //         // setCount(count + 4);
    //         // setCount(count + 5); // 以最后一个为准, 因为setCount 不会立即触发
    //         // setName(name => name + ' nanana');
    //     }, 200)
    //     console(count)
    // }
    // useEffect(() => {
    //     document.querySelector('button').addEventListener('click', ()=> {
    //         setCount(count + 5); // 以最后一个为准, 因为setCount 不会立即触发
    //         setName(name => name + ' nanana');
    //     })
    //     console.log(count, name);
    // }, [count, name])
    // useEffect(() => {
    //     const id = setInterval(() => {
    //         // console.log(count)
    //         // setCount(++count);
    //         setCount(count + 1)
    //     }, 1000);
    // }, []);
    // console.log(count);
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
    // console.log(3, '我是渲染', count, name);
    // function onMouseOut(e) {} // 触发条件：移出父元素和移出每个子元素
    const isInput = useRef(false);
    const onChange = () => {
        isInput.current = true;
    }
    const onBlur = () => {
        isInput.current = false;
    }
    const inputRef = useRef(null)
    requestIdleCallback(myWork, { timeout: 2000 });
    function myWork(deadline) {
        // 如果有剩余时间，或者任务已经超时，并且存在任务就需要执行
        while ((deadline.timeRemaining() > 0 || deadline.didTimeout)
            && tasks.length > 0) {
            doWorkIfNeeded(isInput, inputRef);
        }
        // 当前存在任务，再次调用 requestIdleCallback，会在空闲时间执行 myWork
        if (tasks.length > 0) {
            requestIdleCallback(myWork, { timeout: 2000 });
        }
    }
    return (
        <div>
            {/* <h1>Now: {count}, before: {prevCount}</h1> */}
            {/* <button onClick={handleClick}>add</button> */}
            <input onInput={onChange} onBlur={onBlur} ref={inputRef}/>
            {count && <h1>{count}-----{name}</h1>}
        </div>
    )
    // for(let i =0; i < 1; i++) {
    //     let [a] = useState(11111);
    //     useEffect(() => {}, []);
    //     return <>{a}</>
    // }
}

export default Test;