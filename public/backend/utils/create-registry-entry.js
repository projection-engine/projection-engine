import ProjectMap from "../libs/ProjectMap";

const pathRequire = require("path")
const fs = require("fs")

export default async function createRegistryEntry(fID, pathToFile) {
    const path = pathToFile.replaceAll(pathRequire.sep + pathRequire.sep, pathRequire.sep)
    try {
        ProjectMap.registry[fID] = {id: fID, path}
        await fs.promises.writeFile(ProjectMap.pathToRegistry, JSON.stringify(ProjectMap.registry))
    } catch (err) {
        console.error(err)
    }
}