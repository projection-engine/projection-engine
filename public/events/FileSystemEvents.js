import {v4 as uuidv4} from "uuid";
import glTF from "../project/glTF/glTF";
import {readRegistry} from "../project/loader/FSOperations";
import loader from "../project/loader/loader";

const {dialog, ipcMain} = require('electron')
const fs = require('fs')
const path = require('path')
const si = require("systeminformation");



export default function FileSystemEvents() {
    ipcMain.on('read-file', async (event, {pathName, type, listenID}) => {
        const result = await new Promise(resolve => {
            fs.readFile(path.resolve(pathName), (e, res) => {
                try {
                    let d = type === 'buffer' ? res : (res ? res.toString() : undefined)
                    resolve(type === 'json' && d ? JSON.parse(d) : d)
                } catch (e) {
                    resolve()
                }
            })
        })
        event.sender.send('read-file-' + listenID, result)
    })

    ipcMain.on('open-file-dialog', (ev, {listenID}) => {
        const properties = ['openFile', 'multiSelections']
        dialog.showOpenDialog({
            properties, filters: [{name: 'Assets', extensions: ['jpg', 'png', 'jpeg', 'gltf', 'hdri']}]
        })
            .then(result => {
                if (!result.canceled)
                    ev.sender.send('dialog-response-' + listenID, result.filePaths)
                else
                    ev.sender.send('dialog-response-' + listenID, [])
            })
            .catch(err => console.log(err))
    })

    ipcMain.on('get-current-load', async (event) => {
        const load = await si.currentLoad()
        event.sender.send('current-load', load)
    })

    ipcMain.on('read-registry', async (event, {pathName, listenID}) => {
        const result = await readRegistry(pathName)
        event.sender.send('read-registry-' + listenID, result)
    })

    ipcMain.on('import-gltf', async (event, {filePath, newRoot, options, projectPath, fileName, listenID}) => {
        fs.readFile(path.resolve(filePath), async (e, data) => {
            if (!e) {
                const file = data.toString()
                await glTF(newRoot, fileName, projectPath, file, options, filePath)
                event.sender.send('import-gltf-' + listenID, undefined)
            } else event.sender.send('import-gltf-' + listenID, undefined)
        })
    })
    ipcMain.on('load-project', async (event, {projectPath, projectID, listenID}) => {
        await loader(projectPath, projectID, listenID, event.sender)
    })
}