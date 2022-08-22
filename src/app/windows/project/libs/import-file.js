import FilesAPI from "../../../libs/files/FilesAPI"
import COMPONENTS from "./engine/production/data/COMPONENTS";
import dispatchRendererEntities, {ENTITY_ACTIONS} from "../stores/templates/dispatch-renderer-entities";
import RendererStoreController from "../stores/RendererStoreController";
import CBStoreController from "../stores/CBStoreController";
import FILE_TYPES from "../../../../assets/FILE_TYPES";
import Loader from "./loader/Loader";
import RegistryAPI from "../../../libs/files/RegistryAPI";
import ContentBrowserAPI from "../../../libs/files/ContentBrowserAPI";

export default async function importFile(currentDirectory) {
    const toImport = await ContentBrowserAPI.openDialog()
    if (toImport.length > 0) {
        const result = await ContentBrowserAPI.importFile(CBStoreController.ASSETS_PATH + currentDirectory.id, toImport)
        if (toImport.filter(e => e.includes("gltf")).length > 0) {
            let newEntities = [], newMeshes = []
            for (let i in result) {
                const current = result[i]
                for (let j in current.ids) {
                    const res = await RegistryAPI.readRegistryFile(current.ids[j])
                    if (res) {
                        const {meshes, entities} = await Loader.scene(res.path, true)
                        newEntities.push(...entities)
                        newMeshes.push(...meshes)
                        for (let m in entities) {
                            const e = entities[m]
                            if (e && e.components[COMPONENTS.MESH]) {
                                const mesh = meshes.find(m => m.id === e.components[COMPONENTS.MESH].meshID)
                                const preview = window.renderer.generateMeshPreview(e, mesh)
                                await FilesAPI.writeFile(FilesAPI.sep + "previews" + FilesAPI.sep + mesh.id + FILE_TYPES.PREVIEW, preview)
                            }
                        }
                    }
                }
            }
            for(let i =0; i < newMeshes.length; i++)
                RendererStoreController.engine.meshes.set(newMeshes[i].id, newMeshes[i])
            dispatchRendererEntities({type: ENTITY_ACTIONS.PUSH_BLOCK, payload: newEntities})
        }
        alert.pushAlert("Import successful", "success")
        CBStoreController.refreshFiles().catch()
    }
}