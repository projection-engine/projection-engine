import WINDOW_FRAME_MENU from "../../../src/static/WINDOW_FRAME_MENU";

const {Menu, app, dialog} = require("electron")


export default function frameMenuController(window) {
    const mapped = WINDOW_FRAME_MENU.map(e => ({
        ...e,
        submenu: e.submenu.map(s => {
            if (s.id == null)
                return s
            return {
                ...s,
                click: () => {
                    if (s.id === "reload") {
                        dialog.showMessageBox(window, {
                            'type': 'question',
                            'title': 'Reload project',
                            'message': "Are you sure?",
                            'buttons': [
                                'Yes',
                                'No'
                            ]
                        }).then((result) => {
                            if (result.response !== 0)
                                return;
                            app.relaunch()
                            app.exit()
                        })
                        return
                    }
                    window.webContents.send(s.id)
                }
            }
        })
    }))
    const menu = Menu.buildFromTemplate(mapped)
    Menu.setApplicationMenu(menu)

}