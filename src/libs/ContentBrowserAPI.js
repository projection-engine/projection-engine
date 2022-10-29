import NodeFS from "shared-resources/frontend/libs/NodeFS"
import FILE_TYPES from "shared-resources/FILE_TYPES";
import RegistryAPI from "./RegistryAPI";

const pathRequire = window.require("path")

function mapAsset(reg, type) {
    return reg.map(i => new Promise(resolve => {
        const split = i.path.split(NodeFS.sep)
        resolve({
            type,
            registryID: i.id,
            name: split[split.length - 1].split(".")[0]
        })
    }))
}

export default class ContentBrowserAPI {

    static async rename(from, to) {
        console.trace(from, to)
        const fromResolved = pathRequire.resolve(from)
        await RegistryAPI.readRegistry()
        try {
            const stat = await NodeFS.stat(fromResolved)
            if (stat !== undefined && stat.isDirectory) {
                await NodeFS.mkdir(to)
                const res = await NodeFS.readdir(fromResolved)
                if (!res) return
                for (let i = 0; i< res.length; i++) {
                    const file = res[i]
                    const oldPath = fromResolved + NodeFS.sep + `${file}`
                    const newPath = to + NodeFS.sep + `${file}`
                    if ((await NodeFS.stat(oldPath)).isDirectory)
                        await NodeFS.rename(oldPath, newPath)
                    else {
                        await NodeFS.rename(oldPath, newPath)
                        await RegistryAPI.updateRegistry(oldPath, newPath)
                    }
                }
                await NodeFS.rm(fromResolved, {recursive: true, force: true})
            } else if (stat !== undefined) {
                await NodeFS.rename(fromResolved, to)
                await RegistryAPI.updateRegistry(from, to)
            }

        } catch (error) {
            console.error(error)
        }
    }

    static async foldersFromDirectory(startPath) {
        if (!(await NodeFS.exists(startPath))) return []
        let res = []

        let files = await NodeFS.readdir(startPath)
        for (let i = 0; i < files.length; i++) {
            const filename = pathRequire.join(startPath, files[i])
            const stat = await NodeFS.stat(filename)

            if (stat.isDirectory) res.push(filename)
        }
        return res
    }


    static async refresh() {
        const reg = await RegistryAPI.readRegistry()
        const textureReg = reg.filter(r => r.path && r.path.includes(FILE_TYPES.TEXTURE)),
            meshesReg = reg.filter(r => r.path && r.path.includes(FILE_TYPES.PRIMITIVE)),
            materialsReg = reg.filter(r => r.path && r.path.includes(FILE_TYPES.MATERIAL)),
            componentsReg = reg.filter(r => r.path && r.path.includes(FILE_TYPES.COMPONENT)),
            levelsReg = reg.filter(r => r.path && r.path.includes(FILE_TYPES.LEVEL)),
            uiReg = reg.filter(r => r.path && r.path.includes(FILE_TYPES.UI_LAYOUT)),
            materialInstancesReg = reg.filter(r => r.path && r.path.includes(FILE_TYPES.MATERIAL_INSTANCE)),
            simpleMaterialReg = reg.filter(r => r.path && r.path.includes(FILE_TYPES.SIMPLE_MATERIAL)),
            terrainReg = reg.filter(r => r.path && r.path.includes(FILE_TYPES.TERRAIN)),
            terrainMaterialReg = reg.filter(r => r.path && r.path.includes(FILE_TYPES.TERRAIN_MATERIAL)),
            collections = reg.filter(r => r.path && r.path.includes(FILE_TYPES.COLLECTION)),
            promises = []

        promises.push(...mapAsset(textureReg, FILE_TYPES.TEXTURE))
        promises.push(...mapAsset(meshesReg, FILE_TYPES.PRIMITIVE))
        promises.push(...mapAsset(materialsReg, FILE_TYPES.MATERIAL))
        promises.push(...mapAsset(componentsReg, FILE_TYPES.COMPONENT))
        promises.push(...mapAsset(simpleMaterialReg, FILE_TYPES.MATERIAL_INSTANCE))
        promises.push(...mapAsset(levelsReg, FILE_TYPES.LEVEL))
        promises.push(...mapAsset(uiReg, FILE_TYPES.UI_LAYOUT))
        promises.push(...mapAsset(materialInstancesReg, FILE_TYPES.MATERIAL_INSTANCE))
        promises.push(...mapAsset(terrainReg, FILE_TYPES.TERRAIN))
        promises.push(...mapAsset(terrainMaterialReg, FILE_TYPES.TERRAIN_MATERIAL))
        promises.push(...mapAsset(collections, FILE_TYPES.COLLECTION))

        const loadedPromises = await Promise.all(promises)
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

        for (let i = 0; i < loadedPromises.length; i++) {
            const current = loadedPromises[i]
            switch (current.type) {
                case FILE_TYPES.TEXTURE:
                    result.textures.push(current)
                    break
                case FILE_TYPES.PRIMITIVE:
                    result.meshes.push(current)
                    break
                case FILE_TYPES.MATERIAL:
                    result.materials.push(current)
                    break
                case FILE_TYPES.COMPONENT:
                    result.components.push(current)
                    break
                case FILE_TYPES.LEVEL:
                    result.levels.push(current)
                    break
                case FILE_TYPES.UI_LAYOUT:
                    result.uiLayouts.push(current)
                    break
                case FILE_TYPES.MATERIAL_INSTANCE:
                    result.materialInstances.push(current)
                    break
                case FILE_TYPES.TERRAIN:
                    result.terrains.push(current)
                    break
                case FILE_TYPES.TERRAIN_MATERIAL:
                    result.terrainMaterials.push(current)
                    break
                case FILE_TYPES.COLLECTION:
                    result.collections.push(current)
                    break
                default:
                    break
            }
        }

        return result
    }


}