import FilesAPI from "../../../../shared/libs/FilesAPI";
import TerrainWorker from "../../../../../public/engine/workers/terrain/TerrainWorker";
import {COMPONENTS, Entity, GPU} from "../../../../../public/engine/production";
import dispatchRendererEntities, {ENTITY_ACTIONS} from "../../../stores/templates/dispatch-renderer-entities";
import NodeFS from "shared-resources/frontend/libs/NodeFS";

export default async function loadTerrain(reg) {
    const file = await FilesAPI.readFile(NodeFS.ASSETS_PATH + NodeFS.sep + reg.path, "json")
    if (!file.image) {
        alert.pushAlert("No height-map present", "error")
        return
    }
    const data = await TerrainWorker.generate(file.image, file.scale, file.dimensions)
    GPU.allocateMesh(reg.id, data)
    const entity = new Entity()
    entity.addComponent(COMPONENTS.TERRAIN)

    entity.components.get(COMPONENTS.TERRAIN).terrainID = reg.id

    dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: entity})
}