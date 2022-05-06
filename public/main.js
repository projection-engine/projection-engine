import EventsWrapper from "./events/EventsWrapper";
const {app, BrowserWindow, ipcMain, ipcRenderer} = require('electron');

if (require('electron-squirrel-startup')) {
    // eslint-disable-line global-require
    app.quit();
}

const createWindow = () => {
    const {session} = require('electron')

    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                'Content-Security-Policy': [`default-src * 'self' data: blob: file: 'unsafe-inline' 'unsafe-eval'; script-src * 'self' data: blob: file: 'unsafe-inline' 'unsafe-eval'; connect-src * 'self' data: blob: file: 'unsafe-inline' 'unsafe-eval'; img-src * 'self' data: blob: file: data: blob: 'unsafe-inline'; frame-src * 'self' data: blob: file:; style-src * 'self' data: blob: file: 'unsafe-inline';`]
            }
        })
    })

    const mainWindow = new BrowserWindow({

        width: 1024,
        height: 768,
        frame: false,
        webPreferences: {
            webSecurity: false,
            enableRemoteModule: true,
            nodeIntegration: true,
            contextIsolation: false,
            nativeWindowOpen: true,
            nodeIntegrationInWorker: true,

        },
        autoHideMenuBar: true
    });

    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);


    const wrapper = new EventsWrapper(mainWindow)
    wrapper.listen()
};

app.on('ready', createWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});


