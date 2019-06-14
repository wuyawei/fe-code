import { Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';

function useMousePostion () {
    const [position, setPosition] = useState({x:0, y:0});

    function handlePosition(e) {
        setPosition({x: e.clientX, y: e.clientX});
        console.log(`现在的坐标是---> x: ${e.clientX}; y: ${e.clientX}`)
    }

    useEffect(() => {
        document.addEventListener('mousemove', handlePosition);
        document.title = `x: ${position.x}; y: ${position.y}`;

        return () => {
            document.removeEventListener('mousemove', handlePosition);
        }
    }, [position]);

    return position;
}

function About() {
    const {x, y} = useMousePostion();
    return (
        <div>
            <h2>about</h2>
            <Link to="/">about</Link>
            <div>{`现在的坐标是---> x: ${x}; y: ${y}`}</div>
        </div>
    )
}
export default About;