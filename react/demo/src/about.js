import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

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
    const [modalIsOpen, setModalIsOpen] = useState(false);
    return (
        <div>
            <h2>about</h2>
            <div>{`现在的坐标是---> x: ${x}; y: ${y}`}</div>
            <button onClick={() => setModalIsOpen(true)}>show Modal</button>
            <Modal
                isOpen={modalIsOpen}
                aria={{
                    labelledby: "heading",
                    describedby: "full_description"
                }}
                shouldCloseOnOverlayClick={false}
                onRequestClose={() => setModalIsOpen(false)}
            >
                <h1 id="heading">Alert</h1>
                <div id="full_description">
                    <p>Description goes here.</p>
                </div>
                <button onClick={() => setModalIsOpen(false)}>hide Modal</button>
            </Modal>
        </div>
    )
}
export default About;