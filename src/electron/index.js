const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const Window = require("./static/Windows.js")
const {FSEvents} = require("./events/file-system/fs-essentials")
const FS = require("./events/file-system/fs-utils")
const WindowManager = require("./lib/Manager");
const ProjectWindow = require("./lib/project-window")

require('electron-reload')(__dirname, {
    electron: path.join(__dirname, '../node_modules', '.bin', 'electron'),
    awaitWriteFinish: true
});
const manager = new WindowManager()


app.on('ready', () => manager.createWindow());
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        manager.createWindow();
    }
});
