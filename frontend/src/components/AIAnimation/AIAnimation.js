import s from './AIAnimation.module.css'
import {useClipboard, useInterval} from "@mantine/hooks";
import {App} from "antd";
import React, {useEffect, useState} from "react";
import AIV from '../../assets/images/AI3.gif'
import classNames from 'classnames'

export const AIAnimation = (props) => {
    const {message} = App.useApp();
    const clipboard = useClipboard({timeout: 1000});
    const [pointCount, setPointCount] = useState(1)
    const interval = useInterval(() => setPointCount((s) => (s + 1)%3), 200);



    useEffect(() => {
        interval.start();
        return interval.stop;
    }, []);

    return (
        <div className={classNames(s.container, props.isClosing ? s.close : "")}>
            <div className={s.card}>
                <div className={s.videoContainer}>
                    <img src={AIV} alt={'AI'} className={s.video}/>

                    <p className={s.salute}>Salute Speech распознаёт текст{pointCount === 0 ? "." : pointCount === 1 ? '..' : '...'}</p>
                    {/*<video id="sampleMovie" muted loop autoPlay={true} width="700" height="700" preload className={s.video}>*/}
                    {/*    <source src={AIV} />*/}
                    {/*</video>*/}
                </div>
            </div>

        </div>

    )
}
