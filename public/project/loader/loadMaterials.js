import {readFromRegistry} from "./FSOperations";

const pathRequire = require('path')
const fs = require('fs')


export default async function loadMaterials(toLoad, projectPath) {
    const result = []
    for (let i in toLoad) {
        const m = toLoad[i]
        const fileData = await readFromRegistry(m, projectPath)
        if (fileData) {
            try {
                const fileParsed = JSON.parse(fileData)
                if (Object.keys(fileParsed).length > 0)
                    result.push({
                        result: fileParsed.response, id: m
                    })
            } catch (e) {
            }
        }
    }
    return result
}