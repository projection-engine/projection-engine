import createEnv from "./utils/create-env";
import ProjectController from "./libs/ProjectController";
import {AngleBackends} from "./static/ANGLE_BACKENDS";
import SETTINGS_PATH from "./static/SETTINGS_PATH";
import DEFAULT_GLOBAL_SETTINGS from "./static/DEFAULT_GLOBAL_SETTINGS";

const {BrowserWindow, app} = require("electron")
const fs = require("fs")
const os = require("os")
const path = require("path")

function main() {
    let settingsFile = DEFAULT_GLOBAL_SETTINGS
    if (fs.existsSync(os.homedir() + path.sep + SETTINGS_PATH)) {
        try {
            settingsFile = {...settingsFile, ...JSON.parse(fs.readFileSync(os.homedir() + path.sep + SETTINGS_PATH).toString())}
        } catch (err) {
            console.error(err)
        }
    }


    app.commandLine.appendSwitch('js-flags', '--max-old-space-size=' + settingsFile.maxMemory);
    app.commandLine.appendSwitch('use-angle', settingsFile.graphicsBackend);

    if (!settingsFile.vsync)
        app.commandLine.appendSwitch("--disable-frame-rate-limit");

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
}

main()