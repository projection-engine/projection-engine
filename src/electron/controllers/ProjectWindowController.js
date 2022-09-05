const {BrowserWindow, ipcMain, screen} = require("electron")
const Window = require("./EntryPointController")
const FRAME_EVENTS = require("../../assets/FRAME_EVENTS")
const path = require("path");
const ROUTES = require("../../assets/ROUTES");
const {v4} = require("uuid");
const windowLifeCycle = require("../utils/window-life-cycle");
const loadMetadata = require("../utils/level-loader/load-metadata");

const getBasePath = require("../utils/get-base-path");
const os = require("os");
const RELATIVE_LOGO_PATH = "../../assets/logo.png"
const settingsWindow = require("./SettingsWindowController");
const loadLevel = require("../libs/level-loader");
const cleanUpRegistry = require("../utils/level-loader/clean-up-registry");

module.exports = function ProjectWindow(handleClose, data) {
    const primaryDisplay = screen.getPrimaryDisplay()
    const {width, height} = primaryDisplay.workAreaSize
    let firstTime = false
    const window = new BrowserWindow({
        width: width / 2,
        height: height / 2,

        frame: false,
        webPreferences: {
            webSecurity: false,
            enableRemoteModule: true,
            nodeIntegration: true,
            contextIsolation: false,
            nativeWindowOpen: true,
            nodeIntegrationInWorker: true
        },
        autoHideMenuBar: true,
        icon: path.resolve(__dirname, RELATIVE_LOGO_PATH)
    });
    ipcMain.on(ROUTES.LOAD_LEVEL + data.id, async (event, pathToLevel) => {
        if (!firstTime) {
            firstTime = true
            cleanUpRegistry(data.id, event.sender)
        }
        loadLevel(event.sender, pathToLevel, data.id).catch(err => console.error(err))
    })
    ipcMain.on(ROUTES.LOAD_PROJECT_METADATA + data.id, async event => {
        event.sender.send(ROUTES.LOAD_PROJECT_METADATA + data.id, await loadMetadata(getBasePath(os, path) + "projects" + path.sep + data.id))
    })
    ipcMain.on(ROUTES.OPEN_SETTINGS + data.id, async (event, settingsData) => {
        settingsWindow(data.id, window, settingsData)
    })
    windowLifeCycle(
        data.id,
        window,
        () => {
            window.close()
            handleClose()
        },
        () => window.loadFile(Window.project).catch(() => handleClose())
    )


}