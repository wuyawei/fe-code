import React, { useState, useEffect, useRef } from 'react';
import BScroll from 'better-scroll';
function ToScroll() {
    useEffect(() => {
        const scroll = new BScroll('.wrapper', {
            pullUpLoad: {
                threshold: 50
            }
        });
        setTimeout(() => {
            scroll.refresh();
        }, 0)
        scroll.on('pullingUp', () => {
            console.log('刷新里');
        })
    }, [])
    return (
        <div className='wrapper' style={{height: '500px', overflow: 'auto'}}>
            <ul style={{margin: 0, padding: 0}}>
                {
                    new Array(12).fill('').map((v, i) => <li key={i} style={{margin: 0, padding: 0, lineHeight: '100px', textAlign: 'center', listStyleType: 'none', backgroundColor: 'red', marginBottom: '20px'}}>1</li>)
                }
            </ul>
        </div>
    )
}

export default ToScroll;