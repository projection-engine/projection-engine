import {ipcMain} from "electron";
import WindowController from "../libs/WindowController";
import ROUTES from "../static/ROUTES";
import Events from "../libs/Events";

export default function initializeListeners(){
    ipcMain.on("reload", () => {
        WindowController.closeSubWindows()
        WindowController.prepareForUse(WindowController.pathToProject).catch()
    })

    ipcMain.on(ROUTES.LOAD_PROJECT_METADATA, Events.loadProjectMetadata)
    ipcMain.on(ROUTES.READ_FILE, Events.readFile)
    ipcMain.on(ROUTES.SET_PROJECT_CONTEXT, Events.setProjectContext)
    ipcMain.on(ROUTES.FILE_DIALOG, Events.fileDialog)
    ipcMain.on(ROUTES.OPEN_WINDOW, Events.openWindow)
    ipcMain.on("minimize", Events.minimize)
    ipcMain.on("maximize", Events.maximize)
    ipcMain.on("close", Events.close)
    ipcMain.on(ROUTES.OPEN_SELECTION, Events.openSelection)
    ipcMain.on(ROUTES.RESOLVE_NAME, Events.resolveName)
    ipcMain.on(ROUTES.UPDATE_REG, Events.updateRegistry)
    ipcMain.on(ROUTES.CLOSE_EDITOR, () => WindowController.openProjectWindow())
    ipcMain.on(ROUTES.GET_GLOBAL_SETTINGS, Events.getGlobalSettings)
    ipcMain.on(ROUTES.UPDATE_GLOBAL_SETTINGS, Events.updateGlobalSettings)
    ipcMain.on(ROUTES.CREATE_REG, Events.createRegistry)
    ipcMain.on(ROUTES.REFRESH_CONTENT_BROWSER, Events.refreshContentBrowser)
    ipcMain.on(ROUTES.READ_REGISTRY, Events.readRegistry)

    ipcMain.on(ROUTES.STORE_UPDATE, Events.storeUpdate)
}