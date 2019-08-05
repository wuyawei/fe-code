import React, { useState, useEffect, useRef } from 'react';

function sleep(delay) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, delay);
    })
}

function Touch() {
    const ref = useRef(null);
    const startTouchRef = useRef({x: 0, y: 0})
    useEffect(() => {
        
        // const a = document.getElementsByClassName('a')[0];
        // a.addEventListener('click', onClick, { passive: true });

        // 设置touchmove，为了禁用部分方向的默认事件
        // ref.current.addEventListener('touchmove', onTouchMove, { passive: false });
        // ref.current.addEventListener('contextmenu', onContextMenu, { passive: true });
        // ref.current.addEventListener('mousewheel', onMouseWheel, { passive: true });
        return () => {
            // ref.current.removeEventListener('touchmove', onTouchMove, { passive: true });
            // ref.current.removeEventListener('contextmenu', onContextMenu, { passive: true });
        };
    }, []);
    
    function onTouchStart(e) { // 保存初始位置
        startTouchRef.current = { x: e.touches[0].pageX, y: e.touches[0].pageY };
    }

    function onTouchMove(e) {  // 直接绑定默认 passive 是 true
        // console.time();
        // let index = 0;
        // for (let i = 0; i< 1000000000; i++) {
        //     index++;
        // }
        // e.preventDefault();
        // console.timeEnd();
        
        // 限制垂直方向上的滚动
        const y = Math.abs(e.touches[0].pageY - startTouchRef.current.y);
        const x = Math.abs(e.touches[0].pageX - startTouchRef.current.x);
        if (y < x) {
            e.preventDefault();
        }
    }


    function onClick(e) { // 直接绑定默认 passive 是 false
        e.preventDefault();
        console.log('我是 a')
    }
    function onMouseWheel(e) { // 只对移动端做了优化
        console.time();
        let index = 0;
        for (let i = 0; i< 1000000000; i++) {
            index++;
        }
        // [Violation] 'mousewheel' handler took 174ms  > 150 ms 会提示
        console.timeEnd();
        console.log('我是 mousewheel')
        // e.preventDefault();
    }
    function onContextMenu(e) {  // 直接绑定默认 passive 是 false
        console.time();
        let index = 0;
        for (let i = 0; i< 1000000000; i++) {
            index++;
        }
        console.timeEnd();
        // e.preventDefault();
    }
    return (
        // touchAction:'pan-x'
        <div style={{height: 500, padding: '20px', overflow: 'auto',color: '#fff', fontSize: 38, textAlign: 'center'}}>
            <div style={{height: 200, backgroundColor: 'red', marginBottom: 20}}>1</div>
            <div style={{height: 200, backgroundColor: '#25b25e', marginBottom: 20}}>
                <a className='a' onClick={onClick} href="https://developer.mozilla.org/" target="_blank">
                    click me
                </a>
            </div>
            <div style={{height: 200, backgroundColor: '#ff6000', marginBottom: 20, overflow:'auto'}} onTouchStart={onTouchStart} ref={ref} onTouchMove={onTouchMove}>
                <div style={{width: 1200, display: 'flex', alignItems: 'center', height: '100%'}}>
                    <div style={{display: 'inline-block', width:200, height: 100,backgroundColor: '#77e2a2', marginRight: 20}}></div>
                    <div style={{display: 'inline-block', width:200, height: 100,backgroundColor: '#77e2a2', marginRight: 20}}></div>
                    <div style={{display: 'inline-block', width:200, height: 100,backgroundColor: '#77e2a2', marginRight: 20}}></div>
                    <div style={{display: 'inline-block', width:200, height: 100,backgroundColor: '#77e2a2', marginRight: 20}}></div>
                    <div style={{display: 'inline-block', width:200, height: 100,backgroundColor: '#77e2a2', marginRight: 20}}></div>
                </div>
            </div>
            <div style={{height: 200, backgroundColor: '#00ffc457', marginBottom: 20}}>4</div>
            <div style={{height: 200, backgroundColor: '#77e2a2', marginBottom: 20}}>5</div>
            <div style={{height: 200, backgroundColor: '#f3c8b0', marginBottom: 20}}>6</div>
        </div>
    )
}

export default Touch;
