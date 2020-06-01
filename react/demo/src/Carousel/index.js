import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import styles from './index.scss';

function Carousel(props) {
    const { width = 6.9, height = 6.63, autoPlay = false } = props;
    const startTouchRef = useRef({ startX: 0, startY: 0 }); // 保存触摸坐标
    const position = useRef(0); // 当前步进下标
    const startTransform = useRef(0); // 每次滑动要加的初始值
    const time = useRef(null);
    const fontSize = useRef(50);
    useEffect(() => {
        fontSize.current = document.documentElement.style.fontSize.slice(0, -2);
    }, []);
    const [movePosition, setMovePosition] = useState(0);
    const [transition, setTransition] = useState('');
    function onTouchMove(e) {
        // 限制垂直方向上的滚动
        const y = e.touches[0].pageY - startTouchRef.current.startY;
        const x = e.touches[0].pageX - startTouchRef.current.startX;
        if (Math.abs(y) < Math.abs(x)) {
            e.preventDefault();
        }
        setMovePosition(startTransform.current + x/fontSize.current);
        setTransition('ease 0s');
    }
    
    function onTouchEnd(e) {
        document.removeEventListener('touchmove', onTouchMove, { passive: false });
        document.removeEventListener('touchend', onTouchEnd);
        
        position.current = - (Math.round(- position.current + (e.changedTouches[0].clientX - startTouchRef.current.startX) / fontSize.current / width));
        position.current = Math.max(0, Math.min(position.current, props.children.length - 1));
        setMovePosition(- position.current * width);
        setTransition('');
        if (autoPlay) {
            time.current = setTimeout(autoPlayFun, 1000);
        }
    }
    function onTouchStart(e) {
        clearInterval(time.current); // 清除定时器
        // 保存触摸初始位置
        startTouchRef.current = { startX: e.touches[0].pageX, startY: e.touches[0].pageY };
        // translate 初始位置
        startTransform.current = - position.current * width;
        // 处理TouchMove事件，左右滑动时禁止纵向滚动
        document.addEventListener('touchmove', onTouchMove, { passive: false });
        document.addEventListener('touchend', onTouchEnd);
    }

    function autoPlayFun() {
        if (position.current >= props.children.length - 1) {
            position.current = -1;
        }
        position.current ++;
        setMovePosition(- position.current * width);
        time.current = setTimeout(autoPlayFun, 1000);
    }
    useEffect(() => {
        if (autoPlay) {
            time.current = setTimeout(autoPlayFun, 1000);
        }
    }, [autoPlay, autoPlayFun])
    return (
        <div className='my-carousel'>
            <div className='my-carousel-item-wrapper' style={{ width: `${width}rem`, height: `${height}rem` }} onTouchStart={onTouchStart}>
                {props.children.map((carousel, i) => (
                    <div
                        className={
                            `my-carousel-item`}
                        style={{transform: `translate(${movePosition}rem)`, transition: transition}}
                        key={i}
                    >
                        {carousel}
                    </div>
                ))}
            </div>
            <div className='my-carousel-slider-wrapper'>
                {props.children.map((v, i) => (
                    <div className={`my-carousel-slider-item ${position.current === i ? 'active' : ''}`} key={i}></div>
                ))}
            </div>
        </div>
    );
}

Carousel.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    children: PropTypes.node
};

export default function CarouselDemo() {
    const data = ['#ff6000', '#5fc0b8', '#ef7866', '#4a5c96', '#f1cb66'];
    return <Carousel>
        {data.map(v => (
            <div key={v} style={{ width: '100%', height: '100%', backgroundColor: v }}>
                {v}
            </div>
        ))}
    </Carousel>
}