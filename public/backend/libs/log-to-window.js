export default function logToWindow(window) {
    const log = console.error
    console.error = (...msg) => {
        log(...msg)
        window.webContents.send("console", msg)
    }
}