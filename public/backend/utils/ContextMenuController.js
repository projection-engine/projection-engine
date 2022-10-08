import ROUTES from "../../../src/static/ROUTES";

const {Menu, ipcMain} = require("electron")

function mapMenu(window, e) {
    return Array.isArray(e.submenu) ? e.submenu.map(s => {
        console.log(s.id)
        if (s.id == null)
            return s
        const newData = {...s}
        if (Array.isArray(s.submenu))
            newData.submenu = mapMenu(window, s)
        else
            newData.click = () => {
                console.log("clicked", s.id)
                window.webContents.send(s.id)
            }
        return newData
    }) : undefined
}

export default class ContextMenuController {

    #menus = new Map()

    constructor(window, id) {

        ipcMain.on(
            ROUTES.REGISTER_CONTEXT_MENU + id,
            (event, data) => {
                const {template, id} = data

                if (this.#menus.get(id) != null)
                    return
                const mapped = template.map(e => {
                    if (e.submenu)
                        return {...e, submenu: mapMenu(window, e)}
                    if (e.id)
                        return {...e, click: () => window.webContents.send(e.id)}
                    return e
                })
                const menu = Menu.buildFromTemplate(mapped)
                this.#menus.set(id, menu)
            }
        )
        ipcMain.on(
            ROUTES.DESTROY_CONTEXT_MENU + id,
            (event, id) => {
                const context = this.#menus.get(id)
                if (!context)
                    return
                this.#menus.delete(id)
            }
        )

        ipcMain.on(
            ROUTES.OPEN_CONTEXT_MENU + id,
            (event, contextID) => {
                const context = this.#menus.get(contextID)
                if (context)
                    context.popup()
            }
        )
    }
}