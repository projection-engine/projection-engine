import FilesAPI from "../../FilesAPI";
import TerrainWorker from "../../../../public/engine/workers/terrain/TerrainWorker";
import dispatchRendererEntities, {ENTITY_ACTIONS} from "../../../stores/templates/dispatch-renderer-entities";
import NodeFS from "shared-resources/frontend/libs/NodeFS";
import COMPONENTS from "../../../../public/engine/static/COMPONENTS";
import Entity from "../../../../public/engine/instances/Entity";
import GPUAPI from "../../../../public/engine/api/GPUAPI";

export default async function loadTerrain(reg) {
    const file = await FilesAPI.readFile(NodeFS.ASSETS_PATH + NodeFS.sep + reg.path, "json")
    if (!file.image) {
        alert.pushAlert("No height-map present", "error")
        return
    }
    const data = await TerrainWorker.generate(file.image, file.scale, file.dimensions)
    GPUAPI.allocateMesh(reg.id, data)
    const entity = new Entity()
    entity.addComponent(COMPONENTS.TERRAIN)

    entity.components.get(COMPONENTS.TERRAIN).terrainID = reg.id

    dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: entity})
}