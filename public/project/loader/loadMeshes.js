import {readFromRegistry} from "./FSOperations";

const pathRequire = require('path')
const fs = require('fs')

export default async function loadMeshes(toLoad, projectPath, callback) {
    // const meshes = []
    for (let i in toLoad) {
        const m = toLoad[i]
        const fileData = await readFromRegistry(m, projectPath)
        if (fileData) {
            const parsed = JSON.parse(fileData)
            parsed.id = m
            callback(parsed)
            // meshes.push(parsed)
        }
    }


}