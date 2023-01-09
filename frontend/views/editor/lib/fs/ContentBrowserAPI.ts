import RegistryAPI from "./RegistryAPI";
import FS from "../../../../lib/FS/FS";
import FILE_TYPES from "../../../../../static/objects/FILE_TYPES";

const pathRequire = window.require("path")

function mapAsset(reg, type) {
    return reg.map(i => new Promise(resolve => {
        const split = i.path.split(FS.sep)
        resolve({
            type,
            registryID: i.id,
            name: split[split.length - 1].split(".")[0]
        })
    }))
}

export default class ContentBrowserAPI {

    static async rename(from, to) {
        const fromResolved = pathRequire.resolve(from)
        const toResolved = pathRequire.resolve(to)
        console.trace(toResolved, fromResolved)
        await RegistryAPI.readRegistry()
        try {
            const stat = await FS.stat(fromResolved)
            if (stat !== undefined && stat.isDirectory) {
                await FS.mkdir(toResolved)
                const res = await FS.readdir(fromResolved)
                if (!res) return
                for (let i = 0; i< res.length; i++) {
                    const file = res[i]
                    const oldPath = fromResolved + FS.sep + `${file}`
                    const newPath = toResolved + FS.sep + `${file}`
                    if ((await FS.stat(oldPath)).isDirectory)
                        await FS.rename(oldPath, newPath)
                    else {
                        await FS.rename(oldPath, newPath)
                        await RegistryAPI.updateRegistry(oldPath, newPath)
                    }
                }
                await FS.rm(fromResolved, {recursive: true, force: true})
                return
            }

            if (stat !== undefined) {
                await FS.rename(fromResolved, toResolved)
                await RegistryAPI.updateRegistry(fromResolved, toResolved)
                return
            }

        } catch (error) {
            console.error(error)
        }
    }



    static async refresh() {
        const reg = await RegistryAPI.readRegistry()
        const textureReg = reg.filter(r => r.path && r.path.includes(FILE_TYPES.TEXTURE)),
            meshesReg = reg.filter(r => r.path && r.path.includes(FILE_TYPES.PRIMITIVE)),
            materialsReg = reg.filter(r => r.path && r.path.includes(FILE_TYPES.MATERIAL)),
            componentsReg = reg.filter(r => r.path && r.path.includes(FILE_TYPES.COMPONENT)),
            levelsReg = reg.filter(r => r.path && r.path.includes(FILE_TYPES.LEVEL)),
            uiReg = reg.filter(r => r.path && r.path.includes(FILE_TYPES.UI_LAYOUT)),

            terrainReg = reg.filter(r => r.path && r.path.includes(FILE_TYPES.TERRAIN)),

            collections = reg.filter(r => r.path && r.path.includes(FILE_TYPES.COLLECTION)),
            promises = []

        promises.push(...mapAsset(textureReg, FILE_TYPES.TEXTURE))
        promises.push(...mapAsset(meshesReg, FILE_TYPES.PRIMITIVE))
        promises.push(...mapAsset(materialsReg, FILE_TYPES.MATERIAL))
        promises.push(...mapAsset(componentsReg, FILE_TYPES.COMPONENT))

        promises.push(...mapAsset(levelsReg, FILE_TYPES.LEVEL))
        promises.push(...mapAsset(uiReg, FILE_TYPES.UI_LAYOUT))

        promises.push(...mapAsset(terrainReg, FILE_TYPES.TERRAIN))

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

                case FILE_TYPES.TERRAIN:
                    result.terrains.push(current)
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