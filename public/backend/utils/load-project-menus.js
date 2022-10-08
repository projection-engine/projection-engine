import WINDOW_FRAME_MENU from "../../../src/static/WINDOW_FRAME_MENU";

const {Menu} = require("electron")


export default function loadProjectMenus(window) {
    const mapped = WINDOW_FRAME_MENU.map(e => ({
        ...e,
        submenu: e.submenu.map(s => {
            if (s.id == null)
                return s
            return {
                ...s,
                click: () => window.webContents.send(s.id)
            }
        })
    }))
    const menu = Menu.buildFromTemplate(mapped)
    Menu.setApplicationMenu(menu)

}