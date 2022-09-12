import FilesAPI from "../../shared/libs/files/FilesAPI"
import COMPONENTS from "../../../../public/engine/static/COMPONENTS";
import dispatchRendererEntities, {ENTITY_ACTIONS} from "../stores/templates/dispatch-renderer-entities";
import FilesStore from "../stores/FilesStore";
import FILE_TYPES from "../../../static/FILE_TYPES";
import Loader from "./loader/Loader";
import RegistryAPI from "../../shared/libs/files/RegistryAPI";
import ContentBrowserAPI from "../../shared/libs/files/ContentBrowserAPI";
import GPU from "../../../../public/engine/production/GPU";
import PreviewSystem from "../../../../public/engine/editor/services/PreviewSystem";

export default async function importFile(currentDirectory) {
    const toImport = await ContentBrowserAPI.openDialog()
    if (toImport.length > 0) {
        const result = await ContentBrowserAPI.importFile(FilesStore.ASSETS_PATH + currentDirectory.id, toImport)
        if (toImport.filter(e => e.includes("gltf")).length > 0) {
            let newEntities = []
            for (let i = 0; i < result.length; i++) {
                const current = result[i]
                for (let j = 0; j < current.ids.length; j++) {
                    const res = await RegistryAPI.readRegistryFile(current.ids[j])
                    if (res) {
                        const entities = await Loader.scene(res.path, true)
                        newEntities.push(...entities)
                        for (let m = 0; m < entities.length; m++) {
                            const e = entities[m]
                            if (e && e.components.get(COMPONENTS.MESH)) {
                                const mesh = GPU.meshes.get(e.components.get(COMPONENTS.MESH).meshID)
                                const preview = PreviewSystem.execute(mesh, e)
                                await FilesAPI.writeFile(FilesAPI.sep + "previews" + FilesAPI.sep + mesh.id + FILE_TYPES.PREVIEW, preview)
                            }
                        }
                    }
                }
            }
            dispatchRendererEntities({type: ENTITY_ACTIONS.PUSH_BLOCK, payload: newEntities})
        }
        alert.pushAlert("Import successful", "success")
        FilesStore.refreshFiles().catch()
    }
}