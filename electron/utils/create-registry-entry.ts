import ElectronWindowService from "../libs/ElectronWindowService"

import * as pathRequire from "path"
import * as fs from "fs"

export default async function createRegistryEntry(fID:string, pathToFile:string) {
	const path = pathToFile.replaceAll(pathRequire.sep + pathRequire.sep, pathRequire.sep)
	try {
		ElectronWindowService.getInstance().registry[fID] = {id: fID, path}
		await fs.promises.writeFile(ElectronWindowService.getInstance().pathToRegistry, JSON.stringify(ElectronWindowService.getInstance().registry))
	} catch (err) {
		console.error(err)
	}
}