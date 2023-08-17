import s from './RecognizeHistory.module.css'
import PositiveEmoji from '../../assets/images/PositiveEmoji.png'
import NeutralEmoji from '../../assets/images/NeutralEmoji.png'
import NegativeEmoji from '../../assets/images/NegativeEmoji.png'
import {useClipboard} from "@mantine/hooks";
import {App, Button} from "antd";
import {H5} from "@salutejs/plasma-web";
import {RecognizeHistoryElement} from "../RecognizeHistoryElement/RecognizeHistoryElement";
import React from "react";
import classNames from 'classnames'

export const RecognizeHistory = (props) => {
    const {message} = App.useApp();
    const clipboard = useClipboard({timeout: 1000});

    const allText = props.history.reduce((text, element) => text += element.text + "\n\n", '')

    return (
        <div className={classNames(s.container, props.isClosing ? s.close : '')}>
            <div className={s.header}>
                <H5 className={s.headerText}>Распознанный текст</H5>
                {
                    clipboard.copied ?
                        <div className={s.copy}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M9.70711 13.2929C9.31658 12.9024 8.68342 12.9024 8.29289 13.2929C7.90237 13.6834 7.90237 14.3166 8.29289 14.7071L9.70711 13.2929ZM11 16L10.2929 16.7071C10.6834 17.0976 11.3166 17.0976 11.7071 16.7071L11 16ZM15.7071 12.7071C16.0976 12.3166 16.0976 11.6834 15.7071 11.2929C15.3166 10.9024 14.6834 10.9024 14.2929 11.2929L15.7071 12.7071ZM18 7V19H20V7H18ZM17 20H7V22H17V20ZM6 19V7H4V19H6ZM7 6H9V4H7V6ZM15 6H17V4H15V6ZM7 20C6.44772 20 6 19.5523 6 19H4C4 20.6569 5.34315 22 7 22V20ZM18 19C18 19.5523 17.5523 20 17 20V22C18.6569 22 20 20.6569 20 19H18ZM20 7C20 5.34315 18.6569 4 17 4V6C17.5523 6 18 6.44772 18 7H20ZM6 7C6 6.44772 6.44772 6 7 6V4C5.34315 4 4 5.34315 4 7H6ZM8.29289 14.7071L10.2929 16.7071L11.7071 15.2929L9.70711 13.2929L8.29289 14.7071ZM11.7071 16.7071L15.7071 12.7071L14.2929 11.2929L10.2929 15.2929L11.7071 16.7071ZM11 4H13V2H11V4ZM13 6H11V8H13V6ZM11 6C10.4477 6 10 5.55228 10 5H8C8 6.65685 9.34315 8 11 8V6ZM14 5C14 5.55228 13.5523 6 13 6V8C14.6569 8 16 6.65685 16 5H14ZM13 4C13.5523 4 14 4.44772 14 5H16C16 3.34315 14.6569 2 13 2V4ZM11 2C9.34315 2 8 3.34315 8 5H10C10 4.44772 10.4477 4 11 4V2Z"
                                    fill="#adadad"/>
                            </svg>
                        </div> :
                        <div className={s.copy} onClick={() => {
                            clipboard.copy(allText)
                            message.success("Текст успешно скопирован")
                        }}>

                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5"
                                    stroke="#adadad" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </div>
                }
            </div>
            <div className={s.elements}>
                {
                    props.history.map((element, index) => {
                        return <RecognizeHistoryElement key={"RecognizeHistoryElement"+index} text={element.text} emotion={element.emotion}/>
                    })
                }
            </div>

        </div>

    )
}
