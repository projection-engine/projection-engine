import FILE_TYPES from "../glTF/FILE_TYPES";
import {lstat, readdir, readFile} from "../../events/FSEvents";
import PathSep from "../../PathSep";

const pathRequire = require('path')
const fs = require('fs')

export async function fromDirectory(startPath, extension) {
    if (!fs.existsSync(startPath)) return []
    let res = []
    let files = (await readdir(startPath))[1];
    for (let i = 0; i < files.length; i++) {
        const filename = pathRequire.join(startPath, files[i]);
        const stat = (await lstat(filename))[1];
        if (stat.isDirectory) res.push(...(await fromDirectory(filename, extension)))
        else if (filename.indexOf(extension) >= 0) res.push(files[i])
    }
    return res
}

export async function readFromRegistry(fileID, projectPath) {
    return new Promise(async resolve => {
        const lookUpTable = (await readFile(pathRequire.resolve(projectPath + PathSep.sep + 'assetsRegistry' + PathSep.sep + fileID + FILE_TYPES.REGISTRY)))[1]

        if (lookUpTable) {
            const fileData = (await readFile(projectPath + PathSep.sep + 'assets' +PathSep.sep +  JSON.parse(lookUpTable).path))[1]
            if (fileData) resolve(fileData)
            else resolve(null)
        } else resolve(null)
    })
}

export async function readRegistry(pathName) {
    return new Promise(resolve => {
        fs.readdir(pathName, (e, res) => {
            if (!e) {
                let promises = res.map(f => {
                    return new Promise(resolve1 => {
                        const registryPath = pathName + pathRequire.sep + f
                        fs.readFile(registryPath, (e, registryFile) => {
                            if (!e) try {
                                resolve1({
                                    ...JSON.parse(registryFile.toString()), registryPath
                                })
                            } catch (e) {
                                resolve1()
                            } else resolve1()
                        })
                    })
                })

                Promise.all(promises).then(registryFiles => {
                    resolve(registryFiles
                        .filter(f => f !== undefined))
                })
            } else resolve([])
        })
    })
}