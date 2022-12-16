import {app, BrowserWindow} from 'electron';
import createEnv from "./utils/create-env";

app.commandLine.appendSwitch('js-flags', '--max-old-space-size=16384');
app.commandLine.appendSwitch('enable-features', 'SharedArrayBuffer');

app.on('ready', createEnv);
app.on('window-all-closed', async () => {
    if (process.platform !== 'darwin')
        app.quit();
});
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0)
        createEnv().catch()
});
