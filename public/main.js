const {app, BrowserWindow} = require('electron')

const path = require('path')
const isDev = require('electron-is-dev')

require('@electron/remote/main').initialize()

app.commandLine.appendSwitch('enable-unsafe-webgpu') // WEB GPU
function createWindow() {
    const win = new BrowserWindow({

       show: false,
        title: "Projection Engine",
        protocol: 'file:',
        webPreferences: {
            webSecurity: false,
            enableRemoteModule: true,
            nodeIntegration: true,
            contextIsolation: false,
            nativeWindowOpen: true,
            nodeIntegrationInWorker: true,

        },
        autoHideMenuBar: true,
        icon: __dirname + '/L.png',
        darkTheme: true
    })
    win.maximize();
    win.show();
    win.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join($dirname, '../build/index.html')}`
    )
}

app.on("ready", createWindow)
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})