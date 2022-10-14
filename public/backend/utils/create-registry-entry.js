import FILE_TYPES from "shared-resources/FILE_TYPES";
import ProjectMap from "../libs/ProjectMap";

const pathRequire = require("path")
const fs = require("fs")

export default async function createRegistryEntry(fID, pathToFile) {
    const path = pathToFile.replaceAll(pathRequire.sep + pathRequire.sep, pathRequire.sep)
    try {
        const p = pathRequire.resolve(ProjectMap.pathToRegistry + pathRequire.sep + fID + FILE_TYPES.REGISTRY)
        console.log(p + "----------------------------------------------------------------")
        ProjectMap.registry.push(
            {
                id: fID,
                path,
                registryPath: p
            }
        )
        await fs.promises.writeFile(p, JSON.stringify({id: fID, path}))
    } catch (err) {
        console.error(err)
    }
}