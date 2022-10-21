import {readFromRegistry} from "./fs-operations";

export default async function loadLevelMeshes(toLoad, projectPath, callback) {
    for (let i = 0; i < toLoad.length; i++) {
        const m = toLoad[i]
        const fileData = await readFromRegistry(m, projectPath)

        if (fileData) {
            const parsed = JSON.parse(fileData)
            parsed.id = m
            callback(parsed)
        }
    }
}