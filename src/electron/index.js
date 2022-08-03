const {app, BrowserWindow} = require('electron');
const WindowManager = require("./lib/WindowManager");

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
