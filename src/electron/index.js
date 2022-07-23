const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const Window = require("./lib/Window.js")
const {FSEvents} = require("./events/file-system/fs-essentials")
const FS = require("./events/file-system/fs-utils")
const openHomeWindow = require("./lib/open-home-window");

require('electron-reload')(__dirname, {
    electron: path.join(__dirname, '../node_modules', '.bin', 'electron'),
    awaitWriteFinish: true
});

const createWindow = () => {
    openHomeWindow()
    FSEvents()
    FS()
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
