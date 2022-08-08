const {ipcMain} = require("electron");


module.exports = function windowLifeCycle(id, window, onClose, openWindow) {
    function maximize() {
        if (window.isMaximized())
            return
        window.maximize()
    }

    function minimize() {
        window.minimize()
    }

    openWindow()
    window.webContents.executeJavaScript(`sessionStorage.setItem("electronWindowID", "${id}"); `)
        .then(() => {
            window.webContents.reload()
            window.on("ready-to-show", () => window.show())
        })
    ipcMain.on("minimize" + id, minimize)
    ipcMain.on("maximize" + id, maximize)
    ipcMain.once("close" + id, () => {
        ipcMain.removeListener("maximize" + id, maximize)
        ipcMain.removeListener("minimize" + id, minimize)

        onClose()
    })
}