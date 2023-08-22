const {app, BrowserWindow, ipcMain, shell, globalShortcut, dialog} = require('electron');
const path = require('path');
const fs = require("fs");
const {default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS} = require('electron-devtools-installer');
const {spawn} = require('child_process');
const {ConnectionBuilder} = require("electron-cgi");

const kill = require('tree-kill');
if (require('electron-squirrel-startup')) {
    app.quit();
}
let recognizationServer;
let backServer;

ipcMain.on('start_voice_recognization_server', (event, arg) => {
    console.log("start_voice_recognization_server", [path.join(__dirname, '../../recognition/SLT_API.py'), '--config_path ' + path.join(__dirname, '../../recognition/config.json')])
    recognizationServer = spawn('python', [path.join(__dirname, '../../recognition/SLT_API.py')]);

    recognizationServer.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    recognizationServer.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });
});

const recordingS = () => {
    backServer.send('recording-services', "rec", (error, resp) => {
        if (error) {
            console.log(error);
            return;
        }
        console.log(resp);
        recordingS()
    });
}

ipcMain.on('start_back_server', (event, arg) => {
    console.log('start_back_server')

    recognizationServer = spawn('dotnet', ['run', '--project', [path.join(__dirname, '../../ElectroneConsole/BEMyVoiceApi')]]);

    // try{
    //     backServer = new ConnectionBuilder()
    //         .connectTo("dotnet", "run", "--project", path.join(__dirname, '../../ElectroneConsole/ElectroneConsole'))
    //         .build();
    //
    //     // recordingS()
    //
    //     // backServer.send('recording-services', "rec", (error, resp) => {
    //     //     if (error) {
    //     //         console.log(error);
    //     //         return;
    //     //     }
    //     //     console.log(resp);
    //     //     recordingS()
    //     // });
    //
    //     backServer.send('recognize', "123",(resp) => {
    //         // console.log("recognize", resp)
    //         // console.log("recognize", resp)
    //         const mainWindow = BrowserWindow.fromId(1);
    //         mainWindow.webContents.send("get-services-result-el", resp);
    //     });
    //     //
    //     backServer.on('getres', (resp, er) => {
    //         console.log("getres", 'tr');
    //         // console.log("getres", er);
    //     });
    // } catch (e) {
    //     console.log(e)
    // }



    //     backServer.send('recording-services', (error, resp) => {
    //         if (error) {
    //             console.log(error);
    //             return;
    //         }
    //         console.log(resp);
    //     });
    //
    // backServer.on('getres', (error, resp) => {
    //     if (error) {
    //         console.log(error);
    //         return;
    //     }
    //     console.log(resp);
    // });

    // recordingS()

    // backServer.send('recording-services', (error, resp) => {
    //     if (error) {
    //         console.log(error);
    //         return;
    //     }
    //     backServer.on('get-services-result', (res) => {
    //         console.log(res)
    //         // const mainWindow = BrowserWindow.fromId(1);
    //         // mainWindow.webContents.send("get-services-result-el", res);
    //     });
    // });
})


ipcMain.on('stop_back_server', (event, arg) => {
    backServer?.close();
});

ipcMain.on('stop_voice_recognization_server', (event, arg) => {
    console.log("stop_voice_recognization_server")
    if (recognizationServer)
        recognizationServer.stdin.pause();
    recognizationServer.kill()

});


ipcMain.on('voice_dubbing', (event, arg) => {
    console.log("voice_dubbing", path.join(__dirname, 'voice_dubbing.py'), arg)
    const pythonProcess = spawn('python', [path.join(__dirname, 'voice_dubbing.py'), arg.voice, arg.text]);
});

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        minWidth: 1280,
        minHeight: 720,
        maxWidth: 1920,
        maxHeight: 1080,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
            nodeIntegrationInWorker: true,
            nodeIntegrationInSubFrames: true
        },
    });
    mainWindow.setMenuBarVisibility(false)
    mainWindow.setTitle("BeMyVoice")
    mainWindow.loadURL("http://localhost:3000/");

    mainWindow.webContents.on("will-navigate", function (event, url) {
        event.preventDefault();
        shell.openExternal(url);
    });

    // mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
        installExtension(REDUX_DEVTOOLS)
            .then((name) => console.log(`Added Extension:  ${name}`))
            .catch((err) => console.log('An error occurred: ', err));
        createWindow()
    }
)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0)
        createWindow();
});
