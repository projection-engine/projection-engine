const {ipcMain, session} = require("electron");


module.exports = function windowLifeCycle(id, window, onClose, openWindow) {
    openWindow()
    window.webContents.executeJavaScript(`sessionStorage.setItem("electronWindowID", "${id}"); `)
        .then(() => {
            window.webContents.reload()
            window.on("ready-to-show", () => window.show())
        })
}