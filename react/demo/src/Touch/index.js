import React, { useState, useEffect, useRef } from 'react';

function sleep(delay) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, delay);
    })
}

function Touch() {
    const ref = useRef(null);
    useEffect(() => {
        // 设置touchmove，为了禁用部分方向的默认事件
        ref.current.addEventListener('touchmove', onTouchMove, { passive: true });
        ref.current.addEventListener('contextmenu', onContextMenu, { passive: true });
        return () => {
            ref.current.removeEventListener('touchmove', onTouchMove, { passive: true });
            ref.current.removeEventListener('contextmenu', onContextMenu, { passive: true });
        };
    }, [])
    function onContextMenu(e) {
        console.time();
        let index = 0;
        for (let i = 0; i< 1000000000; i++) {
            index++;
        }
        console.timeEnd();
        // e.preventDefault();
    }
    function onTouchMove(e) {
        console.time();
        let index = 0;
        for (let i = 0; i< 100000000; i++) {
            index++;
        }
        // e.preventDefault();
        console.timeEnd();
    }
    return (
        // touchAction:'pan-x'
        <div style={{height: 500, padding: '20px', overflow: 'auto',color: '#fff', fontSize: 38, textAlign: 'center'}} ref={ref}>
            <div style={{height: 200, backgroundColor: 'red', marginBottom: 20}}>1</div>
            <div style={{height: 200, backgroundColor: '#25b25e', marginBottom: 20}}>2</div>
            <div style={{height: 200, backgroundColor: '#ff6000', marginBottom: 20, overflow:'auto'}}>
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
