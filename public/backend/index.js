const {app, BrowserWindow} = require('electron');
const FSEvents = require("./libs/file-system");
const HomeWindow = require("./controllers/HomeWindowController");
const getBasePath = require("./utils/get-base-path");
const os = require("os");
const path = require("path");
const OPEN_PROJECTS = require("../../src/static/OPEN_PROJECTS");
const fs = require("fs");

app.commandLine.appendSwitch('enable-features', 'SharedArrayBuffer');
let openProjects = new Map()

async function closeProject(id) {
    return new Promise(resolve => {
        const cacheFilePath = getBasePath(os, path) + path.sep + OPEN_PROJECTS
        fs.readFile(cacheFilePath, (err, buffer) => {
            let currentFile = []
            if (!err)
                currentFile = JSON.parse(buffer.toString())
            else
                currentFile = currentFile.filter(e => e !== id)
            fs.writeFile(cacheFilePath, JSON.stringify(currentFile), () => {
                openProjects.delete(id)
                resolve()
            })
        })
    })
}

async function closeAll() {
    console.trace("-----------------------------------------------------------------")

    const p = []
    openProjects.forEach(d => p.push(closeProject(d)))
    await Promise.all(p)

}

process.on('exit', async () => await closeAll());

function createEnvironment() {
    FSEvents()
    HomeWindow(openProjects)
}

app.on('ready', () => createEnvironment());
app.on('window-all-closed', async () => {
    await closeAll()
    if (process.platform !== 'darwin')
        app.quit();
});
app.on("will-quit", () => closeAll())
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0)
        createEnvironment()
});
