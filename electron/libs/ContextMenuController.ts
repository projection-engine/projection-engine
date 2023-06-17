import WindowController from "./WindowController"


import {ipcMain, Menu,} from "electron"
import IPCRoutes from "../../contants/IPCRoutes"


export default class ContextMenuController {
	static #initialized = false
	static #menus = new Map()

	static initialize() {
		if (ContextMenuController.#initialized)
			return
		ContextMenuController.#initialized = true

		ipcMain.on(
			IPCRoutes.REGISTER_CONTEXT_MENU,
			(event, data) => {
				const {template, id} = data

				if (ContextMenuController.#menus.get(id) != null)
					return
				const mapped = template.map(e => {
					if (e.submenu)
						return {...e, submenu: ContextMenuController.#mapMenu(e, id)}
					if (e.id)
						return {
							...e,
							click: () => WindowController.window.webContents.send(IPCRoutes.CONTEXT_MENU_CALLBACK, {
								id: e.id,
								group: id
							})
						}
					return e
				})
				const menu = Menu.buildFromTemplate(mapped)
				ContextMenuController.#menus.set(id, menu)
			}
		)
		ipcMain.on(
			IPCRoutes.DESTROY_CONTEXT_MENU,
			(event, id) => {
				const context = ContextMenuController.#menus.get(id)
				if (!context)
					return
				ContextMenuController.#menus.delete(id)
			}
		)

		ipcMain.on(
			IPCRoutes.OPEN_CONTEXT_MENU,
			(event, contextID) => {
				const context = ContextMenuController.#menus.get(contextID)
				if (context)
					context.popup()
			}
		)
	}

	static #mapMenu(e, parent) {
		return Array.isArray(e.submenu) ? e.submenu.map(s => {
			if (s.id == null)
				return s
			const newData = {...s}
			if (Array.isArray(s.submenu))
				newData.submenu = ContextMenuController.#mapMenu(s, parent)
			else
				newData.click = () => WindowController.window.webContents.send(IPCRoutes.CONTEXT_MENU_CALLBACK, {
					id: s.id,
					group: parent
				})

			return newData
		}) : undefined
	}

}