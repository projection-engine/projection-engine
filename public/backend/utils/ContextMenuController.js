import ROUTES from "../../../src/static/ROUTES";

const {Menu, ipcMain} = require("electron")

function mapMenu(window,e) {
    return e.submenu ? e.submenu.map(s => {
        if (s.id == null)
            return s
        const newData = {
            ...s,
            click: () => {
                console.log("clicked")
                window.webContents.send(s.id)
            }
        }
        if (s.submenu != null)
            newData.submenu = mapMenu(s)
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
                console.log(id, template)
                const mapped = template.map(e => ({...e, submenu: mapMenu(window,  e)}))
                const menu = Menu.buildFromTemplate(mapped)
                this.#menus.set(id, menu)
            }
        )
        ipcMain.on(
            ROUTES.DESTROY_CONTEXT_MENU + id,
            (event, id) => {
                console.log(id)
                const context = this.#menus.get(id)
                console.log(context)
                if (!context)
                    return
                this.#menus.delete(id)
            }
        )

        ipcMain.on(
            ROUTES.OPEN_CONTEXT_MENU + id,
            (event, contextID) => {
                console.log("OPENING - " + contextID)
                const context = this.#menus.get(contextID)
                console.log(context)
                if (context)
                    context.popup({browserWindow: window})
            }
        )
    }
}