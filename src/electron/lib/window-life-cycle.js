const {ipcMain} = require("electron");

module.exports = function windowLifeCycle(id, window, onClose, openWindow) {
    openWindow()
    window.webContents.executeJavaScript(`sessionStorage.setItem("electronWindowID", "${id}"); `)
        .then(() => {
            window.webContents.reload()
            window.on("ready-to-show", () => window.show())
        })


    ipcMain.on("minimize" + id, () => window.minimize())
    ipcMain.on("maximize" + id, () => {
        if (window.isMaximized()) {
            // window.unmaximize()
            return
        }
        window.maximize()
    })
    ipcMain.once("close" + id, onClose)
}