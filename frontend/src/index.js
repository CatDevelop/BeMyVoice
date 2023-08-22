import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import MyApp from './App';
import {App, ConfigProvider, theme} from "antd";
import {Provider} from "react-redux";
import store from "./store";
import {SSRProvider} from "@salutejs/plasma-web";
import {GlobalStyle} from "./components/GlobalStyle";
import {MantineProvider} from "@mantine/core";

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

    return (
        <ConfigProvider theme={{algorithm: theme.darkAlgorithm}}>
            <MantineProvider theme={{colorScheme: 'dark'}}>
                <App className={"darkTheme"}>
                    <MyApp/>
                </App>
                <GlobalStyle/>
            </MantineProvider>
        </ConfigProvider>
    )
}
