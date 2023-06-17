import {ipcMain} from "electron"
import WindowController from "../libs/WindowController"

import Events from "../libs/Events"

import IPCRoutes from "../../contants/IPCRoutes"

export default function initializeListeners() {
	ipcMain.on("reload", () => {
		WindowController.closeSubWindows()
		WindowController.bindEssentialResources(WindowController.pathToProject).catch()
	})

	ipcMain.on(IPCRoutes.LOAD_PROJECT_METADATA, Events.loadProjectMetadata)
	ipcMain.on(IPCRoutes.READ_FILE, Events.readFile)
	ipcMain.on(IPCRoutes.SET_PROJECT_CONTEXT, Events.setProjectContext)
	ipcMain.on(IPCRoutes.FILE_DIALOG, Events.fileDialog)
	ipcMain.on(IPCRoutes.OPEN_WINDOW, Events.openWindow)
	ipcMain.on("minimize", Events.minimize)
	ipcMain.on("maximize", Events.maximize)
	ipcMain.on("close", Events.close)
	ipcMain.on(IPCRoutes.OPEN_SELECTION, Events.openSelection)
	ipcMain.on(IPCRoutes.RESOLVE_NAME, Events.resolveName)
	ipcMain.on(IPCRoutes.UPDATE_REG, Events.updateRegistry)
	ipcMain.on(IPCRoutes.CLOSE_EDITOR, () => WindowController.openProjectWindow())
	ipcMain.on(IPCRoutes.GET_GLOBAL_SETTINGS, Events.getGlobalSettings)
	ipcMain.on(IPCRoutes.UPDATE_GLOBAL_SETTINGS, Events.updateGlobalSettings)
	ipcMain.on(IPCRoutes.CREATE_REG, Events.createRegistry)
	ipcMain.on(IPCRoutes.REFRESH_CONTENT_BROWSER, Events.refreshContentBrowser)
	ipcMain.on(IPCRoutes.READ_REGISTRY, Events.readRegistry)

	ipcMain.on(IPCRoutes.STORE_UPDATE, Events.storeUpdate)
}