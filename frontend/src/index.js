import React, {useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import MyApp from './App';
import {App, ConfigProvider, theme} from "antd";
import {Provider, useDispatch} from "react-redux";
import store from "./store";
import {useTheme} from "./hooks/use-theme";
import {setLocalNotes} from "./store/slices/noteSlice";
import {setDirectories, setFilesDir, setFilesFolderDir, setSelectFolderPath} from "./store/slices/localSlice";
import {SSRProvider} from "@salutejs/plasma-web";
import {GlobalStyle} from "./components/GlobalStyle";
import {MantineProvider} from "@mantine/core";

const {ipcRenderer} = window.require("electron");
const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
    <SSRProvider>
        <Provider store={store}>
            <Container/>

        </Provider>

    </SSRProvider>
);
document.body.classList.toggle('darkTheme');

function Container() {
    console.log("CONTAINER")
    const myTheme = useTheme()
    const dispatch = useDispatch()

    useEffect(() => {
        ipcRenderer.on('getFileNamesStartReturn', (event, payload) => {
            console.log("getFileNamesStartReturn", payload)
            dispatch(setDirectories(payload))
            dispatch(setSelectFolderPath(payload.path))
        })

        ipcRenderer.on('getFileNamesReturn', (event, payload) => {
            console.log("getFileNamesReturn", payload)
            dispatch(setDirectories(payload))
        })

        ipcRenderer.on('createFolderResult', (event, content) => {
            ipcRenderer.send('getFileNames');
        })

        ipcRenderer.on('deleteElementResult', (event, content) => {
            ipcRenderer.send('getFileNames');
        })

        ipcRenderer.on('createFileResult', (event, content) => {
            ipcRenderer.send('getFileNames');
        })

        ipcRenderer.on('renameFileResult', (event, content) => {

            ipcRenderer.send('getFileNames');
        })

        ipcRenderer.on('getDirResult', (event, content) => {

            dispatch(setFilesDir(content))
            dispatch(setFilesFolderDir(content))
        })


        ipcRenderer.on('getBlog', (event, content) => {
            dispatch(setLocalNotes(content))
        })

        ipcRenderer.send('getFileNamesStart');
        ipcRenderer.send('getDir');
    }, [])


    return (
        <ConfigProvider theme={{algorithm: theme.darkAlgorithm}}>
            <MantineProvider theme={{colorScheme: 'dark'}}>
                <App className={myTheme.theme === 'dark' ? "darkTheme" : ""}>
                    <MyApp/>
                </App>
                <GlobalStyle/>
            </MantineProvider>

        </ConfigProvider>
    )
}
