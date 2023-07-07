import ElectronWindowService from "../ElectronWindowService"


import {ipcMain, Menu,} from "electron"
import IPCRoutes from "../../shared/enums/IPCRoutes"
import AbstractSingleton from "../../shared/AbstractSingleton"


export default class ContextMenuListener extends AbstractSingleton {
	#menus = new Map()

	constructor() {
		super()
		ipcMain.on(IPCRoutes.REGISTER_CONTEXT_MENU, this.#registerContextMenu.bind(this))
		ipcMain.on(IPCRoutes.DESTROY_CONTEXT_MENU, this.#destroyContextMenu.bind(this))
		ipcMain.on(IPCRoutes.OPEN_CONTEXT_MENU, this.#openContextMenu.bind(this))
	}

	#mapMenu(e, parent) {
		return Array.isArray(e.submenu) ? e.submenu.map(s => {
			if (s.id == null)
				return s
			const newData = {...s}
			if (Array.isArray(s.submenu))
				newData.submenu = this.#mapMenu(s, parent)
			else
				newData.click = () => ElectronWindowService.getInstance().window.webContents.send(IPCRoutes.CONTEXT_MENU_CALLBACK, {
					id: s.id,
					group: parent
				})

			return newData
		}) : undefined
	}

	#openContextMenu(_, contextID) {
		const context = this.#menus.get(contextID)
		if (context)
			context.popup()
	}

	#destroyContextMenu(_, id) {
		const context = this.#menus.get(id)
		if (!context)
			return
		this.#menus.delete(id)
	}

	#registerContextMenu(_, data) {
		const {template, id} = data
		if (this.#menus.get(id) != null)
			return
		const mapped = template.map(e => {
			if (e.submenu)
				return {...e, submenu: this.#mapMenu(e, id)}
			if (e.id)
				return {
					...e,
					click: () => ElectronWindowService.getInstance().window.webContents.send(IPCRoutes.CONTEXT_MENU_CALLBACK, {
						id: e.id,
						group: id
					})
				}
			return e
		})
		const menu = Menu.buildFromTemplate(mapped)
		this.#menus.set(id, menu)
	}

}