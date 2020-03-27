import React, { useEffect } from 'react';
import 'dplayer/dist/DPlayer.min.css';
import DPlayer from 'dplayer';
import './style.css';
import flv from '../../../assets/webpack/06-webpack源码【瑞客论坛 www.ruike1.com】.flv';
export default function Play() {
    useEffect(() => {
        const dp = new DPlayer({
            container: document.getElementById('paly'),
            video: {
                url: flv,
                type: 'flv'
            },
        });
    }, [])
    return <div id="paly">
        paly
    </div>
};