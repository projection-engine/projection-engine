import FSRegistryService from "./FSRegistryService"
import ElectronResources from "../../../shared/lib/ElectronResources"
import FileTypes from "../../../../shared/FileTypes"
import FileSystemUtil from "../../../shared/FileSystemUtil"


export default class ContentBrowserAPI {
	static #mapAsset(reg, type) {
		return reg.map(i => new Promise(resolve => {
			const split = i.path.split(FileSystemUtil.sep)
			resolve({
				type,
				registryID: i.id,
				name: split[split.length - 1].split(".")[0]
			})
		}))
	}

	static #mapRegistryAsset(reg, type) {
		const split = reg.path.split(FileSystemUtil.sep)
		return {
			type,
			registryID: reg.id,
			name: split[split.length - 1].split(".")[0]
		}
	}

	static async rename(from, to) {
		const fromResolved = ElectronResources.path.resolve(from)
		const toResolved = ElectronResources.path.resolve(to)
		await FSRegistryService.readRegistry()
		try {
			const stat = await FileSystemUtil.stat(fromResolved)
			if (stat !== undefined && stat.isDirectory) {
				await FileSystemUtil.mkdir(toResolved)
				const res = await FileSystemUtil.readdir(fromResolved)
				if (!res) return
				for (let i = 0; i < res.length; i++) {
					const file = res[i]
					const oldPath = fromResolved + FileSystemUtil.sep + `${file}`
					const newPath = toResolved + FileSystemUtil.sep + `${file}`
					if ((await FileSystemUtil.stat(oldPath)).isDirectory)
						await FileSystemUtil.rename(oldPath, newPath)
					else {
						await FileSystemUtil.rename(oldPath, newPath)
						await FSRegistryService.updateRegistry(oldPath, newPath)
					}
				}
				await FileSystemUtil.rm(fromResolved, {recursive: true, force: true})
				return
			}

			if (stat !== undefined) {
				await FileSystemUtil.rename(fromResolved, toResolved)
				await FSRegistryService.updateRegistry(fromResolved, toResolved)
				return
			}

		} catch (error) {
			console.error(error)
		}
	}

	static async getRegistryData() {
		const result = {
			textures: [],
			meshes: [],
			materials: [],
			components: [],
			terrains: [],
			levels: [],
			uiLayouts: [],
			materialInstances: [],
			terrainMaterials: [],
			collections: []
		}
		await FSRegistryService.readRegistry()
		const registryList = FSRegistryService.registryList
		for (let i = 0; i < registryList.length; i++) {
			const registryEntry = registryList[i]
			if (!registryEntry.path)
				continue
			let type
			let slot
			switch (true) {
			case registryEntry.path.includes(FileTypes.TEXTURE):
				type=FileTypes.TEXTURE
				slot= result.textures
				break
			case registryEntry.path.includes(FileTypes.PRIMITIVE):
				type=FileTypes.PRIMITIVE
				slot= result.meshes
				break
			case registryEntry.path.includes(FileTypes.MATERIAL):
				type=FileTypes.MATERIAL
				slot= result.materials
				break
			case registryEntry.path.includes(FileTypes.COMPONENT):
				type=FileTypes.COMPONENT
				slot= result.components
				break
			case registryEntry.path.includes(FileTypes.LEVEL):
				type=FileTypes.LEVEL
				slot= result.levels
				break
			case registryEntry.path.includes(FileTypes.UI_LAYOUT):
				type=FileTypes.UI_LAYOUT
				slot= result.uiLayouts
				break
			case registryEntry.path.includes(FileTypes.COLLECTION):
				type=FileTypes.COLLECTION
				slot= result.collections
				break
			}
			if(type && slot)
				slot.push(ContentBrowserAPI.#mapRegistryAsset(registryEntry, type))
		}

		return result
	}


}