const {app, BrowserWindow, ipcMain, shell,globalShortcut , dialog } = require('electron');
const path = require('path');
const fs = require("fs");
const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS} = require('electron-devtools-installer');

if (require('electron-squirrel-startup')) {
    app.quit();
}

ipcMain.on('voice_dubbing', (event, arg) => {
    console.log("voice_dubbing")
    const pythonProcess = spawn('python', [path.join(__dirname, 'voice_dubbing.py'), [arg.voice, arg.text]]);
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

    mainWindow.webContents.on("will-navigate", function(event, url) {
        event.preventDefault();
        shell.openExternal(url);
    });

    mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
    installExtension(REDUX_DEVTOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));
    createWindow()}
)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0)
        createWindow();
});
