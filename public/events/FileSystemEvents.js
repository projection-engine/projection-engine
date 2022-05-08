import glTFImporter from "../utils/gltf/glTFImporter";
import {v4 as uuidv4} from "uuid";

const {BrowserWindow,dialog, ipcMain} = require('electron')
const fs = require('fs')
const path = require('path')
const si = require("systeminformation");

async function readFile(event, {pathName, type}) {
    return await new Promise(resolve => {
        fs.readFile(path.resolve(pathName), (e, res) => {
            try {
                let d = type === 'buffer' ? res : (res ? res.toString() : undefined)
                resolve(type === 'json' && d ? JSON.parse(d) : d)
            } catch (e) {
                resolve()
            }
        })
    })

}
async function createRegistryEntry(pathName, projectPath){
    const fID = uuidv4()
    const pathRe = path.resolve(projectPath + '\\assets\\')
    const p = path.resolve(projectPath + '\\assets\\' + pathName).replace(pathRe, '')

    return new Promise(r => {
        fs.writeFile(
            path.resolve(projectPath + '\\assetsRegistry\\' + fID + `.reg`),
            JSON.stringify({
                id: fID,
                path: p.charAt(0) === '\\' ? p.substring(1, p.length) : p
            }),
            () => {
                r()
            })
    })
}
export default class FileSystemEvents {
    constructor() {
        ipcMain.on('open-file-dialog', (ev, {listenID}) => {
            const properties = ['openFile','multiSelections']
            dialog.showOpenDialog({properties, filters: [{name: 'Assets', extensions: ['jpg', 'png', 'jpeg', 'gltf', 'hdri']}]
            })
                .then(result => {
                    if(!result.canceled)
                        ev.sender.send('dialog-response-'+listenID, result.filePaths)
                    else
                        ev.sender.send('dialog-response-'+listenID, [])
                })
                .catch(err => console.log(err))
        })
        ipcMain.on('get-current-load', async (event) => {
            const load = await si.currentLoad()
            event.sender.send('current-load', load)
        })
        ipcMain.on('read-file', async (event, data) => {
            const result = await readFile(event, data)
            event.sender.send('read-file-' + data.listenID, result)
        })
        ipcMain.on('read-registry', async (event, {pathName, listenID}) => {
            const result = await new Promise(resolve => {
                fs.readdir(pathName, (e, res) => {
                    if (!e) {
                        let promises = res.map(f => {
                            return new Promise(resolve1 => {
                                const registryPath = pathName + f
                                fs.readFile(registryPath, (e, registryFile) => {
                                    if (!e)
                                        try {
                                            resolve1({
                                                ...JSON.parse(registryFile.toString()),
                                                registryPath
                                            })
                                        } catch (e) {
                                            resolve1()
                                        }
                                    else
                                        resolve1()
                                })
                            })
                        })

                        Promise.all(promises).then(registryFiles => {
                            resolve(registryFiles
                                .filter(f => f !== undefined))
                        })
                    } else
                        resolve([])
                })
            })
            event.sender.send('read-registry-' + listenID, result)
        })

        // IMPORT
        ipcMain.on('import-gltf', async (event, {filePath,  newRoot, options, projectPath, fileName, listenID}) => {
            fs.readFile(path.resolve(filePath),async (e, data) => {
                if(!e){
                    const file = data.toString()
                    await glTFImporter(newRoot, file, options, p => createRegistryEntry(p, projectPath), projectPath, filePath, fileName)
                    event.sender.send('import-gltf-' + listenID, undefined)
                }
                else
                    event.sender.send('import-gltf-' + listenID, undefined)
            })
        })
    }
}