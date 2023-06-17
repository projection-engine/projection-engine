import readTypedFile from "../utils/read-typed-file"
import AssimpService from "./assimp/AssimpService"
import {BrowserWindow, ipcMain, screen} from "electron"
import * as fs from "fs"
import * as path from "path"
import createWindow from "../utils/create-window"
import ContextMenuListener from "./ContextMenuListener"
import IPCRoutes from "../../shared/IPCRoutes"
import FileTypes from "../../shared/FileTypes"
import Folders from "../../shared/Folders"
import WindowTypes from "../../shared/WindowTypes"
import FileSystemListener from "./FileSystemListener";
import Events from "./Events";
import AbstractSingleton from "../../shared/AbstractSingleton";

enum CurrentWindow {
    EDITOR,
    PROJECTS,
    NONE
}

export default class ElectronWindowService extends AbstractSingleton{
	id?: string
	pathToProject?: string
	pathToAssets?: string
	pathToPreviews?: string
	pathToRegistry?: string
	registry: { [key: string]: RegistryFile } = {}
	window: BrowserWindow
	windows: BrowserWindow[] = []
	metadata: MutableObject
	preventAppClosing = false
	#currentWindow = CurrentWindow.NONE

	constructor() {
		super();
		const log = console.error
		console.error = (...msg) => {
			log(...msg)
			this.window.webContents.send("console", msg)
		}
		FileSystemListener.get()
		AssimpService.get()
		this.#initializeListeners()

		const primaryDisplay = screen.getPrimaryDisplay()
		const {width, height} = primaryDisplay.workAreaSize

		this.window = createWindow({width: width / 2, height: height / 2})
		ContextMenuListener.get()
		this.openProjectWindow()
	}

	static getInstance(): ElectronWindowService{
		return super.get<ElectronWindowService>()
	}

	#initializeListeners(){
		ipcMain.on("reload", () => {
			this.closeSubWindows()
			this.bindEssentialResources(this.pathToProject).catch()
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
		ipcMain.on(IPCRoutes.CLOSE_EDITOR, () => this.openProjectWindow())
		ipcMain.on(IPCRoutes.GET_GLOBAL_SETTINGS, Events.getGlobalSettings)
		ipcMain.on(IPCRoutes.UPDATE_GLOBAL_SETTINGS, Events.updateGlobalSettings)
		ipcMain.on(IPCRoutes.CREATE_REG, Events.createRegistry)
		ipcMain.on(IPCRoutes.REFRESH_CONTENT_BROWSER, Events.refreshContentBrowser)
		ipcMain.on(IPCRoutes.READ_REGISTRY, Events.readRegistry)
		ipcMain.on(IPCRoutes.STORE_UPDATE, Events.storeUpdate)
	}

	findWindow(id) {
		try {
			if (this.window.webContents.id === id)
				return this.window

			for (let i = 0; i < this.windows.length; i++) {
				try {
					const window = this.windows[i]
					if (window.webContents.id === id)
						return window
				} catch (err) {
					this.windows.splice(i, 1)
					console.log(err)
				}
			}
		} catch (err) {
			return
		}
	}

	closeSubWindows() {
		this.windows.forEach(w => {
			try {
				w?.destroy?.()
			} catch (err) {
				console.log(err)
			}
		})
		this.windows = []
	}

	openEditorWindow() {
		if (this.#currentWindow === CurrentWindow.EDITOR)
			return

		this.closeSubWindows()
		this.#currentWindow = CurrentWindow.EDITOR
		this.window.loadFile(path.join(__dirname, "./editor-window.html"))
			.then(() => {
				this.window.webContents.send(IPCRoutes.EDITOR_INITIALIZATION, this.pathToProject)
				this.window.maximize()
			})
			.catch()
	}

	addWindow(settings: MutableObject, type: number) {
		switch (type) {
		case WindowTypes.PREFERENCES: {
			const primaryDisplay = screen.getPrimaryDisplay()
			const {width, height} = primaryDisplay.workAreaSize
			const newWindow = createWindow({
				width: width * (settings.widthScale || 1),
				height: height * (settings.heightScale || 1)
			}, true)
			newWindow.loadFile(path.join(__dirname, "./preferences-window.html")).catch()
			newWindow.on("close", () => {
				try {
					this.windows = this.windows.filter(w => w !== newWindow)
				} catch (err) {
					console.log(err)
				}
			})
			this.windows.push(newWindow)
			break
		}
		}
	}

	openProjectWindow() {
		if (this.#currentWindow === CurrentWindow.PROJECTS)
			return

		this.closeSubWindows()
		this.window.unmaximize()
		const primaryDisplay = screen.getPrimaryDisplay()
		const {width, height} = primaryDisplay.workAreaSize
		this.#currentWindow = CurrentWindow.PROJECTS
		this.window.loadFile(path.join(__dirname, "./project-window.html")).catch()
		this.window.setSize(width / 2, height / 2)

	}

	async bindEssentialResources(pathTo: string) {

		this.pathToRegistry = pathTo + path.sep + FileTypes.REGISTRY
		this.metadata = <MutableObject>await readTypedFile(pathTo + path.sep + FileTypes.PROJECT, "json") || {}
		this.registry = <{
            [key: string]: RegistryFile
        }>await readTypedFile(this.pathToRegistry, "json") || {}
		this.pathToProject = pathTo
		this.id = pathTo.split(path.sep).pop()
		this.pathToAssets = path.resolve(pathTo + path.sep + Folders.ASSETS)
		this.pathToPreviews = path.resolve(pathTo + path.sep + Folders.PREVIEWS)

		Object.entries(this.registry)
			.forEach((param: [string, RegistryFile]) => {
				const exists = fs.existsSync(path.resolve(this.pathToAssets + path.sep + param[1].path))
				if (!exists)
					delete this.registry[param[0]]
			})
		this.#currentWindow = undefined
		this.openEditorWindow()
	}
}