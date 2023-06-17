import WindowController from "../libs/WindowController"

import * as pathRequire from "path"
import * as fs from "fs"

export default async function createRegistryEntry(fID:string, pathToFile:string) {
	const path = pathToFile.replaceAll(pathRequire.sep + pathRequire.sep, pathRequire.sep)
	try {
		WindowController.registry[fID] = {id: fID, path}
		await fs.promises.writeFile(WindowController.pathToRegistry, JSON.stringify(WindowController.registry))
	} catch (err) {
		console.error(err)
	}
}