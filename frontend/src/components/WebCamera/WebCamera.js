import s from './WebCamera.module.css'
import PositiveEmoji from '../../assets/images/PositiveEmoji.png'
import NeutralEmoji from '../../assets/images/NeutralEmoji.png'
import NegativeEmoji from '../../assets/images/NegativeEmoji.png'
import {useClipboard, useInterval} from "@mantine/hooks";
import {App, Spin} from "antd";
import {SLTVizualizer} from "../SLTVizualizer/SLTVizualizer";
import {BodyM, H5} from "@salutejs/plasma-web";
import React, {useEffect, useState} from "react";
import Webcam from "react-webcam";
import classNames from 'classnames'

export const WebCamera = (props) => {
    const [seconds, setSeconds] = useState(0);
    const interval = useInterval(() => setSeconds((s) => s + 1), 1000);

    useEffect(() => {
        interval.start();
        return interval.stop;
    }, []);

    let date = new Date(0);
    date.setSeconds(seconds); // specify value for SECONDS here
    let timeStr = date.toISOString().substring(11, 19);

    const videoConstraints = {
        width: 640,
        height: 480,
        facingMode: "user"
    };


    return (
        <div style={{position: "relative"}} className={classNames(s.container, props.isClosing ? s.close : '')}>
            <div className={s.rec}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="8" r="5.5" fill="white" stroke="#E03131" strokeWidth="5"/>
                </svg>
                <BodyM bold >{timeStr}</BodyM>
            </div>

            <Spin style={{
                position: "absolute",
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
            }} />

            <video id="webcam" autoPlay style={{transform: 'scale(-1, 1)'}} className={s.container}></video>

            {/*<Webcam mirrored={true}*/}
            {/*        videoConstraints={videoConstraints}*/}
            {/*        className={s.container}*/}
            {/*        ref={props.ref}*/}
            {/*        id={'mywebcamera'}*/}
            {/*/>*/}
        </div>

    )
}
