import s from './SignRecognizeText.module.css'
import PositiveEmoji from '../../assets/images/PositiveEmoji.png'
import NeutralEmoji from '../../assets/images/NeutralEmoji.png'
import NegativeEmoji from '../../assets/images/NegativeEmoji.png'
import {useClipboard} from "@mantine/hooks";
import {App} from "antd";
import {SLTVizualizer} from "../SLTVizualizer/SLTVizualizer";
import {H5} from "@salutejs/plasma-web";
import React from "react";
import classNames from 'classnames'

export const SignRecognizeText = (props) => {
    const {message} = App.useApp();
    const clipboard = useClipboard({timeout: 1000});
    return (
        <div className={classNames(s.container, props.isClosing ? s.close: "")}>
            <div style={{borderRight: '1px solid #4F4F53', height: "100%", display: 'flex', justifyItems: 'center', alignItems: 'center', padding: '10px 20px', boxSizing: 'border-box'}}>
                <SLTVizualizer playing={true}/>
            </div>

            <div style={{color: 'rgba(255, 255, 255, 0.85)', height: '100%', display: 'flex', flexDirection: 'column', gap: '0px', padding: '10px 0', boxSizing: 'border-box'}}>
                <H5>Распознанные жесты</H5>
                <div className={s.text}>
                    {
                        props.signRecognizeText.map(sign => {
                            return sign.type === 0 ?
                                <p className={s.notRecognize}>{sign.text}</p> :
                                <p className={s.recognize}>{sign.text}</p>
                        })
                    }
                </div>
            </div>

        </div>

    )
}
