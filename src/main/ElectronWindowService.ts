import AssimpService from "./libs/assimp/AssimpService"
import {BrowserWindow, dialog, screen} from "electron"
import * as fs from "fs"
import * as path from "path"
import ContextMenuListener from "./libs/ContextMenuListener"
import IPCRoutes from "../shared/enums/IPCRoutes"
import FileTypes from "../shared/enums/FileTypes"
import Folders from "../shared/enums/Folders"
import WindowTypes from "../shared/enums/WindowTypes"
import FileSystemListener from "./libs/FileSystemListener"
import IPCListener from "./libs/IPCListener"
import AbstractSingleton from "../shared/AbstractSingleton"
import FileSystemUtil from "./libs/FileSystemUtil"
import MainLogger from "../shared/logger/MainLogger"

enum CurrentWindow {
    EDITOR,
    PROJECTS,
    NONE
}

export default class ElectronWindowService extends AbstractSingleton {
	readonly RELATIVE_LOGO_PATH = "./APP_LOGO.png"
	id?: string
	pathToProject?: string
	pathToAssets?: string
	pathToPreviews?: string
	pathToRegistry?: string
	registry: { [key: string]: RegistryFile } = {}
	window: BrowserWindow
	windows: { electronWindow: BrowserWindow, type: WindowTypes }[] = []
	metadata: MutableObject
	preventAppClosing = false
	#currentWindow = CurrentWindow.NONE

	constructor() {
		super()
		MainLogger.initialize()
		FileSystemListener.get()
		AssimpService.get()
		IPCListener.get()

		const primaryDisplay = screen.getPrimaryDisplay()
		const {width, height} = primaryDisplay.workAreaSize
		this.window = this.#createWindow({width: width / 2, height: height / 2})
		ContextMenuListener.get()
		this.openProjectWindow()
	}

	static getInstance(): ElectronWindowService {
		return super.get<ElectronWindowService>()
	}

	findWindow(id) {
		try {
			if (this.window.webContents.id === id)
				return this.window
			for (let i = 0; i < this.windows.length; i++) {
				try {
					const window = this.windows[i].electronWindow
					if (window.webContents.id === id)
						return window
				} catch (err) {
					this.windows.splice(i, 1)
					console.error(err)
				}
			}
		} catch (err) {
			console.error(err)
		}
	}

	closeSubWindows() {
		for (let i = 0; i < this.windows.length; i++){
			try {
				this.windows[i].electronWindow.destroy()
			} catch (err) {
				console.error(err)
			}
		}
		this.windows = []
	}


	addWindow(settings: MutableObject, type: number) {
	    try{
			if(type === WindowTypes.PREFERENCES) {
				const existingOne = this.windows.find(w => w.type === type)
				if (existingOne != null) {
					existingOne.electronWindow.show()
					return
				}
				const primaryDisplay = screen.getPrimaryDisplay()
				const {width, height} = primaryDisplay.workAreaSize
				const newWindow = this.#createWindow({
					width: width * (settings.widthScale || 1),
					height: height * (settings.heightScale || 1)
				}, true)
				this.windows.push({electronWindow: newWindow, type})
				newWindow.loadFile(path.join(__dirname, "./preferences-window.html")).catch(console.error)
				newWindow.on("closed", () => {
					try {
						this.windows = this.windows.filter(w => w.type !== type)
					} catch (err) {
						console.error(err)
					}
				})
			}
		}catch (err){
			console.error(err)
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
		this.window.loadFile(path.join(__dirname, "./project-window.html")).catch(console.error)
		this.window.setSize(width / 2, height / 2)
	}

	async bindEssentialResources(pathTo: string) {

		this.pathToRegistry = pathTo + path.sep + FileTypes.REGISTRY
		this.metadata = <MutableObject>await FileSystemUtil.readTypedFile(pathTo + path.sep + FileTypes.PROJECT, "json") || {}
		this.registry = <{
            [key: string]: RegistryFile
        }>await FileSystemUtil.readTypedFile(this.pathToRegistry, "json") || {}
		this.pathToProject = pathTo
		this.id = pathTo.split(path.sep).pop()
		this.pathToAssets = path.resolve(pathTo + path.sep + Folders.ASSETS)
		this.pathToPreviews = path.resolve(pathTo + path.sep + Folders.PREVIEWS)

		const registryEntries = Object.entries(this.registry)
		for (let i = 0; i < registryEntries.length; i++){
			const param: [string, RegistryFile] = registryEntries[i]
			const exists = fs.existsSync(path.resolve(this.pathToAssets + path.sep + param[1].path))
			if (!exists)
				delete this.registry[param[0]]
		}
		this.#currentWindow = undefined
		await this.#openEditorWindow()
	}

	async #openEditorWindow() {
		if (this.#currentWindow === CurrentWindow.EDITOR)
			return

		this.closeSubWindows()
		this.#currentWindow = CurrentWindow.EDITOR
		try {
			await this.window.loadFile(path.join(__dirname, "./editor-window.html"))
		} catch (err) {
			console.error(err)
		}
		this.window.webContents.send(IPCRoutes.EDITOR_INITIALIZATION, this.pathToProject)
		this.window.maximize()
	}

	#createWindow(settings: MutableObject, isChild?: boolean) {
		const window = new BrowserWindow({
			...settings,
			darkTheme: true,
			autoHideMenuBar: true,
			titleBarStyle: "hidden",
			webPreferences: {
				enableBlinkFeatures: "PreciseMemoryInfo",
				webSecurity: false,
				nodeIntegration: true,
				contextIsolation: false,
				nodeIntegrationInWorker: true
			},
			show: false,
			icon: path.resolve(__dirname, this.RELATIVE_LOGO_PATH)
		})

		window.setMenu(null)
		window.once("ready-to-show", () => window.show())
		window.webContents.on("unresponsive", async () => {
			const {response} = await dialog.showMessageBox({
				message: "Application is unresponsive",
				title: "Do you want to try reloading the app?",
				buttons: ["OK", "Cancel"],
				cancelId: 1
			})
			if (response === 0) {
				window.webContents.forcefullyCrashRenderer()
				window.webContents.reload()
			}
		})

		if (process.env.IS_DEV) {
			window.openDevTools(isChild ? undefined : {mode: "detach"})
		}
		return window
	}
}