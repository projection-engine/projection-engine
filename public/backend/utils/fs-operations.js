import PROJECT_FOLDER_STRUCTURE from "shared-resources/PROJECT_FOLDER_STRUCTURE";
import readdir from "shared-resources/backend/utils/readdir";
import lstat from "shared-resources/backend/utils/lstat";
import readFile from "shared-resources/backend/utils/read-file";
import FILE_TYPES from "shared-resources/FILE_TYPES";


const pathRequire = require("path")
const fs = require("fs")

export async function fromDirectory(startPath, extension) {
    if (!fs.existsSync(startPath)) return []
    let res = []
    let files = (await readdir(startPath))[1]
    for (let i = 0; i < files.length; i++) {
        const filename = pathRequire.join(startPath, files[i])
        const stat = (await lstat(filename))[1]
        if (stat.isDirectory) res.push(...(await fromDirectory(filename, extension)))
        else if (filename.indexOf(extension) >= 0) res.push(files[i])
    }
    return res
}


export async function readFromRegistry(fileID, projectPath) {
    return new Promise(async resolve => {
        const lookUpTable = (await readFile(pathRequire.resolve(projectPath + pathRequire.sep + PROJECT_FOLDER_STRUCTURE.REGISTRY + pathRequire.sep + fileID + FILE_TYPES.REGISTRY)))[1]
        if (lookUpTable) {
            const fileData = (await readFile(projectPath + pathRequire.sep + "assets" + pathRequire.sep + JSON.parse(lookUpTable).path))[1]
            if (fileData) resolve(fileData)
            else resolve(null)
        } else resolve(null)
    })
}

export async function readRegistry(pathName) {
    return new Promise(resolve => {
        fs.readdir(pathName, (e, res) => {
            if (!e) {
                Promise.all(res.map(f => {
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
                })).then(registryFiles => {
                    resolve(registryFiles
                        .filter(f => f !== undefined))
                })
            } else resolve([])
        })
    })
}
