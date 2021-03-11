import React, { useState, Suspense, useEffect } from 'react';
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

function Test1(props) {
    const [remoteValue, setRemoteValue] = useState('');
    const params = {value: props.value, id: 123};

    useEffect(() => {
        fetch(params).then(res => {
            setRemoteValue(res)
        })
    }, [params])
    
    return ( 
        <p>{remoteValue.value}</p>
    )
}

function Test2(props) {
    const [remote, setRemote] = useState({});
    const params = {value: props.value, id: 123};

    useEffect(() => {
        fetch(params).then(res => {
            setRemote({value: res})
        })
        // setTimeout(() => {
        //     setRemoteValue({value: 123})
        //     console.log('123: ', 123);
        // }, 1000)
    }, [params])
    
    return ( 
        <p>{remote.value}</p>
    )
}

function Counter1() {
    const [count, setCount] = useState(0);
    useEffect(() => {
        const id = setInterval(() => {
            setCount(count + 1);
        }, 1000);
    }, []);

    return <h1>{count}</h1>;
}

function Counter2() {
    const [count, setCount] = useState(0);
    let num = 0;
    useEffect(() => {
        const id = setInterval(() => {
            // 通过 num 来给 count 提供值
            setCount(++num);
        }, 1000);
    }, []);

    return <h1>{count}</h1>;
}

function Counter3() {
    // 注意这里变成 let
    let [count, setCount] = useState(0);
    useEffect(() => {
        const id = setInterval(() => {
            setCount(++count);
        }, 1000);
    }, []);
    return <h1>{count}</h1>;
}

function Counter4() {
    const [count, setCount] = useState(0);
    useEffect(() => {
        const id = setInterval(() => {
            // 注意：这里变成回调了
            setCount(count => count + 1);
        }, 1000);
    }, []);

    return <h1>{count}</h1>;
}

function Counter5() {
    const [count, setCount] = useState(0);
    useEffect(() => {
        const id = setInterval(() => {
            console.log(1, '我是定时器', count);
            setCount(count + 1);
        }, 1000);
        return () => {
            console.log(2, `我清理的是 ${count} 的副作用`);
            clearInterval(id);
        }
    }, [count]);
    console.log(3, '我是渲染', count);
    return <h1>{count}</h1>;
}
export default Counter5;
