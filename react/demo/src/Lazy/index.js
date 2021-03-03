import React, { useState, Suspense } from 'react'; 
import './index.css';
let newData = {};
const cache = {}
const fetch = async() => {
    const fn = () => new Promise((resolve, reject) => {
        setTimeout(() => resolve({name: 'Jsf'}), 1000);
    })
    if (!cache.k) {
        cache.k = fn();
    }
    newData = await cache.k
    cache.k = newData;
    return true;
};
const resource = () => {
    if (!cache.k) {
        fetch();
    }
    console.log("resource -> cache.k", cache.k);
    if (cache.k && typeof cache.k.then === 'function') {
        throw cache.k
    }
    return newData;
}
function Board(props) {
    // 尝试读取用户信息，尽管该数据可能尚未加载
    const user = resource();
    console.log("Board -> user", user)
    return <h1>{user.name}</h1>;
}
function Lazy() {
    return (
        <div>
            <div>
                <h2>Lazy</h2>
            </div>
            <Suspense fallback={<div>loading...</div>}>
                <Board/>
            </Suspense>
        </div>
    )
}

export default Lazy;
