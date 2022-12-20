import FilesAPI from "../../fs/FilesAPI";
import dispatchRendererEntities, {ENTITY_ACTIONS} from "../../../stores/dispatch-renderer-entities";
import COMPONENTS from "../../../../../engine-core/static/COMPONENTS";
import Entity from "../../../../../engine-core/instances/Entity";
import NodeFS from "../../../../shared/libs/NodeFS";

export default async function loadTerrain(reg) {
    const file = await FilesAPI.readFile(NodeFS.ASSETS_PATH + NodeFS.sep + reg.path, "json")
    if (!file.image) {
        console.error("No height-map present")
        return
    }
    // const data = await TerrainGenerator.generate(file.image, file.scale, file.dimensions)
    // GPUAPI.allocateMesh(reg.id, data)
    const entity = new Entity()
    entity.addComponent(COMPONENTS.TERRAIN)

    entity.components.get(COMPONENTS.TERRAIN).terrainID = reg.id

    dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: entity})
}