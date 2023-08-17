import './App.css';
import {HashRouter, Route, Routes} from "react-router-dom";
import WelcomeLayout from "./components/WelcomeLayout";
import {LoadPage} from "./pages/LoadPage";
import {MenuPage} from "./pages/MenuPage";
import {OnlineConferencePage} from "./pages/OnlineConferencePage";
import {ServiceSubtitlesPage} from "./pages/ServiceSubtitlesPage";
import {ConversationPage} from "./pages/ConversationPage";
import {MicrophoneSubtitlesPage} from "./pages/MicrophoneSubtitlesPage";
const {ipcRenderer} = window.require("electron");
function MyApp(props) {
    console.log("MyAPP")
    return (
        <div className="App">
            <HashRouter>
                <Routes>
                    <Route path='/' element={<WelcomeLayout/>}>
                        <Route index element={<LoadPage/>}/>
                        <Route path='menu' element={<MenuPage/>}/>
                        <Route path='onlineconf' element={<OnlineConferencePage/>}/>
                        <Route path='conversation' element={<ConversationPage/>}/>
                        <Route path='micsubs' element={<MicrophoneSubtitlesPage/>}/>
                        <Route path='servicesubs' element={<ServiceSubtitlesPage/>}/>

                        {/*<Route path='note' element={<NotePage/>}/>*/}
                        {/*<Route path='edit' element={<EditNotePage/>}/>*/}
                        {/*<Route path='folder' element={<FolderPage/>}/>*/}

                        {/*<Route path='network/note/:noteID' element={<NetworkNotePage/>}/>*/}
                        {/*<Route path='network/edit/:noteID' element={<EditNetworkNotePage/>}/>*/}
                        {/*<Route path='network/folder' element={<NetworkFolderPage/>}/>*/}

                    </Route>
                </Routes>
            </HashRouter>
        </div>
    );
}

export default MyApp;
