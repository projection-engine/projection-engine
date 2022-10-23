import {v4} from "uuid";
import FILE_TYPES from "shared-resources/FILE_TYPES";
import TEXTURE_TEMPLATE from "../../engine/static/TEXTURE_TEMPLATE";
import ProjectMap from "../libs/ProjectMap";
import readTypedFile from "./read-typed-file";
import createRegistryEntry from "./create-registry-entry";
import PROJECT_FOLDER_STRUCTURE from "shared-resources/PROJECT_FOLDER_STRUCTURE";
import AssimpLoader from "../libs/assimp/AssimpLoader";
import {readRegistry} from "./fs-operations";
import glTF from "../libs/gltf/glTF";

const sharp = require("sharp")
const fs = require("fs")
const pathRequire = require("path")
export default async function importFiles(filesToLoad, dir, registryEntries) {
    const targetDir = pathRequire.resolve(dir)
    let result = [], meshesToRead = []
    for (let i = 0; i < filesToLoad.length; i++) {
        try {
            const filePath = filesToLoad[i]
            const name = filePath.split(pathRequire.sep).pop()
            const newRoot = targetDir + pathRequire.sep + name.split(".")[0]
            const fileID = v4()
            const type = filePath.split(/\.([a-zA-Z0-9]+)$/)[1]
            switch (type) {
                case "png":
                case "jpg":
                case "jpeg": {
                    if (!fs.existsSync(newRoot + FILE_TYPES.TEXTURE)) {
                        const bufferData = new Buffer(await readTypedFile(filePath, "buffer"))
                        const base64 = `data:image/${type};base64,` + bufferData.toString("base64")
                        const data = JSON.stringify({...TEXTURE_TEMPLATE, base64})
                        await fs.promises.writeFile(newRoot + FILE_TYPES.TEXTURE, data)
                        const pathToPreview = pathRequire.resolve(ProjectMap.pathToPreviews + pathRequire.sep + fileID + FILE_TYPES.PREVIEW)
                        const bufferPreview = await sharp(bufferData).resize(256, 256).png().toBuffer()
                        await fs.promises.writeFile(pathToPreview, `data:image/png;base64,` + bufferPreview.toString("base64"))
                        registryEntries.push(fileID)
                        await createRegistryEntry(fileID, newRoot.split(PROJECT_FOLDER_STRUCTURE.ASSETS).pop() + FILE_TYPES.TEXTURE)
                    }
                    break
                }
                case "gltf":
                    await glTF(targetDir, filePath, await readTypedFile(filePath, "json"))
                    break
                case "dae":
                case "glb":
                case "fbx":
                    meshesToRead.push(filePath)
                    break
                default:
                    break
            }
        } catch (error) {
            console.error(error)
        }
    }
    if (meshesToRead.length > 0)
        await AssimpLoader.loader(targetDir, meshesToRead)

    ProjectMap.registry = await readRegistry(ProjectMap.pathToRegistry)
    return result
}