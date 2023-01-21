import createEnv from "./utils/create-env";
import ProjectController from "./libs/ProjectController";
import {AngleBackends} from "./static/ANGLE_BACKENDS";
import SETTINGS_PATH from "./static/SETTINGS_PATH";

const {BrowserWindow, app} = require("electron")
const fs = require("fs")
const os = require("os")
const path = require("path")

const DEFAULT = {
    graphicsBackend: AngleBackends.VULKAN,
    vsync: true,
    maxMemory: 16384
}

function main() {
    let settingsFile = DEFAULT
    if (fs.existsSync(os.homedir() + path.sep + SETTINGS_PATH)) {
        try {
            settingsFile = {...DEFAULT, ...JSON.parse(fs.readFileSync(os.homedir() + path.sep + SETTINGS_PATH).toString())}
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