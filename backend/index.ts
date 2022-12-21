import createEnv from "./utils/create-env";
import ProjectController from "./libs/ProjectController";
const {BrowserWindow, app, ipcMain, webContents, dialog, Menu, } = require("electron")

app.commandLine.appendSwitch('js-flags', '--max-old-space-size=16384');
app.commandLine.appendSwitch('enable-features', 'SharedArrayBuffer');

app.on('ready', createEnv);
app.on('window-all-closed', async () => {
    if (process.platform !== 'darwin' && !ProjectController.preventAppClosing)
        app.quit();
    ProjectController.preventAppClosing = false
});
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0)
        createEnv().catch()
});
