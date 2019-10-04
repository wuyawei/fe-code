import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SwipeAction, List } from 'antd-mobile';
import BScroll from 'better-scroll';
import './index.scss';
function ToScroll() {
    const [data, setData] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    const [isPullUpLoad, setIsPullUpLoad] = useState(false)
    const fetchData = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                setData(data => data.concat([Math.random()]))
                resolve()
            }, 2000)
        })
    };
    useEffect(() => {
        const scroll = new BScroll('.wrapper', {
            scrollY: true,
            pullUpLoad: {
                threshold: 50
            },
            click: true,
            useTransition:false // 解决ios bug
        });
        setTimeout(() => {
            scroll.refresh();
        }, 0)
        scroll.on('pullingUp', async () => {
            setIsPullUpLoad(true);
            await fetchData();
            scroll.finishPullUp();
            scroll.refresh();
            setIsPullUpLoad(false);
        })
    }, []);
    return (
        <div className='wrapper'>
            <div className='wrapper-box'>
                {
                    data.map((v, i) => (
                        <SwipeAction
                            style={{ backgroundColor: 'gray' }}
                            autoClose
                            right={[
                            {
                                text: 'Cancel',
                                onPress: () => console.log('cancel'),
                                style: { backgroundColor: '#ddd', color: 'white' },
                            },
                            {
                                text: 'Delete',
                                onPress: () => console.log('delete'),
                                style: { backgroundColor: '#F4333C', color: 'white' },
                            },
                            ]}
                            key={i}
                        >
                            <List.Item
                            extra="More"
                            arrow="horizontal"
                            onClick={e => console.log(e)}
                            >
                            {v}
                            </List.Item>
                    </SwipeAction>))
                }
                <div className="pullup-wrapper">
                    {
                        !isPullUpLoad ?
                        <div className="before-trigger">
                            <span className="pullup-txt">上拉加载更多</span>
                        </div>
                        : <div className="after-trigger">
                            <span className="pullup-txt">Loading...</span>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default ToScroll;