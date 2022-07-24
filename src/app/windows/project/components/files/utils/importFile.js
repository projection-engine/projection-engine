import importScene from "../../../libs/importer/importScene"
import COMPONENTS from "../../../engine/data/COMPONENTS"
import FileSystem from "../../../libs/FileSystem"
import FILE_TYPES from "../../../../../public/static/FILE_TYPES"
import {ENTITY_ACTIONS} from "../../../engine-extension/entityReducer"

export default async function importFile(engine, hook) {
    const toImport = await window.fileSystem.openDialog()
    if (toImport.length > 0) {
        alert.pushAlert("Loading files", "info")
        if (toImport.filter(e => e.includes("gltf")).length > 0) {
            alert.pushAlert("Loading scene", "info")
            const result = await window.fileSystem.importFile(hook.path + hook.currentDirectory.id, toImport)
            let newEntities = [], newMeshes = []
            for (let i in result) {
                const current = result[i]
                for (let j in current.ids) {
                    const res = await window.fileSystem.readRegistryFile(current.ids[j])
                    if (res) {
                        const {
                            meshes,
                            entities
                        } = await importScene(engine, res, true)
                        newEntities.push(...entities)
                        newMeshes.push(...meshes)
                        for (let m in entities) {
                            const e = entities[m]
                            if (e && e.components[COMPONENTS.MESH]) {
                                const mesh = meshes.find(m => m.id === e.components[COMPONENTS.MESH].meshID)
                                const preview = window.renderer.generateMeshPreview(e, mesh)
                                window.fileSystem.writeFile(FileSystem.sep + "previews" + FileSystem.sep + mesh.id + FILE_TYPES.PREVIEW, preview).catch(er => console.error(er))
                            }
                        }
                    }
                }
            }
            engine.dispatchMeshes(newMeshes)
            engine.dispatchEntities({type: ENTITY_ACTIONS.PUSH_BLOCK, payload: newEntities})
        } else
            await window.fileSystem.importFile(hook.path + hook.currentDirectory.id, toImport)
        alert.pushAlert("Import successful", "success")
        hook.refreshFiles().catch()
    }
}