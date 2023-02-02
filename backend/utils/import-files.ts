import FILE_TYPES from "../../static/objects/FILE_TYPES";
import TEXTURE_TEMPLATE from "../../engine-core/static/TEXTURE_TEMPLATE";
import WindowController from "../libs/WindowController";
import readTypedFile from "./read-typed-file";
import createRegistryEntry from "./create-registry-entry";
import PROJECT_FOLDER_STRUCTURE from "../../static/objects/PROJECT_FOLDER_STRUCTURE";
import AssimpLoader from "../libs/assimp/AssimpLoader";
import glTF from "../libs/gltf/glTF";
import * as Buffer from "buffer";

import * as pathRequire from "path";
import * as fs from "fs";
import * as crypto from "node:crypto";
import sharp from "sharp";
import imageSize from "image-size";

export default async function importFiles(filesToLoad, dir, registryEntries) {
    const targetDir = pathRequire.resolve(dir)
    let result = [], meshesToRead = []
    for (let i = 0; i < filesToLoad.length; i++) {
        try {
            const filePath = filesToLoad[i]
            const name = filePath.split(pathRequire.sep).pop()
            let newRoot = targetDir + pathRequire.sep + name.split(".")[0]
            const fileID = crypto.randomUUID()
            const type = filePath.split(/\.([a-zA-Z0-9]+)$/)[1]
            switch (type) {
                case "png":
                case "jpg":
                case "jpeg": {
                    if (fs.existsSync(newRoot + FILE_TYPES.TEXTURE))
                        newRoot += fileID.substring(0, 4)
                    const bufferData = <Buffer | null>await readTypedFile(filePath, "buffer")
                    if (bufferData !== null) {
                        const base64 = `data:image/${type};base64,` + bufferData.toString("base64")
                        const data = JSON.stringify({...TEXTURE_TEMPLATE, base64})
                        await fs.promises.writeFile(newRoot + FILE_TYPES.TEXTURE, data)
                        const pathToPreview = pathRequire.resolve(WindowController.pathToPreviews + pathRequire.sep + fileID + FILE_TYPES.PREVIEW)
                        const dimensions = <{ width?: number, height?: number }>await new Promise(resolve => {
                            imageSize(filePath, (err, dimensions) => resolve(dimensions || {}))
                        })
                        if(!dimensions)
                            break
                        const ratio = Math.min(128 / dimensions.width, 128 / dimensions.height);
                        const bufferPreview = await sharp(bufferData).resize(Math.round(dimensions.width * ratio), Math.round(dimensions.height * ratio)).png().toBuffer()
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

    return result
}