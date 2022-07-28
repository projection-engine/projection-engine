import importScene from "../../../libs/importer/importScene"
import FileSystem from "../../../libs/FileSystem"
import COMPONENTS from "../../../libs/engine/data/COMPONENTS";
import {ENTITY_ACTIONS} from "../../../libs/engine-extension/entityReducer";
import DataStoreController from "../../../stores/DataStoreController";
import FileStoreController from "../../../stores/FileStoreController";
import FILE_TYPES from "../../../../../../static/FILE_TYPES";

export default async function importFile(currentDirectory) {
    const engineCopy = {...DataStoreController.engine}
    const toImport = await window.fileSystem.openDialog()
    if (toImport.length > 0) {
        alert.pushAlert("Loading content-browser", "info")
        if (toImport.filter(e => e.includes("gltf")).length > 0) {
            alert.pushAlert("Loading scene", "info")
            const result = await window.fileSystem.importFile(FileStoreController.ASSETS_PATH + currentDirectory.id, toImport)
            let newEntities = [], newMeshes = []
            for (let i in result) {
                const current = result[i]
                for (let j in current.ids) {
                    const res = await window.fileSystem.readRegistryFile(current.ids[j])
                    if (res) {
                        const {
                            meshes,
                            entities
                        } = await importScene(res, true)
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
            for(let i =0; i < newMeshes.length; i++)
                engineCopy.meshes.set(newMeshes[i].id, newMeshes)
            engineCopy.dispatchEntities({type: ENTITY_ACTIONS.PUSH_BLOCK, payload: newEntities}, engineCopy)
        } else
            await window.fileSystem.importFile(FileStoreController.ASSETS_PATH + currentDirectory.id, toImport)
        alert.pushAlert("Import successful", "success")
        FileStoreController.refreshFiles().catch()
    }
}