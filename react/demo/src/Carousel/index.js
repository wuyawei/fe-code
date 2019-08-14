import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './index.scss';

function useTouchMove(carouselRef, startTouchRef) {
    function onTouchMove(e) {
        // 限制垂直方向上的滚动
        const y = Math.abs(e.touches[0].pageY - startTouchRef.current.startY);
        const x = Math.abs(e.touches[0].pageX - startTouchRef.current.startX);
        if (y < x) {
            e.preventDefault();
        }
    }

    useEffect(() => {
        // 设置touchmove，为了禁用部分方向的默认事件
        carouselRef.current.addEventListener('touchmove', onTouchMove, { passive: false });
        return () => {
            carouselRef.current.removeEventListener('touchmove', onTouchMove, { passive: false });
        };
    }, [carouselRef, onTouchMove]);
}

function Carousel(props) {
    const { width = 6.9, height = 6.63, afterChange } = props;
    const carouselRef = useRef(null);
    const startTouchRef = useRef({ startX: 0, startY: 0 }); // 保存触摸坐标

    // 处理TouchMove事件，左右滑动时禁止纵向滚动
    useTouchMove(carouselRef, startTouchRef);

    const [active, setActive] = useState(0); // 当前展示
    const [prev, setPrev] = useState(''); // 上一张
    const [next, setNext] = useState(1); // 下一张
    const [direction, setDirection] = useState('left'); // 滑动方向
    function handleSwipe(endX) {
        // 左滑右滑设置走马灯动画
        if (endX - startTouchRef.current.startX > 30) {
            if (active === 0) {
                return;
            }
            setActive(active - 1);
            setPrev(active);
            setNext(active - 2);
            setDirection('right');
        } else if (endX - startTouchRef.current.startX < -30) {
            if (active === props.children.length - 1) {
                return;
            }
            setActive(active + 1);
            setPrev(active);
            setNext(active + 2);
            setDirection('left');
        }
    }
    function onTouchStart(e) {
        // 保存初始位置
        startTouchRef.current = { startX: e.touches[0].pageX, startY: e.touches[0].pageY };
    }
    function onTouchEnd(e) {
        // 离开时，设置动画
        handleSwipe(e.changedTouches[0].pageX);
    }
    afterChange && afterChange(active);
    return (
        <div className='kool-carousel' onTouchEnd={onTouchEnd} onTouchStart={onTouchStart} ref={carouselRef}>
            <div className='kool-carousel-item-wrapper' style={{ width: `${width}rem`, height: `${height}rem` }}>
                {props.children.map((carousel, i) => (
                    <div
                        className={
                            `kool-carousel-item
                            ${prev === i && 'prev-'+direction}
                            ${active === i && 'active-'+direction}
                            ${next === i && 'next-'+direction}`}
                        key={i}
                    >
                        {carousel}
                    </div>
                ))}
            </div>
            <div className='kool-carousel-slider-wrapper'>
                {props.children.map((v, i) => (
                    <div className={`kool-carousel-slider-item ${active === i && 'active'}`} key={i}></div>
                ))}
            </div>
        </div>
    );
}

Carousel.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    children: PropTypes.node,
    afterChange: PropTypes.func
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