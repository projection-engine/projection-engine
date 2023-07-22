import ElectronWindowService from "../ElectronWindowService"
import SETTINGS_PATH from "../static/SETTINGS_PATH"
import DEFAULT_GLOBAL_SETTINGS from "../static/DEFAULT_GLOBAL_SETTINGS"

import {app, dialog, ipcMain} from "electron"
import * as os from "os"
import * as fs from "fs"
import * as pathRequire from "path"
import IPCRoutes from "../../shared/enums/IPCRoutes"
import FileImporterUtil from "./FileImporterUtil"
import AbstractSingleton from "../../shared/AbstractSingleton"
import FileSystemUtil from "./FileSystemUtil"


export default class IPCListener extends AbstractSingleton {
	constructor() {
		super()
		ipcMain.on("reload", this.#reload.bind(this))
		ipcMain.on(IPCRoutes.LOAD_PROJECT_METADATA, this.#loadProjectMetadata.bind(this))
		ipcMain.on(IPCRoutes.READ_FILE, this.#readFile.bind(this))
		ipcMain.on(IPCRoutes.SET_PROJECT_CONTEXT, this.#setProjectContext.bind(this))
		ipcMain.on(IPCRoutes.FILE_DIALOG, this.#fileDialog.bind(this))
		ipcMain.on(IPCRoutes.OPEN_WINDOW, this.#openWindow.bind(this))
		ipcMain.on("minimize", this.#minimize.bind(this))
		ipcMain.on("maximize", this.#maximize.bind(this))
		ipcMain.on("close", this.#close.bind(this))
		ipcMain.on(IPCRoutes.OPEN_SELECTION, this.#openSelection.bind(this))
		ipcMain.on(IPCRoutes.RESOLVE_NAME, this.#resolveName.bind(this))
		ipcMain.on(IPCRoutes.UPDATE_REG, this.#updateRegistry.bind(this))
		ipcMain.on(IPCRoutes.CLOSE_EDITOR, this.#openProjectWindow.bind(this))
		ipcMain.on(IPCRoutes.GET_GLOBAL_SETTINGS, this.#getGlobalSettings.bind(this))
		ipcMain.on(IPCRoutes.UPDATE_GLOBAL_SETTINGS, this.#updateGlobalSettings.bind(this))
		ipcMain.on(IPCRoutes.CREATE_REG, this.#createRegistry.bind(this))
		ipcMain.on(IPCRoutes.REFRESH_CONTENT_BROWSER, this.#refreshContentBrowser.bind(this))
		ipcMain.on(IPCRoutes.READ_REGISTRY, this.#readRegistry.bind(this))
		ipcMain.on(IPCRoutes.STORE_UPDATE, this.#storeUpdate.bind(this))
	}

	#openProjectWindow() {
		const electronInstance = ElectronWindowService.getInstance()
		electronInstance.openProjectWindow()
	}

	#reload() {
		const electronInstance = ElectronWindowService.getInstance()
		electronInstance.closeSubWindows()
		electronInstance.bindEssentialResources(electronInstance.pathToProject).catch(console.error)
	}

	#storeUpdate(ev, data) {
		try {
			const instance = ElectronWindowService.getInstance()
			const window = instance.findWindow(ev.sender.id)
			if (window === instance.window)
				for (let i = 0; i < instance.windows.length; i++) {
					instance.windows[i].electronWindow.webContents.send(IPCRoutes.STORE_UPDATE, data)
				}
			else
				instance.window.webContents.send(IPCRoutes.STORE_UPDATE, data)
		} catch (err) {
			console.error(err)
		}
	}

	#maximize(ev) {
		const window = ElectronWindowService.getInstance().findWindow(ev.sender.id)
		if (!window) return

		if (!window.isMaximized())
			window.maximize()
		else
			window.unmaximize()
	}

	#close(ev) {
		const window = ElectronWindowService.getInstance().findWindow(ev.sender.id)
		if (!window) return

		if (window === ElectronWindowService.getInstance().window) {
			ElectronWindowService.getInstance().closeSubWindows()
			app.quit()
		} else
			window.destroy()
	}

	#minimize(ev) {
		const window = ElectronWindowService.getInstance().findWindow(ev.sender.id)
		if (!window) return
		window.minimize()
	}

	#openWindow(_, {windowSettings, type}) {
		ElectronWindowService.getInstance().addWindow(windowSettings || {}, type)
	}

	async #getGlobalSettings(ev) {
		try {
			const file = await fs.promises.readFile(os.homedir() + pathRequire.sep + SETTINGS_PATH)
			if (file)
				ev.sender.send(IPCRoutes.GET_GLOBAL_SETTINGS, JSON.parse(file.toString()))
			else
				ev.sender.send(IPCRoutes.GET_GLOBAL_SETTINGS, DEFAULT_GLOBAL_SETTINGS)
		} catch (err) {
			console.error(err)
			ev.sender.send(IPCRoutes.GET_GLOBAL_SETTINGS, DEFAULT_GLOBAL_SETTINGS)
		}
	}

	#setProjectContext(_, pathToProject) {
		ElectronWindowService.getInstance().bindEssentialResources(pathToProject).catch(console.error)
	}

	async #updateGlobalSettings(_, data) {
		try {
			const result = await dialog.showMessageBox(ElectronWindowService.getInstance().window, {
				"type": "question",
				"title": "Reload necessary to apply changes",
				"message": "Are you sure?",
				"buttons": [
					"Yes",
					"No"
				]
			})
			if (result.response !== 0)
				return
			ElectronWindowService.getInstance().closeSubWindows()
			await fs.promises.writeFile(os.homedir() + pathRequire.sep + SETTINGS_PATH, JSON.stringify(data)).catch(console.error)
			app.relaunch()
			app.quit()
		} catch (err) {
			console.error(err)
			app.relaunch()
			app.quit()
		}
	}

	async #openSelection() {
		const {canceled, filePaths} = await dialog.showOpenDialog({
			properties: ["openDirectory"]
		})
		ElectronWindowService.getInstance().window.webContents.send(IPCRoutes.OPEN_SELECTION, canceled ? null : filePaths[0])
	}

	async #readFile(event, {pathName, type, listenID}) {
		event.sender.send(IPCRoutes.READ_FILE + listenID, await FileSystemUtil.readTypedFile(pathName, type))
	}

	#resolveName(event, {ext, path, listenID}) {
		let n = path + ext
		let it = 0
		while (fs.existsSync(ElectronWindowService.getInstance().pathToAssets + pathRequire.sep + n)) {
			n = path + `-${it}` + ext
			it++
		}

		event.sender.send(IPCRoutes.RESOLVE_NAME + listenID, n)
	}

	async #updateRegistry(_, {id, data}) {
		ElectronWindowService.getInstance().registry[id] = data
		await FileSystemUtil.updateRegistry()
	}

	async #createRegistry(event, data) {
		await FileSystemUtil.createRegistryEntry(data.id, data.path)
		event.sender.send(IPCRoutes.CREATE_REG + data.listenID)
	}

	#loadProjectMetadata(event) {
		event.sender.send(IPCRoutes.LOAD_PROJECT_METADATA, ElectronWindowService.getInstance().metadata)
	}

	async #fileDialog(ev, {listenID, currentDirectory}) {
		const properties = <("openFile" | "multiSelections")[]>["openFile", "multiSelections"]
		const result = await dialog.showOpenDialog({
			properties,
			filters: [{name: "Assets", extensions: ["bin", "jpg", "png", "jpeg", "gltf", "fbx", "glb", "dae"]}]
		})
		const filesImported = result.filePaths || []
		if (!result.canceled && result.filePaths.length > 0)
			await FileImporterUtil.importFiles(result.filePaths, ElectronWindowService.getInstance().pathToAssets + pathRequire.sep + currentDirectory)

		ev.sender.send(IPCRoutes.FILE_DIALOG + listenID, {filesImported})
	}

	async #refreshContentBrowser(event, {listenID}) {
		event.sender.send(IPCRoutes.REFRESH_CONTENT_BROWSER + listenID, await FileSystemUtil.refreshContentBrowser())
	}

	#readRegistry(event, {listenID}) {
		event.sender.send(IPCRoutes.READ_REGISTRY + listenID, ElectronWindowService.getInstance().registry)
	}
}