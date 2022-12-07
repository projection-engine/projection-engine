import ProjectController from "../ProjectController";

const pathRequire = require("path")
const fs = require("fs")

export default async function createRegistryEntry(fID, pathToFile) {
    const path = pathToFile.replaceAll(pathRequire.sep + pathRequire.sep, pathRequire.sep)
    try {
        ProjectController.registry[fID] = {id: fID, path}
        await fs.promises.writeFile(ProjectController.pathToRegistry, JSON.stringify(ProjectController.registry))
    } catch (err) {
        console.error(err)
    }
}