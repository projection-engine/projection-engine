import FilesAPI from "../../shared/libs/FilesAPI"
import COMPONENTS from "../../../public/engine/static/COMPONENTS.json";
import dispatchRendererEntities, {ENTITY_ACTIONS} from "../stores/templates/dispatch-renderer-entities";
import FilesStore from "../stores/FilesStore";
import FILE_TYPES from "shared-resources/FILE_TYPES";
import Loader from "./loader/Loader";
import RegistryAPI from "../../shared/libs/RegistryAPI";
import ContentBrowserAPI from "../../shared/libs/ContentBrowserAPI";

import {GPU} from "../../../public/engine/production";
import {PreviewSystem} from "../../../public/engine/editor";
import PROJECT_FOLDER_STRUCTURE from "../../static/PROJECT_FOLDER_STRUCTURE";
import NodeFS from "shared-resources/frontend/libs/NodeFS";

export default async function importFile(currentDirectory) {
    const toImport = await ContentBrowserAPI.openDialog()
    if (toImport.length > 0) {
        const result = await ContentBrowserAPI.importFile(NodeFS.ASSETS_PATH  + currentDirectory.id, toImport)
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
                                await FilesAPI.writeFile(NodeFS.sep + PROJECT_FOLDER_STRUCTURE.PREVIEWS + NodeFS.sep + mesh.id + FILE_TYPES.PREVIEW, preview)
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