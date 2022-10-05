const {BrowserWindow, ipcMain, screen, Menu} = require("electron")
const Window = require("../EntryPointController")
const path = require("path");
const ROUTES = require("../../../src/static/ROUTES");

const windowLifeCycle = require("../utils/window-life-cycle");
const loadMetadata = require("../utils/level-loader/load-metadata");

const getBasePath = require("../utils/get-base-path");
const os = require("os");
const RELATIVE_LOGO_PATH = "../APP_LOGO.png"
const settingsWindow = require("./SettingsWindowController");
const loadLevel = require("../libs/level-loader");
const cleanUpRegistry = require("../utils/level-loader/clean-up-registry");

const OPEN_PROJECTS = require("../../../src/static/OPEN_PROJECTS");
const fs = require("fs");

const loadProjectMenus = require("../utils/load-project-menus");

module.exports = function ProjectWindow(handleClose, data) {
    const primaryDisplay = screen.getPrimaryDisplay()
    const {width, height} = primaryDisplay.workAreaSize
    let firstTime = false
    let settingsWindowIsOpen = false
    const window = new BrowserWindow({
        width: width * .75,
        height: height * .75,

        darkTheme: true,
        webPreferences: {

            webSecurity: false,
            enableRemoteModule: true,
            nodeIntegration: true,
            contextIsolation: false,
            nativeWindowOpen: true,
            nodeIntegrationInWorker: true
        },

        icon: path.resolve(__dirname, RELATIVE_LOGO_PATH)
    });

    window.openDevTools({mode: "detach"})
    window.on("close", () => updateCache(data.id, false, () => handleClose()))
    updateCache(data.id, true)

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
        if (settingsWindowIsOpen)
            return

        settingsWindowIsOpen = true
        settingsWindow(data.id, window, settingsData, () => settingsWindowIsOpen = false)
    })


    windowLifeCycle(
        data.id,
        window,
        () => {
            updateCache(
                data.id,
                false,
                () => {
                    window.close()
                    handleClose()
                }
            )
        },
        async () => {
            try {

                await window.loadFile(Window.project, {})
                loadProjectMenus(window)
            } catch (error) {
                console.error(error)
                handleClose()
            }
        }
    )

    return window
}

function updateCache(id, add, callback) {
    try {
        const cacheFilePath = getBasePath(os, path) + path.sep + OPEN_PROJECTS
        fs.readFile(cacheFilePath, (err, buffer) => {
            let currentFile = []
            if (!err) {
                try {
                    currentFile = JSON.parse(buffer.toString())
                } catch (error) {
                    currentFile = []
                }
            }
            if (!Array.isArray(currentFile))
                currentFile = []

            if (add) {
                currentFile = currentFile.filter(e => e !== id)
                currentFile.push(id)
            } else
                currentFile = currentFile.filter(e => e !== id)
            fs.writeFile(cacheFilePath, JSON.stringify(currentFile), () => {
                if (callback)
                    callback()
            })
        })
    } catch (error) {
        console.error(error)
    }
}