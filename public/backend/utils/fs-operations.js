import PROJECT_FOLDER_STRUCTURE from "shared-resources/PROJECT_FOLDER_STRUCTURE";

import readFile from "shared-resources/backend/utils/read-file";
import FILE_TYPES from "shared-resources/FILE_TYPES";
import ProjectMap from "../libs/ProjectMap";


const pathRequire = require("path")
const fs = require("fs")


export async function readFromRegistry(fileID, projectPath) {
    return new Promise(async resolve => {
        const reg = ProjectMap.registry[fileID]
        if (reg) {
            const fileData = (await readFile(projectPath + pathRequire.sep + PROJECT_FOLDER_STRUCTURE.ASSETS + pathRequire.sep + reg.path))[1]
            if (fileData) resolve(fileData)
            else resolve(null)
        } else resolve(null)
    })
}

export async function readRegistry(pathName) {
    const response = []
    try {
        const res = await fs.promises.readdir(pathName)

        for (let i = 0; i < res.length; i++) {
            const f = res[i]
            const registryPath = pathRequire.resolve(pathName + pathRequire.sep + f)
            try {
                const file = await fs.promises.readFile(registryPath)
                response.push({...JSON.parse(file.toString()), registryPath})
            } catch (err) {
            }
        }
    } catch (err) {
        console.error(err)
    }
    return response
}
