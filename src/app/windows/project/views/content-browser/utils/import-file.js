import FileSystem from "../../../../../libs/FileSystem"
import COMPONENTS from "../../../libs/engine/data/COMPONENTS";
import dispatchEntities, {ENTITY_ACTIONS} from "../../../stores/dispatch-entities";
import DataStoreController from "../../../stores/DataStoreController";
import FileStoreController from "../../../stores/FileStoreController";
import FILE_TYPES from "../../../../../../static/FILE_TYPES";
import Loader from "../../../libs/loader/Loader";

export default async function importFile(currentDirectory) {
    const toImport = await window.fileSystem.openDialog()
    if (toImport.length > 0) {
        const result = await window.fileSystem.importFile(FileStoreController.ASSETS_PATH + currentDirectory.id, toImport)
        if (toImport.filter(e => e.includes("gltf")).length > 0) {
            let newEntities = [], newMeshes = []
            for (let i in result) {
                const current = result[i]
                for (let j in current.ids) {
                    const res = await window.fileSystem.readRegistryFile(current.ids[j])
                    if (res) {
                        const {meshes, entities} = await Loader.scene(res.path, true)
                        newEntities.push(...entities)
                        newMeshes.push(...meshes)
                        for (let m in entities) {
                            const e = entities[m]
                            if (e && e.components[COMPONENTS.MESH]) {
                                const mesh = meshes.find(m => m.id === e.components[COMPONENTS.MESH].meshID)
                                const preview = window.renderer.generateMeshPreview(e, mesh)
                                await window.fileSystem.writeFile(FileSystem.sep + "previews" + FileSystem.sep + mesh.id + FILE_TYPES.PREVIEW, preview)
                            }
                        }
                    }
                }
            }
            for(let i =0; i < newMeshes.length; i++)
                DataStoreController.engine.meshes.set(newMeshes[i].id, newMeshes[i])
            dispatchEntities({type: ENTITY_ACTIONS.PUSH_BLOCK, payload: newEntities})
        }
        alert.pushAlert("Import successful", "success")
        FileStoreController.refreshFiles().catch()
    }
}