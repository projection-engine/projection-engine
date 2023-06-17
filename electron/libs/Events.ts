import readTypedFile from "../utils/read-typed-file"
import importFiles from "../utils/import-files"
import WindowController from "./WindowController"
import resolveFileName from "../utils/resolve-file-name"

import createRegistryEntry from "../utils/create-registry-entry"
import directoryStructure from "../utils/directory-structure"
import parseContentBrowserData from "../utils/parse-content-browser-data"

import SETTINGS_PATH from "../static/SETTINGS_PATH"
import DEFAULT_GLOBAL_SETTINGS from "../static/DEFAULT_GLOBAL_SETTINGS"

import {app, dialog} from "electron"
import * as os from "os"
import * as fs from "fs"
import * as pathRequire from "path"
import IPCRoutes from "../../contants/IPCRoutes"
import Folders from "../../contants/Folders"


export default class Events {
	static storeUpdate(ev, data) {
		try {
			const window = WindowController.findWindow(ev.sender.id)
			if (window === WindowController.window)
				WindowController.windows.forEach(w => {
					try {
						w.webContents.send(IPCRoutes.STORE_UPDATE, data)
					} catch (err) {
						console.log(err)
					}
				})
			else
				WindowController.window.webContents.send(IPCRoutes.STORE_UPDATE, data)
		} catch (err) {
			console.log(err)
		}
	}

	static maximize(ev) {
		const window = WindowController.findWindow(ev.sender.id)
		if (!window) return

		if (!window.isMaximized())
			window.maximize()
		else
			window.unmaximize()
	}

	static close(ev) {
		const window = WindowController.findWindow(ev.sender.id)
		if (!window) return

		if (window === WindowController.window) {
			WindowController.closeSubWindows()
			app.quit()
		} else
			window.destroy()
	}

	static minimize(ev) {
		const window = WindowController.findWindow(ev.sender.id)
		if (!window) return

		window.minimize()
	}

	static openWindow(_, {windowSettings, type}) {
		WindowController.addWindow(windowSettings || {}, type)
	}

	static async getGlobalSettings(ev) {
		try {
			const file = await fs.promises.readFile(os.homedir() + pathRequire.sep + SETTINGS_PATH)
			if (file)
				ev.sender.send(IPCRoutes.GET_GLOBAL_SETTINGS, JSON.parse(file.toString()))
			else
				ev.sender.send(IPCRoutes.GET_GLOBAL_SETTINGS, DEFAULT_GLOBAL_SETTINGS)
		} catch (err) {
			ev.sender.send(IPCRoutes.GET_GLOBAL_SETTINGS, DEFAULT_GLOBAL_SETTINGS)
		}
	}

	static setProjectContext(_, pathToProject) {
		WindowController.bindEssentialResources(pathToProject).catch()
	}

	static async updateGlobalSettings(_, data) {
		try {
			const result = await dialog.showMessageBox(WindowController.window, {
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
			WindowController.closeSubWindows()
			await fs.promises.writeFile(os.homedir() + pathRequire.sep + SETTINGS_PATH, JSON.stringify(data)).catch()
			app.relaunch()
			app.quit()
		} catch (err) {
			app.relaunch()
			app.quit()
		}
	}

	static async openSelection() {
		const {canceled, filePaths} = await dialog.showOpenDialog({
			properties: ["openDirectory"]
		})
		WindowController.window.webContents.send(IPCRoutes.OPEN_SELECTION, canceled ? null : filePaths[0])
	}

	static async readFile(event, {pathName, type, listenID}) {
		event.sender.send(IPCRoutes.READ_FILE + listenID, await readTypedFile(pathName, type))
	}


	static resolveName(event, {ext, path, listenID}) {
		event.sender.send(IPCRoutes.RESOLVE_NAME + listenID, resolveFileName(path, ext))
	}

	static async updateRegistry(event, {id, data}) {
		WindowController.registry[id] = data
		await fs.promises.writeFile(WindowController.pathToRegistry, JSON.stringify(WindowController.registry))
	}

	static async createRegistry(event, data) {
		await createRegistryEntry(data.id, data.path)
		event.sender.send(IPCRoutes.CREATE_REG + data.listenID)
	}


	static loadProjectMetadata(event) {
		event.sender.send(IPCRoutes.LOAD_PROJECT_METADATA, WindowController.metadata)
	}

	static async fileDialog(ev, {listenID, currentDirectory}) {
		const properties = <("openFile" | "multiSelections")[]>["openFile", "multiSelections"]
		const result = await dialog.showOpenDialog({
			properties,
			filters: [{name: "Assets", extensions: ["bin", "jpg", "png", "jpeg", "gltf", "fbx", "glb", "dae"]}]
		})
		const filesImported = result.filePaths || [],
			registryEntries = []
		if (!result.canceled && result.filePaths.length > 0)
			await importFiles(result.filePaths, WindowController.pathToAssets + pathRequire.sep + currentDirectory, registryEntries)

		ev.sender.send(IPCRoutes.FILE_DIALOG + listenID, {filesImported, registryEntries})
	}

	static async refreshContentBrowser(event, {pathName, listenID}) {
		let data = <null | {
            [key: string]: RegistryFile
        }>await readTypedFile(WindowController.pathToRegistry, "json").catch()
		if (!data) {
			event.sender.send(IPCRoutes.REFRESH_CONTENT_BROWSER + listenID, null)
			data = WindowController.registry
		}
		console.error(data)
		try {
			WindowController.registry = data
		} catch (err) {
			console.error(err, data)
		}
		const result = []
		let registryData = Object.values(WindowController.registry)
		const foundIDs = {}
		const pathToAssets = pathName + pathRequire.sep + Folders.ASSETS
		registryData.forEach(d => {
			if (foundIDs[d.id])
				delete WindowController.registry[d.id]
			foundIDs[d.id] = true
			if (!fs.existsSync(pathToAssets + d.path))
				delete WindowController.registry[d.id]
		})
		registryData = Object.values(WindowController.registry)

		try {
			await fs.promises.writeFile(WindowController.pathToRegistry, JSON.stringify(WindowController.registry))
		} catch (error) {
			console.error(error)
		}
		const assetsToParse = await directoryStructure(pathToAssets)
		console.error(registryData.length, pathToAssets, WindowController.pathToRegistry)

		for (let i = 0; i < assetsToParse.length; i++) {
			try {
				const e = await parseContentBrowserData(assetsToParse[i], registryData, pathName)
				if (e && (e.registryID || e.isFolder))
					result.push(e)
			} catch (error) {
				console.error(error)
			}
		}
		event.sender.send(IPCRoutes.REFRESH_CONTENT_BROWSER + listenID, result)
	}

	static readRegistry(event, {listenID}) {
		event.sender.send(IPCRoutes.READ_REGISTRY + listenID, WindowController.registry)
	}
}