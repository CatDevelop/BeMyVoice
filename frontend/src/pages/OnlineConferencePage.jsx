import s from './Pages.module.css'
import {Link, useNavigate} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import classNames from "classnames";
import {BackgroundDots} from "../components/Dots/BackgroundDots";
import {Breadcrumb, Modal, Select, Space, Form} from "antd";
import {H4, H5} from "@salutejs/plasma-web";
import {useInterval} from "@mantine/hooks";
import {Badge} from "@mantine/core";
import {RecognizeHistory} from "../components/RecognizeHistory/RecognizeHistory";
import {SignRecognizeText} from "../components/SignRecognizeText/SignRecognizeText";
import {WebCamera} from "../components/WebCamera/WebCamera";
import io from "socket.io-client";
import {useSubtitles} from "../hooks/use-subtitles";
import {getServicesSubtitle} from "../store/slices/recognitionsSlice";
import {useDispatch} from "react-redux";

const {ipcRenderer} = window.require("electron");


export const OnlineConferencePage = (props) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [signRecognizeText, setSignRecognizeText] = useState([])
    const [settingsIsOpen, setSettingsIsOpen] = useState(false)
    const [isClosing, setIsClosing] = useState(false)

    const historyRec = useSubtitles();

    const videoRef = useRef(null);

    const socket = io('ws://localhost:5000', {
        'reconnection': true,
        'reconnectionDelay': 500,
        'reconnectionAttempts': 5
    });

    socket.on("connect", () => {
        console.log("Connected to server");
    });

    socket.on("disconnect", () => {
        console.log("Disconnect");
        socket.emit("test_event", "Custom data from Electron client");
    });

    socket.on("send_not_normalize_text", (text) => {
        setSignRecognizeText([...signRecognizeText, {text, type: 0}])
    });

    socket.on("send_normalize_text", (text) => {
        if (signRecognizeText.length > 0)
            setSignRecognizeText([...signRecognizeText.filter(e => e.type !== 0), {text, type: 1}])
        else
            setSignRecognizeText([...signRecognizeText, {text, type: 1}])

        ipcRenderer.send('voice_dubbing', {
            text: text,
            voice: localStorage.getItem('BeMyVoiceDubbingVoice') || 'Nec_24000'
        });
    });

    let videoElement;

    async function startWebcam() {

        try {
            const stream = await navigator.mediaDevices.getUserMedia({video: {facingMode: "user"}});
            videoElement.srcObject = stream;

            videoElement.addEventListener('play', () => {
                setInterval(() => {
                    canvas.width = videoElement.videoWidth;
                    canvas.height = videoElement.videoHeight;
                    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
                    const image = canvas.toDataURL('image/jpeg');
                    socket.emit("data", image);
                }, 30); // Отправка каждый кадр (30 кадров в секунду)
            });
        } catch (error) {
            console.error('Error accessing webcam:', error);
        }
    }

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');


    const intervalMenu = useInterval(() => {
        navigate('/menu');
        intervalMenu.stop()
    }, 800)

    const getSubtitles = () => dispatch(getServicesSubtitle())

    useEffect(() => {
        socket.emit("test", '123');
        videoElement = document.getElementById('webcam');
        ipcRenderer.send('start_voice_recognization_server');


        ipcRenderer.send('start_back_server');
        dispatch(getServicesSubtitle())
        setInterval(getSubtitles, 6000);
    }, []);


    const stroke = <span className={s.stroke} style={{animationPlayState: props.playing ? 'running' : 'paused'}}></span>

    const setVoiceSetting = (v) => {
        localStorage.setItem("BeMyVoiceDubbingVoice", v)
    }

    startWebcam();

    return (
        <div className={s.welcomePage}>
            <div className={s.mainContainer}>
                <BackgroundDots/>
                <div style={{display: 'flex', flexDirection: 'column', gap: "40px"}}>
                    <div className={classNames(s.onlineConferenceLogo)}>
                        <svg width="100" height="100" viewBox="0 0 172 172" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M33.5137 13.6223C38.6547 13.6223 46.5517 14.9473 46.5517 22.8973C46.5517 25.1763 45.3857 27.9323 43.4247 29.0453C47.0817 30.5293 48.8837 33.3913 48.8837 37.1543C48.8837 45.3693 41.5167 47.3833 34.6267 47.3833H21.6947C19.9987 47.3833 18.5677 46.1113 18.5677 44.5743V16.4313C18.5677 14.8413 19.9987 13.6223 21.6947 13.6223H33.5137ZM33.5137 18.8693H24.7157V27.0843H33.6727C37.2767 27.0843 40.4567 25.8653 40.4567 22.8973C40.4567 19.4523 36.1637 18.8693 33.5137 18.8693ZM36.1637 32.3313H24.7157V42.1363H34.6267C38.4427 42.1363 42.6297 41.3413 42.6297 37.1543C42.6297 33.9213 39.7677 32.3313 36.1637 32.3313ZM66.9844 42.6663C68.9984 42.6663 71.0654 42.1363 72.7614 40.8113C75.9944 37.8963 79.7044 41.9243 76.7364 44.7333C74.2454 47.1183 70.6414 47.9663 67.1434 47.9133C58.8224 47.9133 53.1514 42.4543 53.1514 34.5043C53.1514 25.8123 58.5044 19.8763 66.9844 19.8763C75.4644 19.8763 80.2344 25.4413 80.2874 33.6563C80.2874 35.4053 79.9694 36.8363 76.9484 36.8363H59.2994C60.2534 40.2813 63.2214 42.6663 66.9844 42.6663ZM67.0374 25.1233C62.9034 25.1233 59.9884 27.9323 59.2464 32.1193H74.6694C74.2984 27.9323 72.0194 25.1233 67.0374 25.1233ZM90.8948 13.6223C91.9018 13.6223 92.9618 14.2053 93.5978 15.2123L104.675 32.5433L115.699 15.1593C116.388 14.0993 117.501 13.6223 118.508 13.6223C120.045 13.6223 121.476 14.6823 121.476 16.5903V44.6273C121.476 46.4823 119.833 47.3833 118.349 47.3833C116.812 47.3833 115.328 46.4823 115.328 44.6273V26.7663L107.431 39.1153C106.848 40.1753 105.735 40.6523 104.675 40.6523C103.615 40.6523 102.396 40.0163 101.813 38.9563L94.0218 26.8193V44.6273C94.0218 46.4823 92.4318 47.3833 90.9478 47.3833C89.4108 47.3833 87.8738 46.4823 87.8738 44.6273V16.6433C87.8738 14.7883 89.3578 13.6223 90.8948 13.6223ZM151.832 20.4063C153.634 20.4063 155.33 22.2613 154.588 24.3813L139.112 54.7503C138.423 56.0753 137.257 56.9233 136.038 56.9233C134.183 56.9233 132.487 54.8563 133.547 52.7363L137.575 44.7863L127.134 24.5933C126.18 22.4733 127.982 20.4063 129.89 20.4063C131.003 20.4063 132.169 21.2013 132.699 22.3143L140.861 38.2673L149.023 22.2613C149.5 21.1483 150.56 20.4063 151.832 20.4063ZM17.1437 56.5443C16.1897 54.3183 18.2037 52.6223 20.1117 52.6223C21.3837 52.6223 22.2847 53.0463 22.8677 54.2653L34.5277 76.6313L45.9757 54.3713C46.5587 53.2583 47.5657 52.6223 48.6787 52.6223C50.5867 52.6223 52.7597 54.3183 51.4877 56.8093L37.2837 84.7403C36.7007 85.7473 35.6407 86.3833 34.5277 86.3833C33.3617 86.3833 32.2487 85.8533 31.6657 84.6343L17.1437 56.5443ZM66.5186 58.8763C74.9986 58.8763 80.6166 64.6003 80.6166 73.0273C80.5106 81.3483 74.8396 86.9133 66.5186 86.9133C58.1976 86.9133 52.5266 81.3483 52.4206 73.0273C52.4206 64.6003 58.0916 58.8763 66.5186 58.8763ZM66.5186 81.6133C71.2886 81.6133 74.4156 78.1153 74.4156 73.0273C74.4156 67.8333 71.2886 64.1763 66.5186 64.1763C61.7486 64.1763 58.6216 67.8333 58.6216 73.0273C58.6216 78.1153 61.7486 81.6133 66.5186 81.6133ZM90.7276 55.4313C90.7276 57.2333 89.1376 58.0813 87.6536 58.0813C86.0636 58.0813 84.5796 57.2333 84.5796 55.4313V54.7423C84.5796 52.9403 86.0636 52.0923 87.6536 52.0923C89.1376 52.0923 90.7276 52.9403 90.7276 54.7423V55.4313ZM84.6326 62.0033C84.6326 60.3073 86.2226 59.4063 87.6536 59.4063C89.1376 59.4063 90.6746 60.3073 90.6746 61.9503V83.7863C90.6746 85.5353 89.1376 86.3833 87.6536 86.3833C86.2226 86.3833 84.6326 85.5353 84.6326 83.7863V62.0033ZM114.426 66.6673C112.783 64.7593 110.451 64.0703 108.331 64.0703C103.667 64.0703 100.593 67.5683 100.593 72.9743C100.593 78.2213 103.773 81.6663 108.543 81.6663C110.663 81.6663 112.995 80.9773 114.691 79.2813C117.765 76.1543 121.422 79.7583 118.772 82.6733C116.016 85.6943 112.306 86.9133 108.49 86.9133C100.063 86.9133 94.4984 81.3483 94.4984 73.0273C94.4984 64.4413 100.01 58.8763 108.331 58.8763C112.2 58.8763 115.539 59.8833 118.401 63.1693C120.998 66.1373 116.864 69.5293 114.426 66.6673ZM137.168 81.6663C139.182 81.6663 141.249 81.1363 142.945 79.8113C146.178 76.8963 149.888 80.9243 146.92 83.7333C144.429 86.1183 140.825 86.9663 137.327 86.9133C129.006 86.9133 123.335 81.4543 123.335 73.5043C123.335 64.8123 128.688 58.8763 137.168 58.8763C145.648 58.8763 150.418 64.4413 150.471 72.6563C150.471 74.4053 150.153 75.8363 147.132 75.8363H129.483C130.437 79.2813 133.405 81.6663 137.168 81.6663ZM137.221 64.1233C133.087 64.1233 130.172 66.9323 129.43 71.1193H144.853C144.482 66.9323 142.203 64.1233 137.221 64.1233Z"
                                fill="white"/>
                            <rect x="3" y="3" width="165.805" height="94" rx="12" stroke="white" strokeWidth="6"/>
                        </svg>
                        <div></div>
                    </div>

                    <div className={classNames(s.pageHeader1, isClosing ? s.closePage : '')}>
                        <Breadcrumb
                            style={{zIndex: 200}}
                            className={s.breadcrumbs}
                            separator={<div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                alignContent: 'center'
                            }}><H4>/</H4></div>}
                            items={[
                                {
                                    title: <div style={{zIndex: 200, color: 'white'}}><Link onClick={() => {
                                        setIsClosing(true)
                                        intervalMenu.start()
                                    }}><H5 style={{color: 'rgba(255, 255, 255, 0.85)'}}>Меню</H5></Link></div>,
                                },
                                {
                                    title: <div style={{zIndex: 200, height: '22px', padding: '1px 0px'}}>
                                        <Space style={{height: "24px"}}>
                                            <H5>Онлайн конференция</H5>
                                            <div onClick={() => setSettingsIsOpen(true)}>
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                     xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M10.3246 4.31731C10.751 2.5609 13.249 2.5609 13.6754 4.31731C13.9508 5.45193 15.2507 5.99038 16.2478 5.38285C17.7913 4.44239 19.5576 6.2087 18.6172 7.75218C18.0096 8.74925 18.5481 10.0492 19.6827 10.3246C21.4391 10.751 21.4391 13.249 19.6827 13.6754C18.5481 13.9508 18.0096 15.2507 18.6172 16.2478C19.5576 17.7913 17.7913 19.5576 16.2478 18.6172C15.2507 18.0096 13.9508 18.5481 13.6754 19.6827C13.249 21.4391 10.751 21.4391 10.3246 19.6827C10.0492 18.5481 8.74926 18.0096 7.75219 18.6172C6.2087 19.5576 4.44239 17.7913 5.38285 16.2478C5.99038 15.2507 5.45193 13.9508 4.31731 13.6754C2.5609 13.249 2.5609 10.751 4.31731 10.3246C5.45193 10.0492 5.99037 8.74926 5.38285 7.75218C4.44239 6.2087 6.2087 4.44239 7.75219 5.38285C8.74926 5.99037 10.0492 5.45193 10.3246 4.31731Z"
                                                        stroke="white" strokeWidth="2" strokeLinecap="round"
                                                        strokeLinejoin="round"/>
                                                    <path
                                                        d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
                                                        stroke="white" strokeWidth="2" strokeLinecap="round"
                                                        strokeLinejoin="round"/>
                                                </svg>
                                            </div>
                                        </Space>
                                    </div>,
                                }
                            ]}
                        />

                        <Space align={'end'} size={1} direction={'vertical'} className={s.badges}>
                            <Badge style={{zIndex: 200, position: 'relative', textTransform: 'unset'}} size="md"
                                   radius="xs">Устройство ввода: Динамики компьютера</Badge>
                            <Badge style={{zIndex: 200, position: 'relative', textTransform: 'unset'}} size="md"
                                   radius="xs">Устройство вывода: Виртуальный микрофон (BeMyVoice)</Badge>
                        </Space>
                    </div>


                    <div className={s.onlineConferenceContainer}>
                        <div className={s.onlineConferenceLeftContainer}>
                            {/*<video id="webcam" autoPlay></video>*/}
                            <WebCamera isClosing={isClosing} ref={videoRef}/>
                            <SignRecognizeText isClosing={isClosing} signRecognizeText={signRecognizeText}/>
                        </div>
                        <RecognizeHistory history={historyRec.recognitions} isClosing={isClosing}/>
                    </div>
                </div>
            </div>

            <Modal
                open={settingsIsOpen}
                title="Настройки"
                // onOk={handleOk}
                onCancel={()=>setSettingsIsOpen(false)}
                footer={[]}
            >
                <Form.Item label="Выберите голос">

                <Select
                    defaultValue={localStorage.getItem('BeMyVoiceDubbingVoice') || 'Nec_24000'}
                    style={{width: 120}}
                    onChange={setVoiceSetting}
                    title={"Выберите голос"}
                    options={[
                        {value: 'Nec_24000', label: 'Наталья'},
                        {value: 'Bys_24000', label: 'Борис'},
                        {value: 'May_24000', label: 'Марфа'},
                        {value: 'Tur_24000', label: 'Тарас'},
                        {value: 'Ost_24000', label: 'Александра'},
                        {value: 'Pon_24000', label: 'Сергей'}
                    ]}
                />
                </Form.Item>
            </Modal>
        </div>
    )
}
