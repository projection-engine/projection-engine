import * as pathRequire from "path"
import * as path from "path"
import * as fs from "fs"
import ElectronWindowService from "../ElectronWindowService"
import Folders from "../../shared/enums/Folders"

export default class FileSystemUtil {
	static async createRegistryEntry(fID: string, pathToFile: string) {
		const path = pathToFile.replaceAll(pathRequire.sep + pathRequire.sep, pathRequire.sep)
		ElectronWindowService.getInstance().registry[fID] = {id: fID, path}
		await FileSystemUtil.updateRegistry()
	}

	static async directoryStructure(d) {
		const dir = path.resolve(d)
		const results = []
		if (fs.existsSync(dir)) {
			const list = await fs.promises.readdir(dir)
			if (!list) return []
			let pending = list.length
			if (!pending) return results
			for (let i = 0; i < list.length; i++) {
				const file = path.resolve(dir, list[i])
				const stat = await fs.promises.stat(file)
				results.push(file)
				if (stat && stat.isDirectory()) {
					results.push(...(await FileSystemUtil.directoryStructure(file)))
					if (!--pending) return results
				} else if (!--pending) return results
			}
		}
		return []
	}

	static async parseContentBrowserData(p, registryData, projectPath) {
		if (typeof p !== "string")
			return
		const assetsPath = pathRequire.resolve(projectPath + pathRequire.sep + Folders.ASSETS)
		const stat = await fs.promises.stat(p)
		const split = p.split(pathRequire.sep)
		const parent = [...split]

		parent.pop()

		const parentPath = parent.join(pathRequire.sep).replace(assetsPath, "")
		const currentPath = p.replace(assetsPath, "")

		if (stat.isDirectory())
			return {
				isFolder: true,
				name: [...split].pop(),
				creationDate: (new Date(stat.birthtime)).toDateString(),
				id: currentPath,
				parent: split[split.length - 2] === "assets" ? undefined : parentPath
			}
		const parsedPath = pathRequire.resolve(assetsPath + currentPath).replace(assetsPath + pathRequire.sep, "")

		return {
			isFolder: false,
			name: [...split].pop().split(/\.([a-zA-Z0-9]+)$/)[0],
			type: p.split(".").pop(),
			fileType: "." + p.split(".").pop(),
			creationDate: (new Date(stat.birthtime)).toDateString(),
			id: currentPath,
			size: stat.size,
			registryID: registryData.find(reg => reg.path === parsedPath || reg.path === currentPath)?.id,
			parent: split[split.length - 2] === "assets" ? undefined : parentPath
		}
	}

	static async readTypedFile(pathName, type): Promise<undefined | {
        [key: string | number | symbol]: any
    } | Buffer | string | null> {
		try {
			const res: Buffer = await fs.promises.readFile(pathRequire.resolve(pathName))
			let result: undefined | MutableObject | Buffer | string | null
			switch (type) {
			case "buffer":
				result = res
				break
			case "json":
				result = JSON.parse(res.toString())
				break
			case "base64":
				result = new Buffer(res).toString("base64")
				break
			default:
				result = res.toString()
				break
			}
			return result
		} catch (err) {
			console.error(err)
			return null
		}
	}


	static async refreshContentBrowser() {
		await FileSystemUtil.#updateRegistryData()
		FileSystemUtil.#cleanUpRegistry()
		await FileSystemUtil.updateRegistry()
		return FileSystemUtil.#getRegistryFilesMetadata()
	}

	static async #getRegistryFilesMetadata() {
		const instance = ElectronWindowService.getInstance()
		const registryData = Object.values(instance.registry)
		const assetsToParse = await FileSystemUtil.directoryStructure(instance.pathToAssets)
		const result = []
		for (let i = 0; i < assetsToParse.length; i++) {
			try {
				const fileMetadata = await FileSystemUtil.parseContentBrowserData(assetsToParse[i], registryData, instance.pathToProject)
				if (fileMetadata && (fileMetadata.registryID || fileMetadata.isFolder))
					result.push(fileMetadata)
			} catch (err) {
				console.error(err)
			}
		}
		return result
	}

	static #cleanUpRegistry() {
		const instance = ElectronWindowService.getInstance()

		const registryData = Object.values(instance.registry)
		const foundIDs = {}
		for (let i = 0; i < registryData.length; i++) {
			const registryInstance = registryData[i]
			if (foundIDs[registryInstance.id])
				delete instance.registry[registryInstance.id]
			foundIDs[registryInstance.id] = true
			if (!fs.existsSync(instance.pathToAssets + registryInstance.path))
				delete instance.registry[registryInstance.id]
		}
	}

	static async #updateRegistryData() {
		const instance = ElectronWindowService.getInstance()
		const data = <null | {
            [key: string]: RegistryFile
        }>await FileSystemUtil.readTypedFile(instance.pathToRegistry, "json").catch(console.error)
		if (!data)
			return
		instance.registry = data
	}

	static async updateRegistry() {
		const instance = ElectronWindowService.getInstance()
		try {
			await fs.promises.writeFile(instance.pathToRegistry, JSON.stringify(instance.registry))
		} catch (error) {
			console.error(error)
		}
	}
}