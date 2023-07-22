import TEXTURE_TEMPLATE from "../../renderer/engine/core/static/TEXTURE_TEMPLATE"
import ElectronWindowService from "../ElectronWindowService"
import AssimpService from "./assimp/AssimpService"
import GLTFLoaderUtil from "./gltf/GLTFLoaderUtil"
import * as Buffer from "buffer"

import * as pathRequire from "path"
import * as fs from "fs"
import * as crypto from "node:crypto"
import sharp from "sharp"
import imageSize from "image-size"
import FileTypes from "../../shared/enums/FileTypes"
import Folders from "../../shared/enums/Folders"
import FileSystemUtil from "./FileSystemUtil"

export default class FileImporterUtil {
	static async importFiles(filesToLoad: string[], dir: string) {
		const targetDir = pathRequire.resolve(dir)
		const result = []
		for (let i = 0; i < filesToLoad.length; i++) {
			try {
				const filePath = filesToLoad[i]
				const name = filePath.split(pathRequire.sep).pop()
				const newRoot = targetDir + pathRequire.sep + name.split(".")[0]
				const fileID = crypto.randomUUID()
				const type = filePath.split(/\.([a-zA-Z0-9]+)$/)[1]
				switch (type) {
				case "png":
				case "jpg":
				case "jpeg": {
					await FileImporterUtil.#importImage(newRoot, fileID, type, filePath)
					break
				}
				case "gltf":
					await GLTFLoaderUtil.load(targetDir, filePath, await FileSystemUtil.readTypedFile(filePath, "json"))
					break
				case "dae":
				case "glb":
				case "fbx":
					await AssimpService.getInstance().load(targetDir, filePath)
					break
				}
			} catch (err) {
				console.error(err)
			}
		}
		return result
	}

	static async #importImage(newRoot: string, fileID: string, type: string, filePath: string,) {
		if (fs.existsSync(newRoot + FileTypes.TEXTURE))
			newRoot += fileID.substring(0, 4)
		const bufferData = <Buffer | null>await FileSystemUtil.readTypedFile(filePath, "buffer")
		if (bufferData !== null) {
			const base64 = `data:image/${type};base64,` + bufferData.toString("base64")
			const data = JSON.stringify({...TEXTURE_TEMPLATE, base64})
			await fs.promises.writeFile(newRoot + FileTypes.TEXTURE, data)
			const pathToPreview = pathRequire.resolve(ElectronWindowService.getInstance().pathToPreviews + pathRequire.sep + fileID + FileTypes.PREVIEW)
			const dimensions = <{ width?: number, height?: number }>await new Promise(resolve => {
				imageSize(filePath, (err, dimensions) => resolve(dimensions || {}))
			})
			if (!dimensions)
				return
			const ratio = Math.min(128 / dimensions.width, 128 / dimensions.height)
			const bufferPreview = await sharp(bufferData).resize(Math.round(dimensions.width * ratio), Math.round(dimensions.height * ratio)).png().toBuffer()
			await fs.promises.writeFile(pathToPreview, "data:image/png;base64," + bufferPreview.toString("base64"))
			await FileSystemUtil.createRegistryEntry(fileID, newRoot.split(Folders.ASSETS).pop() + FileTypes.TEXTURE)
		}
	}
}