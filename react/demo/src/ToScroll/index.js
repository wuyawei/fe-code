import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SwipeAction, List } from 'antd-mobile';
import BScroll from 'better-scroll';
import './index.scss';
function ToScroll() {
    const [data, setData] = useState([]);
    const [isPullUpLoad, setIsPullUpLoad] = useState(false)
    const fetchData = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                setData(data => data.concat([Math.random()]))
                resolve()
            }, 2000)
        })
    };
    // useEffect(() => {
    //     const scroll = new BScroll('.wrapper', {
    //         scrollY: true,
    //         pullUpLoad: {
    //             threshold: 50
    //         },
    //         click: true,
    //         useTransition:false // 解决ios bug
    //     });
    //     setTimeout(() => {
    //         scroll.refresh();
    //     }, 0)
    //     scroll.on('pullingUp', async () => {
    //         setIsPullUpLoad(true);
    //         await fetchData();
    //         scroll.finishPullUp();
    //         scroll.refresh();
    //         setIsPullUpLoad(false);
    //     })
    // }, []);
    
    const dataRef = useRef(data)
    useEffect(() => {
        const total = 100000;
        const reFrame = (_data) => {
            if (dataRef.current !== _data) return;
            if (_data.length > total) return;
            window.requestAnimationFrame(() => {
                setData([..._data, ...new Array(20).fill('')])
                reFrame([..._data, ...new Array(20).fill('')])
            })
        }
        dataRef.current = data;
        reFrame(data)
    }, [data])
    return (
        <div className='wrapper'>
            {
                data.map((v, i) => <List.Item
                    extra="More"
                    arrow="horizontal"
                    key={i}
                    onClick={e => console.log(e)}
                    >
                    {i}
                    </List.Item>)
            }
            {/* <div className='wrapper-box'>
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
            </div> */}
        </div>
    )
}

export default ToScroll;