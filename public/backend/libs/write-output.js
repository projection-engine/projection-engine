export default function writeOutput(window) {
    const log = console.log
    const newMethod = (...msg) => {
        log(...msg)
        window.webContents.send("console", msg)
    }

    console.log = newMethod
    console.error = newMethod
}